import { describe, expect, it } from 'vitest';
import { toggleMultipleAnswer } from '../listening-answers';

/**
 * 多选题的勾选映射。判分只看字母集合，所以这里真正要紧的是：
 * 字母按勾选顺序占题号、取消后重新压紧、超过 select 不再接受、范围外的作答不受影响。
 */

describe('toggleMultipleAnswer', () => {
  it('按勾选顺序把字母落到连续题号上', () => {
    expect(toggleMultipleAnswer({}, [29, 30], 2, 'C')).toEqual({ '29': 'C' });
    expect(toggleMultipleAnswer({ '29': 'C' }, [29, 30], 2, 'A')).toEqual({ '29': 'C', '30': 'A' });
  });

  it('取消中间的一项后把剩下的字母重新压紧，不留空洞', () => {
    const answers = { '28': 'B', '29': 'D', '30': 'F' };
    expect(toggleMultipleAnswer(answers, [28, 29, 30], 3, 'D')).toEqual({ '28': 'B', '29': 'F' });
  });

  it('达到 select 上限后忽略新的勾选', () => {
    expect(toggleMultipleAnswer({ '29': 'A', '30': 'B' }, [29, 30], 2, 'C')).toEqual({ '29': 'A', '30': 'B' });
  });

  it('取消唯一一项时删除该题号的键', () => {
    expect(toggleMultipleAnswer({ '29': 'A' }, [29, 30], 2, 'A')).toEqual({});
  });

  it('不影响同一篇里其它题块的作答，也不修改传入对象', () => {
    const answers = { '1': 'Krause', '29': 'A' };
    const next = toggleMultipleAnswer(answers, [29, 30], 2, 'B');
    expect(next).toEqual({ '1': 'Krause', '29': 'A', '30': 'B' });
    expect(answers).toEqual({ '1': 'Krause', '29': 'A' });
  });
});
