"use client";

import { toMemo, useLocalMemos } from "@/app/_lib/local-memos";
import type { Memo } from "@/app/_lib/memos";
import { MemoItem } from "./memo-ui";

/** 최근 메모 카드의 목록: 이 브라우저에 저장한 메모를 앞에 두고 3개까지 */
export function RecentMemos({ fallback }: { fallback: Memo[] }) {
  const local = useLocalMemos().map(toMemo);
  return [...local, ...fallback].slice(0, 3).map((memo) => <MemoItem key={memo.id} memo={memo} />);
}
