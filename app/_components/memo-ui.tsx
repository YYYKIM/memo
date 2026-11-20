/*
 * Figma 파일의 컴포넌트를 코드로 옮긴 것. 이름은 Figma 컴포넌트 이름을 따른다.
 *   Chip, Card/Header, Memo/Item, Badge, Memo/ListItem, Button/Primary, Button/Icon
 */
import Link from "next/link";
import type { Memo, MemoLabel } from "@/app/_lib/memos";
import { IconChevronRight, IconNote, IconPin, IconPlus } from "./icons";

/* 색 라벨 → 토큰 클래스 (Tailwind가 찾을 수 있게 문자열 그대로 둔다) */
const labelText: Record<MemoLabel, string> = {
  blue: "text-label-blue",
  green: "text-label-green",
  orange: "text-label-orange",
  pink: "text-label-pink",
};
const labelSoftBg: Record<MemoLabel, string> = {
  blue: "bg-label-blue-soft",
  green: "bg-label-green-soft",
  orange: "bg-label-orange-soft",
  pink: "bg-label-pink-soft",
};

/** Chip — 분류 칩. 고른 칩은 selected. */
export function Chip({
  label,
  selected = false,
  onClick,
}: {
  label: string;
  selected?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`label-md flex h-9 shrink-0 items-center rounded-full px-space-16 whitespace-nowrap ${
        selected ? "bg-primary text-text-on-primary" : "bg-surface-card text-text-secondary"
      }`}
    >
      {label}
    </button>
  );
}

/** Card/Header — pin을 켜면 고정 표시, action을 켜면 오른쪽에 전체 보기. */
export function CardHeader({
  title,
  pin = false,
  action = false,
}: {
  title: string;
  pin?: boolean;
  action?: boolean;
}) {
  return (
    <div className="flex h-10 w-full items-center gap-space-4 pt-space-12 pb-space-4 pl-space-20 pr-space-16">
      {pin && <IconPin size={16} className="text-primary" />}
      <h2 className="label-md min-w-0 flex-1 text-text-primary">{title}</h2>
      {action && (
        <button type="button" className="caption-md flex items-center gap-space-4 text-text-muted">
          전체 보기
          <IconChevronRight size={16} />
        </button>
      )}
    </div>
  );
}

/** Memo/Item — 메모 목록의 한 줄. 누르면 메모 상세로 이동한다. */
export function MemoItem({ memo }: { memo: Memo }) {
  return (
    <Link
      href={`/memo/${memo.id}`}
      prefetch
      className="flex h-18 w-full items-center gap-space-16 px-space-20 py-space-12"
    >
      <span
        className={`flex size-11 shrink-0 items-center justify-center rounded-sm ${labelSoftBg[memo.label]} ${labelText[memo.label]}`}
      >
        <IconNote size={22} />
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-space-4">
        <span className="title-md text-text-primary">{memo.title}</span>
        <span className="body-sm truncate text-text-secondary">{memo.preview}</span>
      </span>
      <span className="caption-sm shrink-0 text-text-muted">{memo.date}</span>
    </Link>
  );
}

/** Badge — 메모의 분류 배지. 색은 메모의 색 라벨을 따른다. */
export function Badge({ label, color }: { label: string; color: MemoLabel }) {
  return (
    <span
      className={`caption-sm flex h-6.5 shrink-0 items-center rounded-full px-space-8 ${labelSoftBg[color]} ${labelText[color]}`}
    >
      {label}
    </span>
  );
}

/** Memo/ListItem — 본문의 목록 한 줄. 앞에 점이 붙는다. */
export function MemoListItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="body-md flex w-full gap-space-8 text-text-secondary">
      <span aria-hidden="true">•</span>
      <span className="min-w-0 flex-1">{children}</span>
    </li>
  );
}

/** Button/Primary — 화면의 주 버튼. 아래쪽에 가로로 꽉 차게 둔다. href가 있으면 링크로 동작한다. */
export function ButtonPrimary({
  label,
  icon = false,
  href,
  onClick,
}: {
  label: string;
  icon?: boolean;
  href?: string;
  onClick?: () => void;
}) {
  const className =
    "button-md flex h-14 w-full items-center justify-center gap-space-8 rounded-md bg-primary px-space-24 text-text-on-primary";
  const content = (
    <>
      {icon && <IconPlus size={20} />}
      {label}
    </>
  );
  return href ? (
    <Link href={href} className={className}>
      {content}
    </Link>
  ) : (
    <button type="button" onClick={onClick} className={className}>
      {content}
    </button>
  );
}

/** Label/Dot — 색 라벨 고르기. 고른 색은 바깥에 파란 테두리(2px). */
const labelDotBg: Record<MemoLabel, string> = {
  blue: "bg-label-blue",
  green: "bg-label-green",
  orange: "bg-label-orange",
  pink: "bg-label-pink",
};
const labelName: Record<MemoLabel, string> = {
  blue: "파랑",
  green: "초록",
  orange: "주황",
  pink: "분홍",
};

export function LabelDot({
  color,
  selected = false,
  onClick,
}: {
  color: MemoLabel;
  selected?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      aria-label={labelName[color]}
      onClick={onClick}
      className={`flex size-8 shrink-0 items-center justify-center rounded-full border-2 ${
        selected ? "border-primary" : "border-transparent"
      }`}
    >
      <span className={`size-5.5 rounded-full ${labelDotBg[color]}`} />
    </button>
  );
}

/** Button/Format — 서식 버튼. 커서가 있는 글자의 서식은 active. */
export function ButtonFormat({
  label,
  active = false,
  ariaLabel,
  onPress,
}: {
  label: string;
  active?: boolean;
  ariaLabel?: string;
  onPress: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={ariaLabel}
      // 누르는 순간 편집기의 선택 영역을 잃지 않도록 mousedown에서 처리한다.
      onMouseDown={(event) => {
        event.preventDefault();
        onPress();
      }}
      className={`label-md flex h-9 shrink-0 items-center justify-center rounded-sm px-space-12 ${
        active ? "bg-label-blue-soft text-primary" : "text-text-secondary"
      }`}
    >
      {label}
    </button>
  );
}

/** Button/Icon — 40×40 누르는 영역 가운데에 아이콘. 아이콘 색은 글자색 클래스로 따로 준다. */
export const iconButtonClass =
  "flex size-10 shrink-0 items-center justify-center rounded-sm";
