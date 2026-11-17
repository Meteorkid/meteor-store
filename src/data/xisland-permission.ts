import type { Locale } from '@/i18n/routing';

/**
 * 「继续下一步」的辅助功能授权说明。
 *
 * 为什么放在 data 而不是 messages：这段带行内加粗与代码块（拖拽对象、bundle 路径），
 * 拆成消息键就会变成「前半句 / 加粗词 / 后半句+标点」三把钥匙，任何一处改动都要
 * 两个语言同步改三处；整段留在这里，中英各一份完整句子，读起来就是最终排版。
 * 与 `xisland-integrations.ts` 的 integrationSectionCopy 同一考虑。
 *
 * 事实来源是 XIsland 本体（`SessionJumpState.pasteClipboard` / `revealForAccessibility`）：
 * 未授权时不会弹系统询问框，而是复制成功、粘贴失败，再打开辅助功能设置页并在
 * Finder 里选中 App。所以这里写的是「拖进去」，不是「点允许」。
 */
export type Span = string | { strong: string } | { code: string };

export interface PermissionNoteCopy {
  title: string;
  intro: string;
  /** 每一步由若干片段组成：纯文本 / 加粗 / 行内代码。 */
  steps: Span[][];
  fallback: string;
}

export const xislandPermissionNote: Record<Locale, PermissionNoteCopy> = {
  zh: {
    title: '辅助功能权限说明',
    intro: '「继续下一步」需要向终端窗口发送 ⌘V，macOS 要求应用获得「辅助功能」权限。',
    steps: [
      ['首次点击时，X Island 会自动打开「系统设置 → 隐私与安全性 → 辅助功能」，并在 Finder 中选中应用。'],
      [
        '把 Finder 里的 ',
        { strong: 'X Island' },
        ' 拖入辅助功能列表（或点 ',
        { code: '+' },
        ' 选择 ',
        { code: '/Applications/X Island.app' },
        '）。',
      ],
      [
        { strong: '每次更新版本后需要重新拖入一次' },
        '：应用使用 adhoc 签名，macOS 会把新版本视为另一个应用并撤销旧授权。',
      ],
    ],
    fallback: '未授权时功能不会中断：指令已复制到剪贴板，手动 ⌘V 后回车即可发送。',
  },
  en: {
    title: 'Accessibility permission',
    intro: '"Continue" sends ⌘V to the terminal window, so macOS requires Accessibility permission for the app.',
    steps: [
      ['The first time you click it, X Island opens System Settings → Privacy & Security → Accessibility and selects the app in Finder.'],
      [
        'Drag ',
        { strong: 'X Island' },
        ' from Finder into the Accessibility list (or click ',
        { code: '+' },
        ' and pick ',
        { code: '/Applications/X Island.app' },
        ').',
      ],
      [
        { strong: 'You have to add it again after every update' },
        ': the app is adhoc-signed, so macOS treats the new build as a different app and revokes the previous grant.',
      ],
    ],
    fallback: 'Without the permission nothing breaks: the command is already on your clipboard — press ⌘V and Return to send it.',
  },
};
