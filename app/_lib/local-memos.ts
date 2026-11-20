"use client";

/*
 * 이 브라우저(localStorage)에 저장한 메모.
 * 저장 형식은 StoredMemo이고, 화면에서는 날짜 글자를 채워 Memo 모양으로 바꿔 쓴다.
 */
import { useSyncExternalStore } from "react";
import type { Memo, MemoBlock, MemoCategory, MemoLabel } from "./memos";

const MEMOS_KEY = "memo-app:memos";
const DRAFT_KEY = "memo-app:draft";
const CHANGE_EVENT = "memo-app:change";

export type StoredMemo = {
  id: string;
  title: string;
  category: MemoCategory;
  label: MemoLabel;
  body: MemoBlock[];
  /** ISO 시각 */
  savedAt: string;
};

export type MemoDraft = Omit<StoredMemo, "id" | "savedAt" | "body"> & {
  /** 편집기 안의 HTML 그대로 */
  html: string;
};

/* ---------- 읽기·쓰기 ---------- */

function read(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key: string, value: string | null) {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch {
    // 저장소를 쓸 수 없는 환경(사생활 보호 모드 등)에서는 조용히 넘어간다.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

let cachedRaw: string | null = null;
let cachedMemos: StoredMemo[] = [];

function getSnapshot(): StoredMemo[] {
  const raw = read(MEMOS_KEY);
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    try {
      const parsed: unknown = raw ? JSON.parse(raw) : [];
      cachedMemos = Array.isArray(parsed) ? (parsed as StoredMemo[]) : [];
    } catch {
      cachedMemos = [];
    }
  }
  return cachedMemos;
}

const emptyList: StoredMemo[] = [];
const getServerSnapshot = () => emptyList;

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

/** 저장한 메모 목록. 최신이 앞. 서버 렌더와 첫 화면에서는 빈 목록. */
export function useLocalMemos(): StoredMemo[] {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function saveMemo(memo: Omit<StoredMemo, "id" | "savedAt">): StoredMemo {
  const stored: StoredMemo = {
    ...memo,
    id: `local-${Date.now().toString(36)}`,
    savedAt: new Date().toISOString(),
  };
  write(MEMOS_KEY, JSON.stringify([stored, ...getSnapshot()]));
  return stored;
}

export function readDraft(): MemoDraft | null {
  const raw = read(DRAFT_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as MemoDraft;
  } catch {
    return null;
  }
}

export function writeDraft(draft: MemoDraft | null) {
  write(DRAFT_KEY, draft ? JSON.stringify(draft) : null);
}

/* ---------- 화면용으로 바꾸기 ---------- */

const pad = (n: number) => String(n).padStart(2, "0");

function timeText(d: Date) {
  const h = d.getHours();
  return `${h < 12 ? "오전" : "오후"} ${h % 12 || 12}:${pad(d.getMinutes())}`;
}

function dayText(d: Date) {
  const today = new Date();
  const start = (x: Date) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  const diff = Math.round((start(today) - start(d)) / 86_400_000);
  if (diff === 0) return "오늘";
  if (diff === 1) return "어제";
  return `${d.getMonth() + 1}월 ${d.getDate()}일`;
}

function blockText(block: MemoBlock) {
  if (block.type === "list") return block.items.join(", ");
  if (block.type === "paragraph") return block.content.map((part) => part.text).join("");
  return block.text;
}

export function toMemo(stored: StoredMemo): Memo {
  const d = new Date(stored.savedAt);
  const texts = stored.body.map(blockText).filter(Boolean);
  const length = stored.body
    .map((block) => (block.type === "list" ? block.items.join("") : blockText(block)))
    .join("")
    .replace(/\s/g, "").length;
  return {
    id: stored.id,
    title: stored.title,
    preview: texts.join(" ") || "내용 없음",
    date: dayText(d),
    createdAt: `${d.getMonth() + 1}월 ${d.getDate()}일 ${timeText(d)}`,
    footer: `${length}자 · ${dayText(d)} ${timeText(d)} 수정`,
    label: stored.label,
    category: stored.category,
    pinned: false,
    body: stored.body,
  };
}
