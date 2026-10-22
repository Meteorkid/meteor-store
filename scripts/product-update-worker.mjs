import { runProductUpdateJob } from '../src/lib/product-updates/worker.ts';

const id = process.argv[2];
if (!/^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(id ?? '')) process.exit(2);
await runProductUpdateJob(id);
