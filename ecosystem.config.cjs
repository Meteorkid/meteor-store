// PM2 进程配置 —— 阿里云轻量服务器生产部署
// 用法：pm2 start ecosystem.config.cjs（或由 deploy.sh 自动 reload）
//
// 说明：
// - 直接管理 next start 的 Node 进程，让内存阈值覆盖实际服务而不是 pnpm 包装进程
// - cwd 指向项目根，next start 会自动加载根目录的 .env.production（NODE_ENV=production）
// - 启动命令显式传入 --hostname 127.0.0.1，Next 只监听回环地址，由本机 Nginx 反代
module.exports = {
  apps: [
    {
      name: 'meteor-store',
      script: `${__dirname}/node_modules/next/dist/bin/next`,
      args: ['start', '--hostname', '127.0.0.1', '--port', '3000'],
      interpreter: '/usr/local/bin/node',
      cwd: __dirname,
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        // 阿里云实例当前没有可用的公网 IPv6；优先 IPv4，避免外部 Feed 在 IPv6 连接上耗尽超时。
        NODE_OPTIONS: '--dns-result-order=ipv4first',
        PORT: 3000,
        HOSTNAME: '127.0.0.1',
        TRUST_NGINX_PROXY: '1',
      },
      // 2G 机器：进程内存上限压低到 1G，避免和系统/nginx 抢内存；超限自动重启
      max_memory_restart: '1024M',
      out_file: '/var/log/meteor-store/pm2-out.log',
      error_file: '/var/log/meteor-store/pm2-error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      // 公安备案要求日志留存 ≥ 60 天
      retain_days: 60,
      max_log_file_size: '10M',
      autorestart: true,
    },
  ],
};
