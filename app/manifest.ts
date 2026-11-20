import type { MetadataRoute } from "next";

/*
 * 휴대폰 홈 화면에 추가했을 때 앱처럼 열리게 하는 설정 (웹 앱 매니페스트).
 * 색은 디자인 토큰 값: surface/page(라이트) — 매니페스트는 CSS 변수를 읽지 못해 값을 그대로 쓴다.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "메모",
    short_name: "메모",
    description: "간단한 메모 앱",
    lang: "ko",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#f2f4f6",
    theme_color: "#f2f4f6",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
