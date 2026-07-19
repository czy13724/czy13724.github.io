---
title: "重构的艺术：如何写出同事不骂街的 TypeScript 代码"
published: 2025-01-10
description: "代码是写给人看的，顺便给机器运行。5 个实用的重构小技巧"
tags: ["TypeScript", "Code Quality", "重构", "最佳实践"]
category: "TypeScript"
---

> "Any fool can write code that a computer can understand. Good programmers write code that humans can understand."

接手屎山代码（Spaghetti Code）是每个程序员的噩梦。为了不让你的代码成为别人的噩梦，我们来聊聊 TypeScript 项目中的重构艺术。

## 1. 拒绝 `any`，拥抱类型

`any` 是 TypeScript 的逃生舱，但用多了就变成了 `AnyScript`。
*   **坏味道**：`function process(data: any) { ... }`
*   **重构**：即使不知道确切类型，也请使用 `unknown`，迫使你在使用前进行类型收窄（Type Narrowing）。或者定义一个 `interface`，哪怕只有部分字段。

## 2. 卫语句 (Guard Clause) 代替嵌套 `if`

不要写“箭头型”代码（嵌套太深）。

**Bad:**
```typescript
function processUser(user: User) {
  if (user != null) {
    if (user.isActive) {
      if (user.hasCredit) {
         // 核心逻辑...
      }
    }
  }
}
```

**Good:**
```typescript
function processUser(user: User) {
  if (!user || !user.isActive || !user.hasCredit) return;
  
  // 核心逻辑在主层级，清清爽爽
}
```

## 3. 魔法数字 (Magic Numbers) 必须死

不要在代码里直接写 `if (status === 2)`。鬼知道 2 是什么意思？是“成功”？还是“失败”？还是“处理中”？

**重构**：使用 `enum` 或 `const` 常量。

```typescript
enum OrderStatus {
  Pending = 0,
  Processing = 1,
  Completed = 2
}

if (order.status === OrderStatus.Completed) { ... }
```

## 4. 函数单一职责

一个函数应该只做一件事。
如果你发现你的函数名是 `fetchDataAndProcessAndSave()`，那它绝对太长了。
*   把“获取数据”拆出去。
*   把“处理逻辑”拆出去。
*   把“保存”拆出去。
主函数只负责像指挥官一样调用它们。

## 5. 使用可选链 (Optional Chaining)

**Bad:**
```typescript
if (user && user.address && user.address.street) {
  console.log(user.address.street);
}
```

**Good:**
```typescript
console.log(user?.address?.street);
```

不仅代码短了，而且可读性极佳。

## 总结

好的代码就像一篇好文章，读起来行云流水。重构不是为了炫技，而是为了让未来的自己（和同事）少掉几根头发。
