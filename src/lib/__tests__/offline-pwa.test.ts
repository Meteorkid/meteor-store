import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

/**
 * 架构约束测试：离线兜底页与 PWA。
 *
 * 这一整套的共同特点是**坏掉时不报错，只是静默失效**：
 *   - manifest / sw.js 被 next-intl 重定向成 404 → 浏览器只是不再提示安装、SW 装不上；
 *   - 兜底页少缓存一个依赖 → 断网时才裂图，而断网正是最没人盯着的时候；
 *   - SW 缓存策略被放宽到普通页面 → 用户卡在旧版本，且极难归因。
 * 所以这些约束不能只靠注释，全部钉在 CI 上。
 */

const ROOT = process.cwd();
const read = (p: string) => readFileSync(join(ROOT, p), 'utf8');

const proxy = read('src/proxy.ts');
const sw = read('public/sw.js');
const offlineHtml = read('public/offline.html');
/** 注释里写满了「不要这样做」的反例，检测真实标记前先剥掉 */
const offlineBody = offlineHtml.replace(/<!--[\s\S]*?-->/g, '');
const manifest = read('src/app/manifest.ts');

/** 去掉行注释和块注释，避免注释里的说明文字被当成真实代码匹配上 */
function stripComments(src: string): string {
  return src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
}

describe('proxy matcher 放行 PWA 相关路径', () => {
  const matcher = stripComments(proxy)
    .match(/matcher:\s*\[\s*'([^']+)'/)?.[1]
    // 源码里的 '\\.' 是 TS 字符串字面量，运行时值是 '\.'。
    // 不还原的话 new RegExp 会把它当成"匹配一个反斜杠"，后缀排除规则全部失效，
    // 测试反而会绿着放过真正的问题
    .replace(/\\\\/g, '\\');

  it('能取到 matcher 正则', () => {
    expect(matcher).toBeTruthy();
  });

  it.each(['/manifest.webmanifest', '/sw.js', '/offline.html', '/meteor-runner.js'])(
    '%s 不被 proxy 接管（否则会被重定向成 /zh/... 然后 404）',
    (path) => {
      // matcher 是「不匹配即放行」的负向前瞻，命中代表会被 next-intl 处理
      expect(new RegExp(`^${matcher}$`).test(path)).toBe(false);
    }
  );

  it('普通页面路径仍然被 proxy 接管', () => {
    expect(new RegExp(`^${matcher}$`).test('/products')).toBe(true);
  });
});

