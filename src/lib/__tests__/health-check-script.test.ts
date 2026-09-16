import { execFile } from 'node:child_process';
import { mkdtemp, rm } from 'node:fs/promises';
import { createServer, type Server } from 'node:http';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

const script = join(process.cwd(), 'scripts/health-check.sh');
const databaseError = '无法读取 "orders"\n用户\'s 路径：C:\\data';

describe('健康检查脚本的故障通知', () => {
  let server: Server;
  let serverUrl: string;
  let tempDir: string;
  let healthStatus: 200 | 503 | 'disconnect';
  let alerts: { contentType: string | undefined; body: string }[];

  beforeEach(async () => {
    tempDir = await mkdtemp(join(tmpdir(), 'meteor-health-check-'));
    alerts = [];
    healthStatus = 200;
    server = createServer((req, res) => {
      if (req.url === '/api/health') {
        if (healthStatus === 'disconnect') {
          req.socket.destroy();
          return;
        }
        res.writeHead(healthStatus, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          checks: healthStatus === 200
            ? { database: { status: 'ok' } }
            : { database: { status: 'error', error: databaseError } },
        }));
        return;
      }
      if (req.url === '/webhook' && req.method === 'POST') {
        let body = '';
        req.setEncoding('utf8');
        req.on('data', (chunk: string) => { body += chunk; });
        req.on('end', () => {
          alerts.push({ contentType: req.headers['content-type'], body });
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end('{"code":0}');
        });
        return;
      }
      res.writeHead(404).end();
    });
    await new Promise<void>((resolve, reject) => {
      server.once('error', reject);
      server.listen(0, '127.0.0.1', resolve);
    });
    const address = server.address();
    if (!address || typeof address === 'string') throw new Error('测试服务器未监听 TCP 端口');
    serverUrl = `http://127.0.0.1:${address.port}`;
  });

  afterEach(async () => {
    await new Promise<void>((resolve, reject) => {
      server.close((error) => error ? reject(error) : resolve());
    });
    await rm(tempDir, { recursive: true, force: true });
  });

  function runHealthCheck(): Promise<{ code: number; stderr: string }> {
    return new Promise((resolve, reject) => {
      execFile('bash', [script, serverUrl], {
        timeout: 5000,
        // 不继承任何生产密钥、代理或 webhook；日志和 curl 配置也隔离到临时目录。
        env: {
          NODE_ENV: 'test',
          PATH: process.env.PATH,
          CURL_HOME: tempDir,
          NO_PROXY: '127.0.0.1',
          no_proxy: '127.0.0.1',
          HEALTH_CHECK_LOG_FILE: join(tempDir, 'health.log'),
          HEALTH_ALERT_WEBHOOK: `${serverUrl}/webhook`,
        },
      }, (error, _stdout, stderr) => {
        if (error && (typeof error.code !== 'number' || error.killed)) {
          reject(error);
          return;
        }
        resolve({ code: error?.code ?? 0, stderr });
      });
    });
  }

  it('网络断连时真实发送一条不可达告警，并以失败退出', async () => {
    healthStatus = 'disconnect';
    const result = await runHealthCheck();

    expect(alerts).toHaveLength(1);
    expect(alerts[0].contentType).toBe('application/json');
    const payload = JSON.parse(alerts[0].body);
    expect(payload.msg_type).toBe('interactive');
    expect(payload.card.header.title.content).toBe('🚨 Meteor Store 不可达');
    expect(payload.card.elements[0].text.content).toContain(`${serverUrl}/api/health`);
    expect(payload.card.elements[0].text.content).toContain('\n错误: curl:');
    expect(result).toEqual({ code: 1, stderr: '' });
  });

  it('HTTP 503 时发送有效 JSON，完整保留错误中的引号、换行与反斜杠', async () => {
    healthStatus = 503;
    const result = await runHealthCheck();

    expect(alerts).toHaveLength(1);
    expect(alerts[0].contentType).toBe('application/json');
    const payload = JSON.parse(alerts[0].body);
    expect(payload.card.header.title.content).toBe('⚠️ Meteor Store 降级');
    expect(payload.card.elements[0].text.content).toBe(
      `健康检查失败 (HTTP 503)\n\n失败组件:\ndatabase: ${databaseError}`,
    );
    expect(result).toEqual({ code: 1, stderr: '' });
  });

  it('HTTP 200 时成功退出，不发送告警', async () => {
    const result = await runHealthCheck();

    expect(result).toEqual({ code: 0, stderr: '' });
    expect(alerts).toEqual([]);
  });
});
