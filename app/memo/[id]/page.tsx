import { Suspense } from "react";
import { MemoDetailShell, MemoDetailView } from "@/app/_components/memo-detail-view";
import { getMemo, memos } from "@/app/_lib/memos";
import { LocalMemoDetail } from "./local-memo-detail";

export function generateStaticParams() {
  return memos.map((memo) => ({ id: memo.id }));
}

export async function generateMetadata({ params }: PageProps<"/memo/[id]">) {
  const memo = getMemo((await params).id);
  return { title: memo ? `${memo.title} · 메모` : "메모" };
}

/**
 * Figma: 완성 예시/Detail
 * params는 요청 때 정해지는 값이라 <Suspense> 안에서 읽는다 (Cache Components 규칙).
 * 홈의 메모 링크는 prefetch로 내용을 미리 받아 두어, 눌렀을 때 바로 보인다.
 */
export default function MemoDetailPage({ params }: PageProps<"/memo/[id]">) {
  return (
    <Suspense fallback={<MemoDetailShell />}>
      <MemoDetail params={params} />
    </Suspense>
  );
}

async function MemoDetail({ params }: { params: PageProps<"/memo/[id]">["params"] }) {
  const { id } = await params;
  const memo = getMemo(id);
  // 파일에 없는 메모는 이 브라우저에 저장한 메모일 수 있으니 브라우저에서 찾는다.
  return memo ? <MemoDetailView memo={memo} /> : <LocalMemoDetail id={id} />;
}