describe('Service Worker 只做离线兜底，不参与正常内容分发', () => {
  const code = stripComments(sw);

  it('只在导航请求上返回兜底页', () => {
    expect(code).toMatch(/req\.mode === 'navigate'/);
  });

  it('非 GET 请求一律不接管', () => {
    expect(code).toMatch(/req\.method !== 'GET'/);
  });

  it('不缓存 Next 构建产物', () => {
    // 出现 _next 说明有人开始拿 SW 缓存 JS/CSS chunk，那正是"卡在旧版本"的起点
    expect(code).not.toMatch(/_next/);
  });

  it('导航请求走网络优先，而不是缓存优先', () => {
    // 先 fetch 再 .catch 回落缓存；写成 caches.match(...).then(r => r || fetch(...)) 就反了
    expect(code).toMatch(/fetch\(req\)\.catch\(/);
  });

  it('预缓存清单之外的资源不注册 respondWith', () => {
    expect(code).toMatch(/PRECACHE\.includes\(url\.pathname\)/);
  });

  it('缓存 key 用不带 query 的路径', () => {
    // 判断走 pathname 但 put 存完整 URL 的话，带任何查询参数的请求都会
    // 各自占一条记录，同一个文件在缓存里堆好几份，离线回退还只找得到其中一条
    expect(code).toMatch(/const key = new Request\(url\.pathname\)/);
    expect(code).toMatch(/c\.put\(key, copy\)/);
    expect(code).toMatch(/caches\.match\(key\)/);
    // 不能再出现按原始 request 存取的写法
    expect(code).not.toMatch(/c\.put\(req,/);
  });

  it('activate 时清掉非当前版本的 cache', () => {
    expect(code).toMatch(/caches\.delete/);
    expect(code).toMatch(/k !== CACHE/);
  });
});

describe('离线兜底页自给自足', () => {
  const precache = JSON.parse(
    (stripComments(sw).match(/const PRECACHE = (\[[^\]]+\])/)?.[1] ?? '[]').replace(/'/g, '"')
  ) as string[];

  it('预缓存清单里的文件都真实存在于 public/', () => {
    expect(precache.length).toBeGreaterThan(0);
    for (const p of precache) {
      expect(existsSync(join(ROOT, 'public', p)), `${p} 不存在`).toBe(true);
    }
  });

  it('兜底页引用的每个同源资源都在预缓存清单里', () => {
    // 少一个就是断网时的裂图或哑掉的游戏
    const refs = [...offlineBody.matchAll(/(?:src|href)="(\/[^"]+)"/g)].map((m) => m[1]);
    expect(refs.length).toBeGreaterThan(0);
    for (const ref of refs) {
      if (ref === '/') continue; // 「重新连接」按钮是导航链接，不是资源
      expect(precache, `${ref} 没进 SW 预缓存`).toContain(ref);
    }
  });

  it('兜底页没有内联 <script>', () => {
    // proxy 目前排除 .html 所以本页没有 CSP 头，但这个前提可能变；
    // 而兜底页只在断网时出现，是全站最不容易发现坏掉的地方
    const inline = [...offlineBody.matchAll(/<script(?![^>]*\ssrc=)[^>]*>/g)];
    expect(inline).toHaveLength(0);
  });

  it('提示文字对比度不低于全站基线', () => {
    // 全站约定：承载信息的文字 ≥ white/60。这行是唯一的操作说明，
    // 调淡了「看起来更精致」但读不清就是缺陷
    const hint = offlineBody.match(/#mr-hint\s*\{[^}]*color:\s*rgba\([^)]*?,\s*([\d.]+)\)/)?.[1];
    expect(hint).toBeTruthy();
    expect(Number(hint)).toBeGreaterThanOrEqual(0.6);
  });

  it('兜底页不引用 Next 的构建产物样式', () => {
    // globals.css 的产物文件名带 hash 且不在预缓存里，断网必然 404
    expect(offlineBody).not.toMatch(/_next|globals\.css/);
  });

  it('兜底页固定暗色，与全站主题一致', () => {
    expect(offlineBody).toMatch(/content="dark"/);
    expect(offlineBody).not.toMatch(/prefers-color-scheme/);
  });

  it('-webkit-backdrop-filter 写在标准属性之前', () => {
    // Lightning CSS 去重时保留最后一条，顺序反了会把标准属性删掉
    const webkit = offlineHtml.indexOf('-webkit-backdrop-filter');
    const std = offlineHtml.indexOf('\n    backdrop-filter');
    expect(webkit).toBeGreaterThan(-1);
    expect(webkit).toBeLessThan(std);
  });
});

describe('离线兜底页的双语', () => {
  /**
   * /offline.html 是一份静态文件，服务端没法按 Accept-Language 给两个版本，
   * 所以文案由引擎在加载时按 navigator.language 填。漏一个键的后果是
   * 某种语言下页面上突然露出另一种语言，而这个页面只在断网时出现，最难被发现。
   */
  const engine = read('public/meteor-runner.js');

  /** 从引擎源码里抠出 TEXT 的某个语言块的键名 */
  function textKeys(locale: 'zh' | 'en'): string[] {
    const block = engine.match(new RegExp(`${locale}: \\{([\\s\\S]*?)\\n    \\},`))?.[1] ?? '';
    return [...block.matchAll(/^\s{6}(\w+):/gm)].map((m) => m[1]).sort();
  }

  it('中英文案的键完全对齐', () => {
    const zh = textKeys('zh');
    const en = textKeys('en');
    expect(zh.length).toBeGreaterThan(5);
    expect(zh).toEqual(en);
  });

  it('页面上每个待翻译节点都有对应文案', () => {
    const keys = new Set(textKeys('zh'));
    const used = [...offlineBody.matchAll(/data-mr-t(?:-aria)?="(\w+)"/g)].map((m) => m[1]);
    expect(used.length).toBeGreaterThan(0);
    for (const k of used) {
      expect(keys.has(k), `offline.html 用了 data-mr-t="${k}"，但 TEXT 里没有这个键`).toBe(true);
    }
  });

  it('在线态文案有对应的离线态文案', () => {
    /**
     * 这个页面有两种到达方式：断网时被 SW 兜过来，或者有人直接打开它。
     * 网通着还说「你离线了」会让人以为站点坏了，所以有两套文案。
     * xxxOnline 存在就必须有 xxx 兜底，否则在线分支缺失时会显示空白。
     */
    const zh = textKeys('zh');
    const onlineKeys = zh.filter((k) => k.endsWith('Online'));
    expect(onlineKeys.length).toBeGreaterThan(0);
    for (const k of onlineKeys) {
      const base = k.replace(/Online$/, '');
      expect(zh, `${k} 缺少离线态的 ${base}`).toContain(base);
    }
  });

  it('文案按 navigator.onLine 选择', () => {
    const engine = read('public/meteor-runner.js');
    expect(engine).toMatch(/navigator\.onLine !== false/);
    // 玩的过程中断网/恢复要跟着切
    expect(engine).toMatch(/addEventListener\('online', paintCopy\)/);
    expect(engine).toMatch(/addEventListener\('offline', paintCopy\)/);
  });

  it('html 标签标了 data-mr-auto-lang', () => {
    // 少了它引擎不会回写 lang，英文用户会拿到 lang="zh-CN"，影响读屏发音和断行
    expect(offlineHtml).toMatch(/<html[^>]*\sdata-mr-auto-lang/);
  });
});

describe('页脚的游戏入口', () => {
  const footer = read('src/components/Footer.tsx');

  it('用原生 <a> 而不是 next-intl 的 Link', () => {
    /**
     * /offline.html 是 public/ 下的静态文件。next-intl 的 Link 会给它加上
     * locale 前缀变成 /zh/offline.html，那是个 404——而且是个安静的 404：
     * 页脚链接没人天天点，坏了很久也不会有人报。
     */
    const anchor = footer.match(/<a\s+href="\/offline\.html"[\s\S]*?<\/a>/);
    expect(anchor, '页脚里找不到指向 /offline.html 的原生 <a>').toBeTruthy();
    // 不能出现 <Link href="/offline.html">
    expect(footer).not.toMatch(/<Link[^>]*href=["']\/offline\.html/);
  });

  it('给读屏用户说明这是什么', () => {
    // 可见文案是句闲笔，不说破用途；aria-label 补上真实用途
    expect(footer).toMatch(/aria-label=\{t\('playAwayLabel'\)\}/);
  });

  it('对比度不低于全站基线', () => {
    // 「不起眼」不等于「看不清」——承载信息的文字 ≥ white/60
    const anchor = footer.match(/<a\s+href="\/offline\.html"[\s\S]*?>/)?.[0] ?? '';
    const tone = anchor.match(/text-white\/(\d+)/)?.[1];
    expect(tone).toBeTruthy();
    expect(Number(tone)).toBeGreaterThanOrEqual(60);
  });
});

describe('PWA manifest', () => {
  it('引用的图标文件都存在', () => {
    const srcs = [...manifest.matchAll(/src: '([^']+)'/g)].map((m) => m[1]);
    expect(srcs.length).toBeGreaterThanOrEqual(2);
    for (const s of srcs) {
      expect(existsSync(join(ROOT, 'public', s)), `${s} 不存在`).toBe(true);
    }
  });

  it('提供 apple-touch-icon', () => {
    // iOS Safari 不读 manifest 的 icons，缺了它「添加到主屏幕」会拿页面截图当图标
    const layout = read('src/app/[locale]/layout.tsx');
    const apple = layout.match(/apple:\s*"([^"]+)"/)?.[1];
    expect(apple).toBeTruthy();
    expect(existsSync(join(ROOT, 'public', apple!))).toBe(true);
  });

  it('提供 maskable 图标', () => {
    // 缺了它 Android 会把方形图标直接裁圆，四角连同字母一起被切掉
    expect(manifest).toMatch(/purpose: 'maskable'/);
  });

  it('主题色与根布局的 viewport 一致', () => {
    const rootLayout = read('src/app/layout.tsx');
    const layoutTheme = rootLayout.match(/themeColor: '([^']+)'/)?.[1];
    const manifestTheme = manifest.match(/theme_color: '([^']+)'/)?.[1];
    expect(manifestTheme).toBe(layoutTheme);
  });

  it('start_url 不写死 locale', () => {
    // 写死 /zh 会让英文用户从桌面图标点进来永远落到中文站
    expect(manifest).toMatch(/start_url: '\/'/);
  });
});

describe('游戏引擎被两个入口共用', () => {
  const engine = read('public/meteor-runner.js');

  it('是普通脚本而非 ES module', () => {
    // 一旦有人加了 export，/offline.html 的 <script src> 就会直接报错
    expect(engine).not.toMatch(/^\s*export\s/m);
    expect(engine).not.toMatch(/^\s*import\s/m);
  });

  it('挂在 window 上供 React 侧读取', () => {
    expect(engine).toMatch(/window\.MeteorRunner = MeteorRunner/);
  });

  it('只在带 data-meteor-runner-auto 的页面自动初始化', () => {
    // React 组件靠"没有这个属性"来避免被自动接管
    expect(engine).toMatch(/canvas\[data-meteor-runner-auto\]/);
  });

  it('提供 destroy 以解绑全局监听', () => {
    // 监听挂在 window/document 上，React unmount 不清会随路由切换累积
    expect(engine).toMatch(/MeteorRunner\.prototype\.destroy/);
  });
});
