---
layout: post
title: "提升 macOS 效率的 5 个终端 (Terminal) 技巧"
subtitle: "摆脱鼠标依赖，让你的命令行操作行云流水"
date: 2025-04-12 10:00:00
author: "Levi"
header-img: "img/bg/image_35.jpg"
catalog: true
tags:
    - macOS
    - Terminal
    - 效率
    - Shell
---

作为一名 macOS 用户，终端 (Terminal) 是我们最强大的工具之一。无论你是开发者还是普通的高级用户，掌握一些 Shell 技巧都能让你的工作效率倍增。

本文将分享 5 个我每天都在用的 Zsh/Bash 小技巧，不需要安装复杂的插件，开箱即用。

## 1. 快速回到上一个目录 (`cd -`)

这可能是最简单但最实用的命令。
当你在深层目录 `/Users/levi/project/src/components/` 和系统目录 `/etc/nginx/` 之间频繁切换时，不需要每次都打完整路径。

只需输入：
```bash
cd -
```
系统就会自动把你带回“上一次所在的目录”。

## 2. 这里的命令太长了？用 `Ctrl + A` 和 `Ctrl + E`

当你在终端敲了一行巨长的命令，结果发现最开头的 `sudo` 忘了加，或者拼写错了一个词：
*   **不要** 狂按左箭头键。
*   按下 **`Ctrl + A`**：光标瞬间跳到行首。
*   按下 **`Ctrl + E`**：光标瞬间跳到行尾。

这两个快捷键是 Readline 的标准配置，在大多数 Shell 环境中通用。

## 3. 搜索历史命令 (`Ctrl + R`)

这是一个能让你显得很“极客”的操作。
如果你想执行几天前运行过的一条复杂的 `docker run` 命令，但记不清具体参数了？

1.  按下 **`Ctrl + R`**。
2.  输入关键字（比如 `docker`）。
3.  终端会自动显示最近匹配的一条历史记录。
4.  如果你想找更早之前的，继续按 `Ctrl + R` 即可。

## 4. 别名 (Alias) 解放双手

如果你发现自己经常输入很长的命令，比如 `git commit -m "update"`，一定要设置别名。

编辑你的 `~/.zshrc` 文件：
```bash
# 快速提交
alias gcm="git commit -m"
# 快速查看状态
alias gs="git status"
# 显示隐藏文件并易读大小
alias ll="ls -lah"
# 快速刷新DNS缓存
alias flushdns="sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder"
```
保存后运行 `source ~/.zshrc`，以后只需要打 `gcm "message"` 就行了。

## 5. `open .` 图形化打开当前文件夹

有时候在终端里操作文件很累，想用 Finder（访达）来拖拽文件？
直接输入：
```bash
open .
```
macOS 会立即弹出一个 Finder 窗口，显示的正是你当前终端所在的目录。这个技巧在管理博客图片资源时特别好用。

---

## 总结

工具的意义在于服务人。这些终端技巧虽然微小，但每天节省下来的几秒钟积累起来，就是巨大的效率提升。

如果你有其他独家秘籍，欢迎在评论区分享！
