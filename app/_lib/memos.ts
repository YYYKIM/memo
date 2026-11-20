export type MemoLabel = "blue" | "green" | "orange" | "pink";

export type MemoCategory = "업무" | "개인" | "아이디어";

/** 본문 안의 글 조각. strong이면 굵게, 글자색은 text/primary. */
export type InlineText = { text: string; strong?: boolean };

export type MemoBlock =
  | { type: "heading"; text: string }
  | { type: "subheading"; text: string }
  | { type: "paragraph"; content: InlineText[] }
  | { type: "list"; items: string[] };

export type Memo = {
  id: string;
  title: string;
  preview: string;
  /** 목록에 보이는 짧은 날짜 (오늘, 어제 …) */
  date: string;
  /** 상세 위쪽에 보이는 날짜 */
  createdAt: string;
  /** 상세 맨 아래 정보 줄 */
  footer: string;
  label: MemoLabel;
  category: MemoCategory;
  pinned: boolean;
  body: MemoBlock[];
};

export const memos: Memo[] = [
  {
    id: "design-review",
    title: "디자인 리뷰 회의록",
    preview: "검수 기준과 다음 할 일 정리",
    date: "오늘",
    createdAt: "10월 30일 오전 9:12",
    footer: "212자 · 오늘 오전 9:12 수정",
    label: "blue",
    category: "업무",
    pinned: true,
    body: [
      { type: "heading", text: "회의 요약" },
      {
        type: "paragraph",
        content: [
          { text: "시안 검수 기준을 팀 규칙으로 정리했다. 목표는 " },
          { text: "AI가 구현해도 깨지지 않는 시안", strong: true },
          { text: "이다." },
        ],
      },
      { type: "subheading", text: "결정한 것" },
      {
        type: "list",
        items: [
          "묶음은 오토레이아웃, 늘어날 것은 Fill",
          "색과 간격은 변수로 연결",
          "시안은 프레임 링크로 넘기기",
        ],
      },
      { type: "subheading", text: "다음 할 일" },
      {
        type: "paragraph",
        content: [
          { text: "금요일까지", strong: true },
          { text: " 각자 맡은 화면을 채점해 온다. 점수보다 깎인 이유를 먼저 본다." },
        ],
      },
      { type: "subheading", text: "남은 질문" },
      {
        type: "paragraph",
        content: [
          { text: "다크 모드 색은 누가 정할지, 아이콘은 직접 그릴지 다음 회의에서 정한다." },
        ],
      },
    ],
  },
  {
    id: "weekend-hiking",
    title: "주말 등산 준비",
    preview: "물 두 병, 간식, 바람막이 챙기기",
    date: "어제",
    createdAt: "10월 29일 오후 8:40",
    footer: "64자 · 어제 오후 8:40 수정",
    label: "green",
    category: "개인",
    pinned: true,
    body: [
      { type: "heading", text: "챙길 것" },
      { type: "list", items: ["물 두 병", "간식", "바람막이"] },
      {
        type: "paragraph",
        content: [
          { text: "토요일 " },
          { text: "오전 7시", strong: true },
          { text: "에 출발한다." },
        ],
      },
    ],
  },
  {
    id: "groceries",
    title: "장보기 목록",
    preview: "우유, 계란, 사과, 커피 원두",
    date: "오늘",
    createdAt: "10월 30일 오전 8:05",
    footer: "38자 · 오늘 오전 8:05 수정",
    label: "pink",
    category: "개인",
    pinned: false,
    body: [
      { type: "heading", text: "살 것" },
      { type: "list", items: ["우유", "계란", "사과", "커피 원두"] },
    ],
  },
  {
    id: "app-icon",
    title: "앱 아이콘 아이디어",
    preview: "메모지 모서리가 접힌 모양",
    date: "오늘",
    createdAt: "10월 30일 오전 7:30",
    footer: "57자 · 오늘 오전 7:30 수정",
    label: "orange",
    category: "아이디어",
    pinned: false,
    body: [
      { type: "heading", text: "모양" },
      {
        type: "paragraph",
        content: [
          { text: "메모지 모서리가 접힌 모양", strong: true },
          { text: "으로 그린다. 색은 앱의 주 색을 쓴다." },
        ],
      },
    ],
  },
  {
    id: "reading-list",
    title: "읽을 책",
    preview: "디자인 시스템 책 두 권",
    date: "어제",
    createdAt: "10월 29일 오후 10:15",
    footer: "41자 · 어제 오후 10:15 수정",
    label: "green",
    category: "개인",
    pinned: false,
    body: [
      { type: "heading", text: "이번 달에 읽을 책" },
      { type: "list", items: ["디자인 시스템 책 두 권"] },
    ],
  },
];

export function getMemo(id: string) {
  return memos.find((memo) => memo.id === id);
}
