import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readStateFile, processIdentity, isActiveJob } from '../src/lib/product-updates/state.ts';

/** 只读部署守卫，绝不调用会回收/改写job.json的readJob。 */
export async function assertIdleProductUpdates(record, identity = processIdentity, alive = pid => {
  try { process.kill(pid, 0); return true; }
  catch (error) { if (error.code === 'ESRCH') return false; return true; }
}) {
  if (record === null) return;
  if (!record?.job || !['queued', 'running', 'completed', 'partial', 'failed'].includes(record.job.status)
    || (record.pid !== null && (!Number.isSafeInteger(record.pid) || record.pid <= 0))) throw new Error('product-update-state-invalid');
  if (isActiveJob(record.job)) throw new Error('product-update-active');
  if (record.pid && await alive(record.pid)) {
    const currentIdentity = await identity(record.pid);
    // 已完成的记录仍可能有worker收尾；身份读不到时也不能猜测它已退出。
    if (!record.processIdentity || !currentIdentity || currentIdentity === record.processIdentity) throw new Error('product-update-worker-alive');
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    await assertIdleProductUpdates(await readStateFile('job'));
    console.log('产品同步部署守卫：空闲');
  } catch {
    console.error('ERROR: 产品同步进行中或状态无法确认，拒绝部署；未修改任务记录');
    process.exitCode = 1;
  }
}
