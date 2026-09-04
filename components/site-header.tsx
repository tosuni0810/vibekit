"use client";

import Link from "next/link";
import { Menu, Search, Sparkles, X } from "lucide-react";
import { useEffect, useState } from "react";
import { localizeTool, tools } from "@/data/tools";
import { useLanguage } from "./language-provider";

const links = ["Tools", "Prompt", "Design", "Developer", "SEO", "Deploy"];
const koreanLinks: Record<string, string> = { Tools: "도구", Prompt: "프롬프트", Design: "디자인", Developer: "개발", SEO: "SEO", Deploy: "배포" };

export function SiteHeader() {
  const { language, toggleLanguage } = useLanguage();
  const en = language === "en";
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
      }
      if (event.key === "Escape") setSearchOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const results = tools.filter((tool) =>
    [tool.name, tool.shortName, tool.description, tool.category, ...tool.tags]
      .join(" ")
      .toLowerCase()
      .includes(query.toLowerCase()),
  );

  return (
    <>
      <header className="site-header">
        <div className="header-inner">
          <Link href="/" className="brand" aria-label={en ? "VibeKit home" : "VibeKit 홈"}>
            <span className="brand-mark"><Sparkles size={16} /></span>
            <span>VibeKit</span>
          </Link>
          <nav className="desktop-nav" aria-label={en ? "Main navigation" : "주요 메뉴"}>
            {links.map((link) => (
              <Link key={link} href={link === "Tools" ? "/#tools" : link === "Prompt" ? "/tools/prompt-builder" : `/#${link.toLowerCase().replace(/\s+/g, "-")}`}>
                {en ? link : koreanLinks[link]}
              </Link>
            ))}
          </nav>
          <div className="header-actions">
            <button className="language-button" onClick={toggleLanguage} aria-label={en ? "한국어로 전환" : "Switch to English"}>{en ? "KO" : "EN"}</button>
            <button className="search-trigger" onClick={() => setSearchOpen(true)} aria-label={en ? "Open tool search" : "도구 검색 열기"}>
              <Search size={16} /><span>{en ? "Search tools" : "도구 검색"}</span><kbd>⌘K</kbd>
            </button>
            <button className="menu-button" onClick={() => setMenuOpen((v) => !v)} aria-label={en ? "Open mobile menu" : "모바일 메뉴 열기"}>
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
        {menuOpen && (
          <nav className="mobile-nav" aria-label={en ? "Mobile navigation" : "모바일 메뉴"}>
            {links.map((link) => (
              <Link key={link} onClick={() => setMenuOpen(false)} href={link === "Tools" ? "/#tools" : link === "Prompt" ? "/tools/prompt-builder" : `/#${link.toLowerCase().replace(/\s+/g, "-")}`}>
                {en ? link : koreanLinks[link]}
              </Link>
            ))}
          </nav>
        )}
      </header>

      {searchOpen && (
        <div className="command-backdrop" role="dialog" aria-modal="true" aria-label={en ? "Tool search" : "도구 검색"} onMouseDown={() => setSearchOpen(false)}>
          <div className="command-panel" onMouseDown={(e) => e.stopPropagation()}>
            <div className="command-input-wrap">
              <Search size={20} />
              <input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="favicon, env, supabase, json..." aria-label={en ? "Search tools" : "도구 검색어"} />
              <button onClick={() => setSearchOpen(false)} aria-label={en ? "Close search" : "검색 닫기"}><X size={18} /></button>
            </div>
            <div className="command-results">
              {results.length ? results.map((tool) => {
                const copy = localizeTool(tool, language);
                return <Link href={`/tools/${tool.slug}`} key={tool.id} onClick={() => setSearchOpen(false)}>
                  <span className="mini-tool-icon" style={{ background: tool.accent }}>{tool.name.slice(0, 1)}</span>
                  <span><strong>{copy.shortName}</strong><small>{copy.description}</small></span>
                  <em>{tool.category}</em>
                </Link>;
              }) : <p className="empty-result">{en ? "No tools found yet." : "아직 준비되지 않은 도구예요."}</p>}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
