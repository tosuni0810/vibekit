"use client";

import { useLanguage } from "./language-provider";

export function SiteFooter() {
  const { language } = useLanguage();
  const copy = language === "ko"
    ? ["작은 도구는 빠르게, 중요한 작업에 더 오래.", "모든 핵심 처리는 브라우저에서 이루어집니다."]
    : ["Finish small tasks quickly. Save your time for important work.", "All core processing happens in your browser."];
  return <footer className="site-footer"><div className="page-container"><span>VibeKit</span><p>{copy[0]}</p><em>{copy[1]}</em></div></footer>;
}
