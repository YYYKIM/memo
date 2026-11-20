import type { Metadata } from "next";
import { MemoWriterScreen } from "./memo-writer";

export const metadata: Metadata = { title: "새 메모 · 메모" };

/** Figma: 완성 예시/Write */
export default function NewMemoPage() {
  return <MemoWriterScreen />;
}
