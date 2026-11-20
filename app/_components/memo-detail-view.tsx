/*
 * Figma: 완성 예시/Detail 의 화면 본체.
 * 파일에 들어 있는 메모(서버)와 이 브라우저에 저장한 메모(클라이언트) 모두 이 화면을 쓴다.
 */
import Link from "next/link";
import type { Memo, MemoBlock } from "@/app/_lib/memos";
import { IconChevronLeft, IconMore, IconPin, IconShare } from "./icons";
import { Badge, ButtonPrimary, MemoListItem, iconButtonClass } from "./memo-ui";

export function BackButton() {
  return (
    <Link href="/" aria-label="뒤로 가기" className={`${iconButtonClass} text-text-primary`}>
      <IconChevronLeft />
    </Link>
  );
}

/** 내용을 받기 전, 또는 메모를 찾지 못했을 때 보이는 뼈대 */
export function MemoDetailShell({ message }: { message?: string }) {
  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col gap-space-16 px-space-16 pt-space-48 pb-space-34">
      <nav className="flex items-center">
        <BackButton />
      </nav>
      <main
        aria-busy={!message}
        className="body-md flex flex-1 items-center justify-center rounded-xl bg-surface-card p-space-24 text-text-muted"
      >
        {message}
      </main>
    </div>
  );
}

export function MemoDetailView({ memo }: { memo: Memo }) {
  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col gap-space-16 px-space-16 pt-space-48">
      <nav className="flex items-center justify-between">
        <BackButton />
        <div className="flex">
          <button
            type="button"
            aria-label={memo.pinned ? "고정 풀기" : "고정하기"}
            aria-pressed={memo.pinned}
            className={`${iconButtonClass} ${memo.pinned ? "text-primary" : "text-text-primary"}`}
          >
            <IconPin />
          </button>
          <button type="button" aria-label="공유하기" className={`${iconButtonClass} text-text-primary`}>
            <IconShare />
          </button>
          <button type="button" aria-label="더보기" className={`${iconButtonClass} text-text-primary`}>
            <IconMore />
          </button>
        </div>
      </nav>

      <main className="flex-1">
        <article className="flex flex-col gap-space-12 rounded-xl bg-surface-card px-space-20 py-space-24">
          <div className="flex items-center gap-space-8">
            <Badge label={memo.category} color={memo.label} />
            <p className="caption-sm text-text-muted">{memo.createdAt}</p>
          </div>
          <h1 className="heading-lg text-text-primary">{memo.title}</h1>
          <hr className="border-border-default" />
          <div className="flex flex-col gap-space-12">
            {memo.body.map((block, i) => (
              <Block key={i} block={block} />
            ))}
          </div>
          <p className="caption-sm text-text-muted">{memo.footer}</p>
        </article>
      </main>

      <div className="sticky bottom-0 bg-surface-page pb-space-34">
        <ButtonPrimary label="수정하기" />
      </div>
    </div>
  );
}

function Block({ block }: { block: MemoBlock }) {
  switch (block.type) {
    case "heading":
      return <h2 className="title-lg text-text-primary">{block.text}</h2>;
    case "subheading":
      return <h3 className="title-md text-text-primary">{block.text}</h3>;
    case "paragraph":
      return (
        <p className="body-md text-text-secondary">
          {block.content.map((part, i) =>
            part.strong ? (
              <strong key={i} className="font-bold text-text-primary">
                {part.text}
              </strong>
            ) : (
              <span key={i}>{part.text}</span>
            ),
          )}
        </p>
      );
    case "list":
      return (
        <ul className="flex flex-col gap-space-4">
          {block.items.map((item, i) => (
            <MemoListItem key={i}>{item}</MemoListItem>
          ))}
        </ul>
      );
  }
}
