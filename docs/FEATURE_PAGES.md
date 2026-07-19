# 特色页面开关

站点的可选页面由 `src/config/siteConfig.ts` 中的 `featurePages` 配置控制。

## 我的设备页面

将 `featurePages.devices` 设为 `true` 后，站点会提供“我的设备”页面，访问路径为 `/devices/`。设备卡片内容在 `src/data/devices.ts` 中维护。导航入口由 `src/config/navBarConfig.ts` 的“其他”下拉菜单提供。

## 动漫页面

“其他”菜单中的“动漫”链接依赖 `featurePages.anime`。该开关为 `true` 时，菜单才会显示该入口。

若要下线该页面，将该值改回 `false`；页面会跳转到 404。
