# 特色页面开关说明

在 `src/config/siteConfig.ts` 中的 `featurePages` 对象统一控制各功能页的启用与关闭：

- `diary`：日记页面开关，访问路径 `/diary/`，数据在 `src/data/diary.ts`。
- `friends`：友链页面开关，访问路径 `/friends/`，数据在 `src/data/friends.ts`。
- `anime` / `devices` 等其他页面：根据运营需要开启或关闭；关闭后页面自动重定向到 404，且不会收录进 sitemap。
- 开启或关闭页面后，同步更新 `src/config/navBarConfig.ts` 中的导航链接。
