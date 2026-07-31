import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: '用户许可协议 - Meteor Store',
  description: 'Meteor Store 产品的最终用户许可协议（EULA）',
};

export default function EulaPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto prose prose-invert prose-gray">
          <h1 className="text-4xl font-bold mb-8">最终用户许可协议</h1>
          <p className="text-gray-400 text-sm mb-8">最后更新：2026 年 7 月</p>

          <section className="mb-8">
            <p className="text-gray-300 leading-relaxed">
              本最终用户许可协议（以下简称「本协议」）是您与 Meteor Store
              （以下简称「我们」）之间就购买、下载、安装或使用我们提供的任何数字产品
              （包括但不限于软件工具、设计资源、源代码、文档，以下简称「产品」）所订立的协议。
              请您在使用产品前完整阅读本协议。下单支付、下载、安装或使用产品，
              即视为您已充分理解并接受本协议全部条款；若不同意，请勿购买或使用。
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. 授权范围</h2>
            <ul className="text-gray-300 leading-relaxed space-y-1 list-disc list-inside">
              <li>购买产品后，我们授予您一项<strong>非独占、不可转让、可撤销</strong>的使用许可。</li>
              <li>个人版 / 个人许可证：仅限您本人使用，可在您本人名下的多台设备上安装。</li>
              <li>团队版：授权范围内的成员可使用，授权人数以上限为准，不得超出。</li>
              <li>一次性购买的产品永久可用，包括我们自行决定提供的免费小版本更新；大版本更新可能另行收费。</li>
              <li>开源许可证明确许可的产品（如 MIT / Apache-2.0），其开源部分继续按对应许可证授权，本协议不覆盖开源部分。</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. 授权限制</h2>
            <p className="text-gray-300 leading-relaxed mb-2">在未获得我们书面同意的情况下，您不得：</p>
            <ul className="text-gray-300 leading-relaxed space-y-1 list-disc list-inside">
              <li>复制、转载、再分发、出售、出租、出借、转授权或以其他方式将产品提供给第三方（团队授权的内部共享除外）；</li>
              <li>以任何形式将激活码、邀请码或授权凭证公开（包括上传到代码托管平台、网盘、论坛等）；</li>
              <li>对产品进行反向工程、反编译、反汇编，或绕过技术保护措施；</li>
              <li>删除、遮挡或篡改产品中的版权、商标或其他权利声明；</li>
              <li>将产品用于违法活动，或制作侵权、有害内容。</li>
            </ul>
            <p className="text-gray-300 leading-relaxed mt-2">
              开源许可证允许的行为不受上述限制影响。
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. 知识产权</h2>
            <p className="text-gray-300 leading-relaxed">
              除开源部分另有约定外，产品及其相关内容（包括但不限于源代码、界面设计、
              文档、名称、标识）的全部知识产权归我们或相应权利人所有。您购买产品获得的
              仅为按本协议约定使用的许可，并不导致知识产权的转让。
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. 激活码与邀请码</h2>
            <ul className="text-gray-300 leading-relaxed space-y-1 list-disc list-inside">
              <li>每个激活码与对应订单或邀请兑换记录绑定，是您使用产品的凭证，请妥善保管。</li>
              <li>激活码请勿公开分享。我们有权对在公开渠道传播的激活码进行停用。</li>
              <li>因您本人保管不善导致激活码泄漏所造成的损失，由您自行承担；请第一时间联系我们尝试补救。</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. 产品的现状提供与免责</h2>
            <p className="text-gray-300 leading-relaxed">
              产品以「现状」和「可用之状」提供，我们不就产品的适销性、特定用途适用性、
              不侵权等作出明示或默示的保证。在适用法律允许的最大范围内，我们对因使用
              或无法使用产品而导致的任何直接、间接、偶然或后果性损失不承担责任。
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. 终止</h2>
            <p className="text-gray-300 leading-relaxed">
              若您违反本协议，我们有权随时中止或终止您的使用许可，相关激活码随之失效。
              协议终止后，您应停止使用产品并删除所有副本（开源部分除外）。
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. 协议变更</h2>
            <p className="text-gray-300 leading-relaxed">
              我们可能不时更新本协议。重大变更将通过网站公告或邮件告知。继续使用产品
              即视为接受更新后的协议；不同意则应停止使用并按退款政策处理。
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. 联系方式</h2>
            <p className="text-gray-300 leading-relaxed">
              如对本协议有任何问题，请联系：
            </p>
            <p className="text-gray-300 mt-2">
              邮箱：<a href="mailto:meteor@stu.gpnu.edu.cn" className="text-purple-400 hover:text-purple-300">meteor@stu.gpnu.edu.cn</a>
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
