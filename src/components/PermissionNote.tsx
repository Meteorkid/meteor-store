import { Fragment } from 'react';
import type { Locale } from '@/i18n/routing';
import { xislandPermissionNote, type Span } from '@/data/xisland-permission';

// 行内强调用弱一级的灰而不是纯白：这段是说明文字，不该和标题抢层级。
const strongClass = 'font-semibold text-gray-200';
// 路径不折行：断在 /Applications/X 和 Island.app 之间会让命令看起来像两条。
// 最窄 320px 视口下这一行仍放得下，不会撑破卡片。
const codeClass =
  'whitespace-nowrap rounded-md border border-white/15 bg-black/50 px-1.5 py-0.5 font-mono text-[12px] text-gray-200';
// marker 属于 <li>，写在 <ol> 上不生效（::marker 只挂在列表项自己身上）。
const stepClass = 'marker:font-semibold marker:text-violet-300';

/**
 * 「继续下一步」的辅助功能授权说明。
 *
 * 为什么单独成块：这是**装好之后**才会撞上的问题。用户点了「继续下一步」，
 * 指令复制成功、终端窗口也切过去了，但自动粘贴没发生——看起来就是功能坏了。
 * 应用本身只会打开辅助功能设置页并在 Finder 里选中自己，没余地说清
 * 「要手动拖进去」「每次更新都要重拖一次」。写进产品页，客服和搜索引擎
 * 才有可指的落点。
 *
 * 产品判断放在组件里而不是页面里：这段只对 XIsland 成立（它要向终端发按键），
 * 放在这里就能用单测钉住「别的产品页不会冒出这段」。
 *
 * 保持同步组件：整页单测用 `renderToStaticMarkup` 渲染，异步子组件会直接抛
 * 「A component suspended…」。所以文案从 data 取，不在这里 await 翻译。
 */
export default function PermissionNote({ productId, locale }: { productId: string; locale: Locale }) {
  if (productId !== 'xisland') return null;

  const copy = xislandPermissionNote[locale];

  return (
    // `permission-note` 是稳定的语义钩子（样式走 Tailwind，类名留给测试与将来的锚点）
    <section className="permission-note mb-20 max-w-3xl rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-7">
      <h3 className="t-title-4 text-white">{copy.title}</h3>
      <p className="mt-3 text-sm leading-6 text-gray-300">{copy.intro}</p>

      {/* 用 <ol> 而不是带序号的段落：这三步是有先后顺序的操作，读屏软件会念出序号 */}
      <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-6 text-gray-400">
        {copy.steps.map((spans, step) => (
          <li key={step} className={stepClass}>
            {spans.map(renderSpan)}
          </li>
        ))}
      </ol>

      {/* 先说「不授权也不会中断」再收尾：用户看完三步最容易的判断是「那我不如不用了」 */}
      <p className="mt-4 border-t border-white/10 pt-4 text-sm leading-6 text-gray-300">
        {copy.fallback}
      </p>
    </section>
  );
}

/** 文案片段渲染：纯文本 / 加粗 / 行内代码三种，索引只用于 React key。 */
function renderSpan(span: Span, index: number) {
  if (typeof span === 'string') return <Fragment key={index}>{span}</Fragment>;
  if ('strong' in span) {
    return (
      <strong key={index} className={strongClass}>
        {span.strong}
      </strong>
    );
  }
  return (
    <code key={index} className={codeClass}>
      {span.code}
    </code>
  );
}
