import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import ExMemoryExperienceFrame from '../ExMemoryExperienceFrame';

describe('ExMemoryExperienceFrame', () => {
  it('iframe 无装饰地占满整个动态视口', () => {
    const html = renderToStaticMarkup(
      <ExMemoryExperienceFrame
        loadingLabel="loading"
        title="Ex-Memory"
        unavailableLabel="unavailable"
        retryLabel="retry"
      />,
    );

    expect(html).toContain('h-dvh');
    expect(html).toContain('w-screen');
    expect(html).not.toContain('rounded-3xl');
    expect(html).not.toContain('min-h-[680px]');
  });

  it('收到运行时就绪消息后取消超时计时器', () => {
    const source = readFileSync(
      resolve(process.cwd(), 'src/components/ExMemoryExperienceFrame.tsx'),
      'utf8',
    );
    const readyBranch = source
      .split("if (event.data?.type === 'ex-memory:ready')", 2)[1]
      .split("} else if (event.data?.type === 'ex-memory:session-expired')", 1)[0];

    expect(readyBranch).toContain('window.clearTimeout(timeout)');
  });
});
