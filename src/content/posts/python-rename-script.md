---
title: "Python 批量文件重命名工程化实践：支持 Dry-Run、冲突保护与回滚日志"
published: 2024-12-12
updated: 2026-11-25
description: "淘汰会静默覆盖文件的 os.rename 短脚本，用 Python 标准库 pathlib + 两阶段暂存重命名 + JSON 回滚清单打造零数据丢失的 CLI 工具。"
tags: ["Python", "自动化", "CLI", "脚本"]
category: "Python"
---

## 复盘背景

以前写过一个 30 行 `os.rename` 批量重命名小脚本，看似 5 分钟搞定，真拿去整理几百张博客配图和扫描件时却差点把数据搞丢：

1. 目标目录里已经存在 `photo_001.jpg` 时，`os.rename` 在 POSIX/macOS 上会**直接覆盖且没有任何提示**；
2. 碰到 `a.jpg -> b.jpg` 和 `b.jpg -> a.jpg` 这种环状重命名，单步改名会直接撞车；
3. 改完发现排序错了想还原，因为没有映射日志，只能对着文件名一条条手动猜。

这次重写不引入任何第三方包，只用 Python 3.11+ 标准库（`pathlib`、`argparse`、`json`、`uuid`），把脚本改造成带 `--dry-run` 预览、两阶段安全改名和 `--rollback` 一键回滚的工程级 CLI 工具。

## 前置条件与输入参数

- **运行环境**：Python 3.11+（macOS / Linux / Windows 通用，无需 `pip install`）。
- **核心参数**：
  - `directory`：目标文件夹路径（只处理当前层级普通文件，不递归子目录、不碰隐藏文件）。
  - `--prefix`：新文件名前缀（默认 `asset`）。
  - `--ext`：扩展名白名单过滤（如 `.jpg,.png,.webp`）。
  - `--apply`：显式确认执行落盘；**未传 `--apply` 时默认进入 dry-run 预览模式**。
  - `--rollback <manifest.json>`：根据历史映射清单逆序恢复原文件名。

## 操作步骤（SOP）

### 1. 编写带两阶段重命名与回滚机制的 `safe_rename.py`

```python
#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import re
import sys
import uuid
from datetime import datetime, timezone
from pathlib import Path


def natural_sort_key(path: Path) -> list[int | str]:
    """按数字自然序排序，避免 img_10 排在 img_2 前面。"""
    parts = re.split(r"(\d+)", path.name.lower())
    return [int(p) if p.isdigit() else p for p in parts]


def collect_files(target_dir: Path, extensions: set[str] | None) -> list[Path]:
    files = []
    for entry in target_dir.iterdir():
        if not entry.is_file() or entry.name.startswith("."):
            continue
        if entry.name.startswith("rename-manifest-") and entry.suffix == ".json":
            continue
        if extensions and entry.suffix.lower() not in extensions:
            continue
        files.append(entry)
    return sorted(files, key=natural_sort_key)


def build_plan(files: list[Path], prefix: str, start: int, width: int) -> list[tuple[Path, Path]]:
    plan: list[tuple[Path, Path]] = []
    for index, src in enumerate(files, start=start):
        dst = src.with_name(f"{prefix}_{index:0{width}d}{src.suffix.lower()}")
        if src != dst:
            plan.append((src, dst))
    return plan


def validate_no_external_collision(plan: list[tuple[Path, Path]]) -> None:
    sources = {src for src, _ in plan}
    targets = [dst for _, dst in plan]
    if len(targets) != len(set(targets)):
        raise ValueError("重命名计划存在重复目标文件名，已中止。")
    # macOS 默认 APFS 大小写不敏感，统一按小写路径检查外部冲突
    sources_lower = {str(p).lower() for p in sources}
    for _, dst in plan:
        if dst.exists() and str(dst).lower() not in sources_lower:
            raise FileExistsError(f"目标文件已存在且不在本批次源列表中: {dst.name}")


def execute_two_phase(plan: list[tuple[Path, Path]], target_dir: Path) -> Path:
    batch_id = uuid.uuid4().hex[:8]
    staging: list[tuple[Path, Path, Path]] = []
    for idx, (src, dst) in enumerate(plan):
        tmp = src.with_name(f".tmp_rename_{batch_id}_{idx}{src.suffix}")
        src.rename(tmp)
        staging.append((src, tmp, dst))

    records: list[dict[str, str]] = []
    for src, tmp, dst in staging:
        tmp.rename(dst)
        records.append({"from": str(src), "to": str(dst)})

    manifest_path = target_dir / f"rename-manifest-{datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%SZ')}.json"
    manifest_path.write_text(json.dumps(records, ensure_ascii=False, indent=2), encoding="utf-8")
    return manifest_path


def rollback(manifest_path: Path) -> int:
    records = json.loads(manifest_path.read_text(encoding="utf-8"))
    # 两阶段恢复，避免回滚自身发生环状碰撞
    batch_id = uuid.uuid4().hex[:8]
    staged: list[tuple[Path, Path]] = []
    for idx, item in enumerate(records):
        current = Path(item["to"])
        original = Path(item["from"])
        if not current.exists():
            raise FileNotFoundError(f"回滚失败，找不到当前文件: {current}")
        tmp = current.with_name(f".tmp_rollback_{batch_id}_{idx}{current.suffix}")
        current.rename(tmp)
        staged.append((tmp, original))
    for tmp, original in staged:
        tmp.rename(original)
    return len(staged)


def main() -> int:
    parser = argparse.ArgumentParser(description="安全批量重命名工具（默认 dry-run）")
    parser.add_argument("directory", nargs="?", type=Path, help="目标目录")
    parser.add_argument("--prefix", default="asset", help="输出文件名前缀")
    parser.add_argument("--start", type=int, default=1, help="起始序号")
    parser.add_argument("--width", type=int, default=3, help="序号零填充位数")
    parser.add_argument("--ext", default="", help="允许的扩展名，逗号分隔，例如 .jpg,.webp")
    parser.add_argument("--apply", action="store_true", help="确认落盘执行（不加则仅预览）")
    parser.add_argument("--rollback", type=Path, help="指定回滚清单 JSON 路径")
    args = parser.parse_args()

    if args.rollback:
        restored = rollback(args.rollback)
        print(f"已回滚 {restored} 个文件。")
        return 0

    if not args.directory or not args.directory.is_dir():
        print("错误：请提供有效的目标目录。", file=sys.stderr)
        return 2

    exts = {e.strip().lower() for e in args.ext.split(",") if e.strip()} or None
    files = collect_files(args.directory, exts)
    plan = build_plan(files, args.prefix, args.start, args.width)
    if not plan:
        print("没有需要重命名的文件。")
        return 0

    validate_no_external_collision(plan)
    for src, dst in plan:
        print(f"{'[APPLY]' if args.apply else '[DRY-RUN]'} {src.name} -> {dst.name}")

    if not args.apply:
        print(f"\n预览完成（共 {len(plan)} 个文件）。确认无误请追加 --apply 执行。")
        return 0

    manifest = execute_two_phase(plan, args.directory)
    print(f"\n执行完成，共重命名 {len(plan)} 个文件。回滚清单：{manifest}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
```

