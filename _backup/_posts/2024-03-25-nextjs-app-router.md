---
layout: post
title: "Next.js App Router 上手指南：从路由到服务端渲染"
subtitle: "忘掉 getStaticProps？Next.js 14+ 核心概念极简解析"
date: 2024-03-25 09:00:00
author: "Levi"
header-img: "img/bg/image_44.jpg"
catalog: true
tags:
    - React
    - Next.js
    - 前端
    - 教程
---

Next.js 最近几年的变化可谓天翻地覆。自从引入 **App Router** (`app` 目录) 以来，它几乎重塑了 React 应用的构建方式。
如果你还在用这 `pages` 目录写 `getServerSideProps`，那你是时候升级一下知识库了。

## 1. 目录即路由

在 App Router 中，文件系统就是路由。
*   `app/page.tsx` -> `/`
*   `app/about/page.tsx` -> `/about`
*   `app/blog/[id]/page.tsx` -> `/blog/123`

这种结构非常直观。每个文件夹还可以包含 `layout.tsx` (布局), `loading.tsx` (加载中), `error.tsx` (错误处理)，实现了**嵌套路由**和**UI 状态**的完美解耦。

### 文件结构可视化

```text
app/
├── layout.tsx      (Root Layout: <html>...</html>)
├── page.tsx        (Home Page: /)
├── about/
│   └── page.tsx    (About Page: /about)
└── blog/
    ├── layout.tsx  (Blog Layout: sidebar, etc.)
    └── [id]/
        └── page.tsx (Post Page: /blog/123)
```

## 2. Server Components (服务端组件)

这是最大的思想转变。**在 App 目录下的组件，默认都是 Server Components。**
这意味着：
*   它们直接在服务器上运行。
*   可以直接连接数据库，读取文件系统。
*   **不会**被打包到客户端的 JavaScript bundle 中（极大减小了体积）。

```tsx
// app/page.tsx
// 这是一个服务端组件，可以直接写 async/await
import db from './db';

export default async function Page() {
  const users = await db.query('SELECT * FROM users'); // 直接查库！
  
  return (
    <ul>
      {users.map(user => <li key={user.id}>{user.name}</li>)}
    </ul>
  );
}
```

## 3. Client Components (客户端组件)

如果你需要 `useState`, `useEffect` 或者 DOM 事件（onClick），你需要显式地在文件顶部声明 `"use client"`。

```tsx
'use client';

import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c+1)}>{count}</button>;
}
```

**最佳实践**：尽可能让叶子节点（Button, Input）做成 Client Component，而把大框架保留为 Server Component。

## 4. 获取数据 (Data Fetching)

再也没有 `getStaticProps` 了。现在获取数据就是标准的 `fetch` API。

```tsx
// 类似 getStaticProps (默认缓存)
fetch('https://...', { cache: 'force-cache' });

// 类似 getServerSideProps (每次刷新)
fetch('https://...', { cache: 'no-store' });

// ISR (每10秒更新一次)
fetch('https://...', { next: { revalidate: 10 } });
```

## 5. 总结

App Router 虽然学习曲线稍陡，但它带来了更小的包体积、更快的首屏加载速度和更清晰的数据流。对于 2026 年的新项目，这是唯一的选择。
