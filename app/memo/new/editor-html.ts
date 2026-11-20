/*
 * 편집기(contentEditable) 안의 HTML → 메모 본문(MemoBlock[]) 바꾸기.
 *   <h2> 제목 → heading, <h3> 소제목 → subheading, <ul>/<ol> 목록 → list,
 *   그 밖의 줄 → paragraph (<b>/<strong> 은 굵게)
 */
import type { InlineText, MemoBlock } from "@/app/_lib/memos";

function isBold(el: Element) {
  if (el.tagName === "B" || el.tagName === "STRONG") return true;
  const weight = (el as HTMLElement).style?.fontWeight;
  return weight === "bold" || Number(weight) >= 600;
}

function inlineParts(node: Node, strong = false, out: InlineText[] = []): InlineText[] {
  node.childNodes.forEach((child) => {
    if (child.nodeType === Node.TEXT_NODE) {
      const text = child.textContent ?? "";
      if (!text) return;
      const last = out[out.length - 1];
      // 같은 굵기의 조각은 하나로 합친다.
      if (last && !!last.strong === strong) last.text += text;
      else out.push(strong ? { text, strong } : { text });
    } else if (child instanceof Element) {
      inlineParts(child, strong || isBold(child), out);
    }
  });
  return out;
}

function clean(text: string) {
  return text.replace(/ /g, " ").trim();
}

export function htmlToBlocks(root: HTMLElement): MemoBlock[] {
  const blocks: MemoBlock[] = [];
  let loose: Node[] = []; // 블록으로 감싸지지 않은 글 조각

  const pushParagraph = (node: Node) => {
    const content = inlineParts(node)
      .map((part) => ({ ...part, text: part.text.replace(/ /g, " ") }))
      .filter((part) => part.text.length > 0);
    if (content.length === 0 || !clean(content.map((p) => p.text).join(""))) return;
    content[0].text = content[0].text.trimStart();
    content[content.length - 1].text = content[content.length - 1].text.trimEnd();
    blocks.push({ type: "paragraph", content });
  };

  const flushLoose = () => {
    if (loose.length === 0) return;
    const wrapper = document.createElement("p");
    loose.forEach((node) => wrapper.appendChild(node.cloneNode(true)));
    pushParagraph(wrapper);
    loose = [];
  };

  const BLOCK_TAGS = ["P", "DIV", "H1", "H2", "H3", "H4", "UL", "OL"];

  const walk = (parent: Node) => {
    parent.childNodes.forEach((node) => {
      if (!(node instanceof Element) || ["B", "STRONG", "SPAN", "I", "EM"].includes(node.tagName)) {
        loose.push(node);
        return;
      }
      flushLoose();
      const text = clean(node.textContent ?? "");
      switch (node.tagName) {
        case "H1":
        case "H2":
          if (text) blocks.push({ type: "heading", text });
          break;
        case "H3":
        case "H4":
          if (text) blocks.push({ type: "subheading", text });
          break;
        case "UL":
        case "OL": {
          const items = Array.from(node.querySelectorAll("li"))
            .map((li) => clean(li.textContent ?? ""))
            .filter(Boolean);
          if (items.length) blocks.push({ type: "list", items });
          break;
        }
        case "BR":
          break;
        default: {
          // 브라우저가 <p> 안에 목록이나 다른 줄을 넣는 경우가 있어, 안쪽 블록까지 따로 읽는다.
          const hasBlockChild = Array.from(node.children).some((child) =>
            BLOCK_TAGS.includes(child.tagName),
          );
          if (hasBlockChild) {
            walk(node);
            flushLoose();
          } else {
            pushParagraph(node);
          }
        }
      }
    });
  };

  walk(root);
  flushLoose();
  return blocks;
}
