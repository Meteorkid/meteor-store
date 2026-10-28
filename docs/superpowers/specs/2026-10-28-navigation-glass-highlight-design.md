# 一级导航玻璃高亮

用户希望优化一级名称点击后的高亮，参考 Apple Liquid Glass。延续现有暗色导航、名称直达和独立箭头，用本地可预览版本验证视觉。

## 方案

采用名称玻璃胶囊：当前栏目常亮，悬停轻亮，按下即时增加反光并轻微压缩装饰层。箭头独立圆形反馈，展开时保持可辨识状态。名称文字不参与缩放；键盘焦点轮廓单独保留。手机保持整行名称点击区域，只在标题周围呈现胶囊。

比较：仅调灰底难以呈现材质；跨导航滑动的共享胶囊需要几何测量并处理路由重挂载，超出本次小范围视觉优化。选择 CSS 局部玻璃，使用细亮边、内高光、轻阴影与渐变近似网页材质，不宣称复刻 Apple 原生光学渲染。

## 边界与验收

- 仅修改 Header 的局部 CSS；必要时为视觉状态补标记，不改导航数据或事件逻辑，不新增依赖。
- 不在 navGroup/bar/desktopNav 上增加定位、滤镜或 transform，防止全宽下拉面板的包含块发生变化；装饰层 pointer-events:none。
- 桌面触控区域不缩小；保持 1024 英文及 375 手机布局。普通点击、箭头、悬停、ArrowDown/Tab/Escape、修饰键新标签与同页手机关闭行为保留。
- reduced-motion 关闭装饰层变形和过渡；reduced-transparency 使用实底；高对比度模式保留明确边界。
- 完成定向导航回归、正式构建 CSS 检查和真实浏览器状态截图。提交、部署在预览验收后另行确认。

参考：[Apple Materials](https://developer.apple.com/design/human-interface-guidelines/materials)、[Meet Liquid Glass](https://developer.apple.com/videos/play/wwdc2025/219/)。
