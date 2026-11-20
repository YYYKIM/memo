"use client";

import { useSyncExternalStore } from "react";
import { MemoDetailShell, MemoDetailView } from "@/app/_components/memo-detail-view";
import { toMemo, useLocalMemos } from "@/app/_lib/local-memos";

const noop = () => () => {};

/** 이 브라우저(localStorage)에 저장한 메모의 상세 화면 */
export function LocalMemoDetail({ id }: { id: string }) {
  const stored = useLocalMemos().find((memo) => memo.id === id);
  // 서버 렌더와 첫 화면에서는 저장소를 읽을 수 없어 뼈대를 보인다.
  const isClient = useSyncExternalStore(noop, () => true, () => false);

  if (!isClient) return <MemoDetailShell />;
  if (!stored) return <MemoDetailShell message="메모를 찾을 수 없어요" />;
  return <MemoDetailView memo={toMemo(stored)} />;
}
