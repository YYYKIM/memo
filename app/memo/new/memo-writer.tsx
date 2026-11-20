"use client";

import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { BackButton } from "@/app/_components/memo-detail-view";
import { ButtonFormat, ButtonPrimary, Chip, LabelDot } from "@/app/_components/memo-ui";
import { readDraft, saveMemo, writeDraft, type MemoDraft } from "@/app/_lib/local-memos";
import type { MemoCategory, MemoLabel } from "@/app/_lib/memos";
import { htmlToBlocks } from "./editor-html";

const categories: MemoCategory[] = ["업무", "개인", "아이디어"];
const labels: MemoLabel[] = ["blue", "green", "orange", "pink"];
const EMPTY_HTML = "<p><br></p>";

const noop = () => () => {};

/** Figma: 완성 예시/Write — 저장소는 브라우저에만 있으니 브라우저에서 그린다. */
export function MemoWriterScreen() {
  const isClient = useSyncExternalStore(noop, () => true, () => false);
  if (!isClient) {
    return (
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col px-space-16 pt-space-48">
        <nav className="flex items-center">
          <BackButton />
        </nav>
      </div>
    );
  }
  return <MemoWriter />;
}

type FormatState = { bold: boolean; block: string; list: boolean };

function MemoWriter() {
  // 브라우저에서만 그려지므로 처음 한 번 바로 임시 저장본을 읽어도 된다.
  const [draft] = useState<MemoDraft | null>(readDraft);
  const router = useRouter();
  const titleId = useId();
  const titleRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  const [title, setTitle] = useState(draft?.title ?? "");
  const [category, setCategory] = useState<MemoCategory>(draft?.category ?? "업무");
  const [label, setLabel] = useState<MemoLabel>(draft?.label ?? "blue");
  const [html, setHtml] = useState(draft?.html ?? EMPTY_HTML);
  const [autosaved, setAutosaved] = useState(draft !== null);
  const [format, setFormat] = useState<FormatState>({ bold: false, block: "p", list: false });

  const bodyEmpty = !html.replace(/<[^>]*>|&nbsp;/g, "").trim() && !html.includes("<li");

  // 편집기 내용은 처음 한 번만 넣는다 (그 뒤로는 사용자가 직접 고친다).
  useEffect(() => {
    document.execCommand("defaultParagraphSeparator", false, "p");
    if (editorRef.current) editorRef.current.innerHTML = draft?.html ?? EMPTY_HTML;
  }, [draft]);

  // 커서가 있는 글자의 서식을 서식 버튼에 보인다.
  useEffect(() => {
    const update = () => {
      const editor = editorRef.current;
      const node = document.getSelection()?.anchorNode;
      if (!editor || !node || !editor.contains(node)) return;
      setFormat({
        bold: document.queryCommandState("bold"),
        block: document.queryCommandValue("formatBlock").toLowerCase(),
        list: document.queryCommandState("insertUnorderedList"),
      });
    };
    document.addEventListener("selectionchange", update);
    return () => document.removeEventListener("selectionchange", update);
  }, []);

  // 쓰는 동안 이 브라우저에 임시로 자동 저장한다.
  useEffect(() => {
    if (!title && bodyEmpty && !draft) return;
    const timer = setTimeout(() => {
      writeDraft({ title, category, label, html });
      setAutosaved(true);
    }, 500);
    return () => clearTimeout(timer);
  }, [title, category, label, html, bodyEmpty, draft]);

  const syncHtml = () => setHtml(editorRef.current?.innerHTML ?? "");

  const run = (command: string, value?: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
    syncHtml();
    document.dispatchEvent(new Event("selectionchange"));
  };
  const toggleBlock = (tag: "h2" | "h3") =>
    run("formatBlock", format.block === tag ? "p" : tag);

  const save = () => {
    const trimmed = title.trim();
    if (!trimmed) {
      titleRef.current?.focus();
      return;
    }
    const body = editorRef.current ? htmlToBlocks(editorRef.current) : [];
    saveMemo({ title: trimmed, category, label, body });
    writeDraft(null);
    router.replace("/");
  };

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col gap-space-16 px-space-16 pt-space-48">
      <nav className="flex items-center justify-between">
        <BackButton />
        <p className="caption-sm text-text-muted" aria-live="polite">
          {autosaved ? "자동 저장됨" : ""}
        </p>
      </nav>

      <main className="flex flex-1 flex-col gap-space-12">
        {/* Input/Field — 입력 중에는 파란 테두리 */}
        <label
          htmlFor={titleId}
          className="flex flex-col gap-space-4 rounded-lg bg-surface-card px-space-20 py-space-16 outline-2 -outline-offset-2 outline-transparent focus-within:outline-primary"
        >
          <span className="caption-sm text-text-muted">제목</span>
          <input
            id={titleId}
            ref={titleRef}
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="제목을 입력하세요"
            className="title-md w-full bg-transparent text-text-primary outline-none placeholder:text-text-muted"
          />
        </label>

        <div className="flex flex-col gap-space-12 px-space-8 py-space-4">
          <div role="radiogroup" aria-label="분류" className="flex items-center gap-space-8">
            <span className="caption-sm text-text-muted">분류</span>
            {categories.map((item) => (
              <Chip
                key={item}
                label={item}
                selected={category === item}
                onClick={() => setCategory(item)}
              />
            ))}
          </div>
          <div role="radiogroup" aria-label="색" className="flex items-center gap-space-8">
            <span className="caption-sm text-text-muted">색</span>
            {labels.map((item) => (
              <LabelDot
                key={item}
                color={item}
                selected={label === item}
                onClick={() => setLabel(item)}
              />
            ))}
          </div>
        </div>

        {/* Editor — Editor/Toolbar + 본문 */}
        <div className="flex flex-col overflow-hidden rounded-lg bg-surface-card outline-2 -outline-offset-2 outline-transparent focus-within:outline-primary">
          <div role="toolbar" aria-label="서식" className="flex h-13 items-center gap-space-4 px-space-12">
            <ButtonFormat label="B" ariaLabel="굵게" active={format.bold} onPress={() => run("bold")} />
            <ButtonFormat label="제목" active={format.block === "h2"} onPress={() => toggleBlock("h2")} />
            <ButtonFormat label="소제목" active={format.block === "h3"} onPress={() => toggleBlock("h3")} />
            <ButtonFormat label="목록" active={format.list} onPress={() => run("insertUnorderedList")} />
          </div>
          <hr className="border-border-default" />
          <div className="relative">
            {bodyEmpty && (
              <p
                aria-hidden="true"
                className="body-md pointer-events-none absolute top-space-16 left-space-20 text-text-muted"
              >
                내용을 입력하세요
              </p>
            )}
            <div
              ref={editorRef}
              role="textbox"
              aria-multiline="true"
              aria-label="내용"
              contentEditable
              suppressContentEditableWarning
              onInput={syncHtml}
              className="body-md min-h-40 px-space-20 py-space-16 text-text-secondary outline-none [&_:is(h2,h3,ul,p,div)+:is(h2,h3,ul,p,div)]:mt-space-8 [&_b]:font-bold [&_b]:text-text-primary [&_strong]:font-bold [&_strong]:text-text-primary [&_h2]:title-lg [&_h2]:text-text-primary [&_h3]:title-md [&_h3]:text-text-primary [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-space-4 [&_li]:relative [&_li]:pl-space-12 [&_li]:before:absolute [&_li]:before:left-0 [&_li]:before:content-['•']"
            />
          </div>
        </div>
      </main>

      <div className="sticky bottom-0 bg-surface-page pb-space-34">
        <ButtonPrimary label="저장하기" onClick={save} />
      </div>
    </div>
  );
}
