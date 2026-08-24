import { describe, expect, it } from 'vitest'
import { normalizePracticeInputCharacter } from '../typingInput'

describe('Tollow 打字输入字符归一化', () => {
  it('把编辑区产生的不换行空格按原文普通空格处理', () => {
    expect(normalizePracticeInputCharacter('\u00a0', ' ')).toBe(' ')
  })

  it('允许键盘普通空格匹配原文中的全角空格', () => {
    expect(normalizePracticeInputCharacter(' ', '\u3000')).toBe('\u3000')
  })

  it('把非空白位置收到的不换行空格保留为可忽略的普通空格', () => {
    expect(normalizePracticeInputCharacter('\u00a0', '字')).toBe(' ')
  })
})
