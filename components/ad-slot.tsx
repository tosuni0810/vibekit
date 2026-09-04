"use client";

import { useLanguage } from "./language-provider";

/** Replace this reserved area with the verified ad-network snippet after approval. */
export function AdSlot({ placement }: { placement: "home" | "tool" }) {
  const { language } = useLanguage();
  return (
    <aside className="ad-slot" aria-label={language === "en" ? "Advertisement" : "광고"} data-ad-placement={placement}>
      <span>{language === "en" ? "ADVERTISEMENT" : "광고"}</span>
      <p>{language === "en" ? "Sponsored tools and services will appear here." : "검증된 스폰서 도구와 서비스가 이곳에 표시됩니다."}</p>
    </aside>
  );
}
