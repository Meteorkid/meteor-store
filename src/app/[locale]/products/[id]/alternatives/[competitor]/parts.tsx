import type { Locale } from '@/i18n/routing';
import type { AlternativeSection } from '@/data/xisland-alternative-details';

/**
 * 对比子页的表现层组件。
 *
 * 从 page.tsx 拆出来只有一个原因：页面主体已经接近单文件可读性的上限，
 * 而这三块在其它对比页也会复用。
 */

export function ComparisonRow({
  name,
  agents,
  agentsNote,
  license,
  pricing,
  highlight,
}: {
  name: string;
  agents: number;
  agentsNote?: string;
  license: string;
  pricing: string;
  highlight?: boolean;
}) {
  return (
    <tr
      className={`border-b border-white/[0.07] align-top last:border-0 ${
        highlight ? 'bg-violet-500/[0.07]' : ''
      }`}
    >
      <th scope="row" className="px-4 py-4 font-semibold text-white">
        {name}
      </th>
      <td className="px-4 py-4 text-white">
        <span className="text-base font-semibold">{agents}</span>
        {agentsNote && (
          <span className="mt-1 block text-xs leading-snug text-gray-500">{agentsNote}</span>
        )}
      </td>
      <td className="px-4 py-4 text-gray-300">{license}</td>
      <td className="px-4 py-4 text-gray-300">{pricing}</td>
    </tr>
  );
}

export function DetailSections({
  sections,
  locale,
}: {
  sections: AlternativeSection[];
  locale: Locale;
}) {
  return (
    <div className="mb-14 space-y-8">
      {sections.map((section) => (
        <section key={section.heading.zh}>
          <h2 className="mb-3 text-xl font-bold text-white md:text-2xl">{section.heading[locale]}</h2>
          <p className="leading-relaxed text-gray-300">{section.body[locale]}</p>
        </section>
      ))}
    </div>
  );
}

export function ChoiceCard({
  title,
  body,
  highlight,
}: {
  title: string;
  body: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border px-5 py-5 ${
        highlight ? 'border-violet-300/30 bg-violet-500/[0.08]' : 'border-white/10 bg-white/[0.035]'
      }`}
    >
      <h2 className="mb-2 text-base font-semibold text-white">{title}</h2>
      <p className="text-sm leading-relaxed text-gray-300">{body}</p>
    </div>
  );
}

/** 两行对照表：本站一行高亮，竞品一行普通。列标题由调用方传入，保持这个组件与文案解耦。 */
export function ComparisonTable({
  head,
  rows,
}: {
  head: { product: string; agents: string; license: string; pricing: string };
  rows: Array<{
    name: string;
    agents: number;
    agentsNote?: string;
    license: string;
    pricing: string;
    highlight?: boolean;
  }>;
}) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-white/10">
      <table className="w-full min-w-[620px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-white/10 bg-white/[0.04] text-xs uppercase tracking-wider text-gray-400">
            <th scope="col" className="px-4 py-3 font-semibold">{head.product}</th>
            <th scope="col" className="px-4 py-3 font-semibold">{head.agents}</th>
            <th scope="col" className="px-4 py-3 font-semibold">{head.license}</th>
            <th scope="col" className="px-4 py-3 font-semibold">{head.pricing}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <ComparisonRow key={row.name} {...row} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
