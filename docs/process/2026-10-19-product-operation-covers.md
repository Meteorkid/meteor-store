# 2026-10-19 产品原型操作动画

状态：本地验收完成，用户已批准提交与部署；线上结果在收尾补记。首页布局、分组、价格与用户数据不变。

用户指出上一版只是截图缩放，未满足真正动画要求。本版替换截图缩放组件，封面使用12段全新制作的操作短片；原demo.mp4不作封面。

## 实际画面变化

| 产品 | 可见操作 | 制作依据 |
| --- | --- | --- |
| XIsland | 任务文本变化→问答展开→选择原选项→绿勾反馈 | 原截图、demo-media脚本、QuestionAnswerView，分层SVG重建 |
| XNook | 三栏展开→收起音乐条→波形跳动→再展开→暂停/播放 | 原截图及NotchContentView/ExpandedPanelView/MusicVisualizer，分层重建 |
| Statux | 命令逐字输入→彩色状态串输出→TUI导航焦点移动 | 原终端截图、CLI说明；数值保留原参考样例 |
| Claude Phone Control | 启动命令输入→连接状态逐行出现→二维码与占位连接 | 原启动脚本/截图；二维码复用参考图区域，不是有效凭据 |
| OmniCrawl | 键入help命令→逐行显示真实帮助 | 实际--help输出，分层重建，不造GUI |
| Cursor Source Analyzer | 展开/收起两个模块详情 | 原React前端，原backend/data只读JSON |
| Skeleton Anatomy | 拖动旋转真实GLB→选额骨→相机飞行与原生高亮 | 源项目实际Three/R3F页面 |
| Tollow | 定位原文“子曰”→41个字符逐字输入→光标推进 | 原打字应用；隔离浏览器临时练习，不同步账号 |
| Chakra Visualizer | 原生特效预览持续变化 | 现有Sharingan预览Canvas/粒子/剪影；不调用摄像头 |
| WebGL Fluid Sim | 鼠标连续扰动＋原有空格随机溅射→涡流变化 | 现有WebGL模拟器实际渲染 |
| Ex-Memory | 原“我”页→创建面板→逐字填入中性示例 | 当前原生前端空数据fixture，不提交表单、不读取私人数据 |
| UI Design System | 真实按钮按压→Input与Textarea逐字输入 | 原静态构建中的组件页 |

## 技术与验收

- 每段1280×800、30fps、144帧、4.8秒，H.264/yuv420p/faststart，无音轨；总大小见附件validation.json。
- 5段界面逐层重建，7段使用原应用在隔离环境中的实际交互。没有把整页截图缩放当成新的操作动画。输入样例/自动输入速度不代表真实性能测试。
- 对0/1/2.4/3.67/4.77秒取样核对。周期动画不能只比较起末两帧；初始Cursor画面变化不足时已重做为真实展开/收起。
- 封面只在可见时挂载新视频；离屏/切后台卸载，减少动态效果与初始省流量模式保持清晰回退图；播放一次后停止，指针重新进入可重播。预览页提供原生播放/暂停/拖动及整体暂停，循环便于审阅。
- 29项相关测试、变更ESLint、TypeScript/生产构建通过；3058独立next start下Chrome桌面/Pixel 7模拟8项通过，验证每段currentTime实际推进、原始尺寸、离屏卸载、结束重播、减少动态效果、英文回跳、视频失败回退及SSR首图。
- 独立预览实测12段、自动播放、全部暂停/恢复；逐款分镜和桌面/375px手机播放画面已检查。
- 未做实体手机/Safari/Firefox；SSR只验证输出回退图，不宣称整站关闭JS可用。

## 可维护来源

- 界面源：`src/components/product-covers/scenes/NativeScenes.tsx`。
- 重新渲染5段：`pnpm exec tsx scripts/render-native-covers.tsx /tmp/meteor-native-motion-render`，需PATH中的ffmpeg；生成结果需验收后再复制到public/products。
- 其余7段的隔离服务、采集脚本、输入步骤、帧样本、ffprobe数据和SHA256存入Obsidian附件；没有修改源产品的业务代码。
- 网站使用`cover-motion.mp4`和`cover-motion.webp`，旧低清demo继续只供详情画廊。

用户已明确确认提交上线。本轮重新使用生产配置构建，不上传隔离测试产物。

收尾：原本地.next已恢复，全部本轮临时服务已停止。内置浏览器工具拒绝file://自动打开，未绕过；可交付HTML/MP4供用户手动打开，Chrome预览验证在该拒绝之前已完成。
