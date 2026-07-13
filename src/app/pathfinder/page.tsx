import type { Metadata } from 'next';
import Link from 'next/link';
import PathfinderClient from './PathfinderClient';

export const metadata: Metadata = {
  title: 'Meteor Pathfinder 星途导航 · 免费学习路径生成',
  description:
    '面向资源不足学生的免费 AI 学习与成长路径导航。填写目标、设备、时间、网络条件，生成可执行的本周行动计划。',
  robots: { index: true, follow: true },
};

export default function PathfinderPage() {
  return (
    <main className="min-h-screen pb-24 pt-12 sm:pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Hero */}
        <section className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 mb-6 flex-wrap justify-center">
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-6/20 text-purple-200 border border-purple-5/30">
              主赛道 · 学习工作
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-orange-500/15 text-orange-300 border border-orange-500/30">
              附加赛题 · 社会公益
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/15 text-green-300 border border-green-500/30">
              永久免费
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold mb-4 gradient-text">
            Meteor Pathfinder · 星途导航
          </h1>
          <p className="text-lg sm:text-xl text-foreground/80 leading-relaxed max-w-2xl mx-auto">
            让每个学生都拥有一张<span className="text-purple-300 font-semibold">走得通</span>的成长地图
          </p>
          <p className="mt-4 text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed">
            资源不足的学生常常缺少稳定指导、信息分散、设备或网络受限。
            在这里，只需一个目标，就能得到一份基于你现实条件的可执行路径。
          </p>
        </section>

        {/* 痛点说明 */}
        <section className="mb-12 sm:mb-16">
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-6 text-center">
            他们面对的三道坎
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {PAINS.map((p) => (
              <div key={p.title} className="glass-card rounded-2xl p-5">
                <div className="text-2xl mb-3" aria-hidden="true">{p.icon}</div>
                <h3 className="font-semibold text-foreground mb-2">{p.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 表单与结果 */}
        <PathfinderClient />

        {/* 公益承诺区 */}
        <section className="mt-16 sm:mt-24 max-w-3xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-6 text-center">
            公益承诺
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {PLEDGES.map((p) => (
              <div key={p.title} className="glass-card rounded-2xl p-5">
                <div className="text-2xl mb-2" aria-hidden="true">{p.icon}</div>
                <h3 className="font-semibold text-foreground mb-1">{p.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>

          {/* 隐私说明 */}
          <div className="mt-6 text-xs text-muted-foreground bg-black/15 border border-white/10 rounded-xl p-4 leading-relaxed">
            <p className="font-medium text-foreground/80 mb-1">隐私说明</p>
            <p>
              本站不要求姓名、学校、手机号、住址，且不长期保存输入。
              你的 API Key、Base URL 与模型名称仅保存在当前浏览器会话；生成时，它们会与目标和学习条件一次性发送至你选择的 AI 模型服务商处理。
              请勿填写身份信息、联系方式、住址或其他敏感个人信息。
              生成的路径建议不作升学、就业、医疗或心理诊断承诺。
            </p>
          </div>
        </section>

        {/* 结尾行动号召 */}
        <section className="mt-16 sm:mt-24 text-center">
          <p className="text-2xl sm:text-3xl font-bold gradient-text mb-4">
            资源不该决定一个学生能走多远
          </p>
          <Link
            href="#pathfinder-form"
            className="inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-purple-6 to-violet-6 text-white font-semibold shadow-lg shadow-purple-6/30 hover:shadow-purple-6/50 transition"
          >
            开始生成我的路径
          </Link>
        </section>
      </div>
    </main>
  );
}

const PAINS = [
  {
    icon: '🗺️',
    title: '缺少稳定的指导',
    desc: '没有可以长期请教的老师或前辈，规划只能靠自己摸索，常常走弯路。',
  },
  {
    icon: '🧩',
    title: '信息分散不知从何开始',
    desc: '网上资料很多，却不知哪些适合自己、按什么顺序学，反而迟迟无法开始。',
  },
  {
    icon: '📱',
    title: '设备、流量、时间都有限',
    desc: '只有一部手机、流量吃紧、课余时间零碎，被大部分课程无声地挡在门外。',
  },
] as const;

const PLEDGES = [
  {
    icon: '🎁',
    title: '核心功能永久免费',
    desc: '路径生成、行动计划、资源推荐对所有学生完全免费，永不收费。',
  },
  {
    icon: '🔒',
    title: '不收集敏感信息',
    desc: '不要求填写真实姓名、学校、手机号、住址。只需一个目标就能开始。',
  },
  {
    icon: '🚫',
    title: '不推荐付费产品',
    desc: '结果中不会出现购买、会员、课程售卖等引导，路径不为变现服务。',
  },
  {
    icon: '📡',
    title: '低流量优先',
    desc: '资源排序优先考虑免费、公开、低流量可访问的内容，照顾网络受限的同学。',
  },
] as const;
