import { ButtonPrimary, CardHeader, Chip, MemoItem } from "@/app/_components/memo-ui";
import { memos } from "@/app/_lib/memos";
import { RecentMemos } from "@/app/_components/recent-memos";

const categories = ["전체", "업무", "개인", "아이디어"];

/** Figma: 완성 예시/Home */
export default function Home() {
  const pinned = memos.filter((memo) => memo.pinned);
  const recent = memos.filter((memo) => !memo.pinned);

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col gap-space-16 px-space-16 pt-space-64">
      <main className="flex flex-1 flex-col gap-space-16">
        <header className="flex flex-col gap-space-8 px-space-8">
          <p className="caption-md text-text-muted">10월 30일 금요일</p>
          <h1 className="heading-xl text-text-primary">
            오늘까지 메모를
            <br />
            <span className="text-primary">128개</span> 남겼어요
          </h1>
        </header>

        <nav aria-label="분류" className="flex gap-space-8 px-space-4">
          {categories.map((category) => (
            <Chip key={category} label={category} selected={category === "전체"} />
          ))}
        </nav>

        <section className="flex flex-col rounded-xl bg-surface-card py-space-8">
          <CardHeader title="고정한 메모" pin />
          {pinned.map((memo) => (
            <MemoItem key={memo.id} memo={memo} />
          ))}
        </section>

        <section className="flex flex-col rounded-xl bg-surface-card py-space-8">
          <CardHeader title="최근 메모" action />
          <RecentMemos fallback={recent} />
        </section>
      </main>

      <div className="sticky bottom-0 bg-surface-page pb-space-34">
        <ButtonPrimary label="새 메모 쓰기" icon href="/memo/new" />
      </div>
    </div>
  );
}