### 2. 先预览，确认映射无误再落盘

```bash
# 默认 dry-run，不会改动磁盘文件
python3 safe_rename.py ./tmp_photos --prefix trip --ext .jpg,.webp

# 确认输出后加上 --apply 执行并生成 manifest
python3 safe_rename.py ./tmp_photos --prefix trip --ext .jpg,.webp --apply
```

### 3. 需要撤销时执行一键回滚

```bash
python3 safe_rename.py --rollback ./tmp_photos/rename-manifest-20261125T100000Z.json
```

## 真实踩坑复盘与排查记录

1. **现象：在 macOS 上把 `IMG_1.JPG` 批量小写或移位时，直接丢失了一半文件**
   - **定位**：macOS 默认的 APFS 是大小写不敏感文件系统（Case-Insensitive）。`photo_1.jpg` 和 `PHOTO_1.JPG` 在操作系统眼里指向同一 inode，或者 `photo_1` 覆盖了原本排在后面的 `photo_2`。
   - **解决**：加入 `validate_no_external_collision` 按小写路径检测冲突，并统一采用“先重命名到带 UUID 的 `.tmp_rename_*` 临时名、再落位目标名”的两阶段方案。

2. **现象：`img_10.jpg` 排在了 `img_2.jpg` 前面**
   - **定位**：原生 `sorted()` 按 ASCII 字典序排列，字符串 `'10' < '2'`。
   - **解决**：使用 `natural_sort_key` 按连续数字切分排序，让人类视觉顺序与序号完全一致。

3. **现象：目录下的 `.DS_Store` 和 `rename-manifest-*.json` 也被一起改名了**
   - **定位**：`iterdir()` 默认会扫描隐藏文件与历史输出日志。
   - **解决**：在 `collect_files` 中显式跳过点开头隐藏文件与回滚清单自身。

## 验收清单

用临时测试夹具即可 10 秒完成端到端自检：

```bash
mkdir -p /tmp/rename_test && touch /tmp/rename_test/a_{1,2,10}.jpg /tmp/rename_test/.DS_Store
python3 safe_rename.py /tmp/rename_test --prefix demo --ext .jpg
python3 safe_rename.py /tmp/rename_test --prefix demo --ext .jpg --apply
ls -1 /tmp/rename_test
python3 safe_rename.py --rollback /tmp/rename_test/rename-manifest-*.json
ls -1 /tmp/rename_test && rm -rf /tmp/rename_test
```

预期结果：首次预览不修改文件；`--apply` 后生成 `demo_001.jpg`、`demo_002.jpg`、`demo_003.jpg` 且 `.DS_Store` 保持原样；执行 `--rollback` 后准确还原为 `a_1.jpg`、`a_2.jpg`、`a_10.jpg`。

## 延伸阅读

- [macOS 终端效率工程化配置：Zsh、fzf、ripgrep 与排错常用命令组合](/posts/macos-terminal-tips/)
- [技术文档写作实战：把一次排错变成别人能复现的解决方案](/posts/developer-documentation-writing-guide/)
