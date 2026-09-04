"use client";

import Link from "next/link";
import { ArrowRight, Braces, Code2, Expand, FileCode2, Image as ImageIcon, KeyRound, Rocket, Search, Share2, ShieldCheck, Sparkles, WandSparkles, Zap } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { categories, localizeTool, tools } from "@/data/tools";
import { useLanguage } from "./language-provider";
import { AdSlot } from "./ad-slot";

const iconMap = {
  favicon: Sparkles,
  "og-image": Share2,
  "prompt-builder": WandSparkles,
  env: FileCode2,
  "json-to-typescript": Braces,
  "image-resizer": Expand,
  svg: Code2,
  metadata: ImageIcon,
  secret: KeyRound,
};

const goalIconMap = { launch: Rocket, share: Share2, secure: ShieldCheck };

export function HomePage() {
  const { language } = useLanguage();
  const [query, setQuery] = useState("");
  const [recentIds, setRecentIds] = useState<string[]>([]);
  const en = language === "en";
  useEffect(() => {
    try { setRecentIds(JSON.parse(window.localStorage.getItem("vibekit-recent-tools") ?? "[]")); } catch { setRecentIds([]); }
  }, []);
  const filtered = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return tools;
    return tools.filter((tool) => [tool.name, tool.shortName, tool.description, tool.category, ...tool.tags].join(" ").toLowerCase().includes(value));
  }, [query]);

  const popular = tools.filter((tool) => tool.popular);
  const recent = recentIds.map((id) => tools.find((tool) => tool.id === id)).filter(Boolean) as typeof tools;
  const goals = en
    ? [{ id: "launch", title: "Launch a website", text: "Make a favicon and resize images.", query: "favicon" }, { id: "share", title: "Share your work", text: "Create an OG image and metadata.", query: "og" }, { id: "secure", title: "Deploy safely", text: "Prepare ENV files and secret keys.", query: "env" }]
    : [{ id: "launch", title: "웹사이트를 시작해요", text: "파비콘을 만들고 이미지를 맞춰요.", query: "favicon" }, { id: "share", title: "내 작업을 공유해요", text: "OG 이미지와 메타데이터를 만들어요.", query: "og" }, { id: "secure", title: "안전하게 배포해요", text: "ENV 파일과 보안 키를 준비해요.", query: "env" }];
  const rememberTool = (id: string) => {
    const next = [id, ...recentIds.filter((value) => value !== id)].slice(0, 3);
    setRecentIds(next);
    window.localStorage.setItem("vibekit-recent-tools", JSON.stringify(next));
  };

  return (
    <main>
      <section className="home-hero">
        <div className="hero-orb hero-orb-one" /><div className="hero-orb hero-orb-two" />
        <div className="hero-glow" />
        <div className="page-container hero-inner">
          <div className="hero-proof"><span><Zap size={14} fill="currentColor" /> FREE &amp; LOCAL</span><em>{en ? "Use it instantly, with no server upload" : "서버 전송 없이, 바로 사용"}</em></div>
          <div className="hero-feature-label"><Sparkles size={14} /> {en ? "MOST POPULAR · FAVICON MAKER" : "가장 많이 쓰는 도구 · 파비콘 만들기"}</div>
          <h1>{en ? <>Make your favicon.<br /><span>Make your site memorable.</span></> : <>파비콘 하나로<br /><span>내 사이트를 기억하게 하세요.</span></>}</h1>
          <p>{en ? <>Turn one image into a complete favicon package.<br className="desktop-break" /> Apple, Android, and PWA icons are included automatically.</> : <>이미지 하나를 올리면 파비콘 패키지가 완성돼요.<br className="desktop-break" /> Apple, Android, PWA 아이콘까지 한 번에 받아보세요.</>}</p>
          <div className="hero-cta-row"><Link className="hero-primary-cta" href="/tools/favicon" onClick={() => rememberTool("favicon")}><Sparkles size={18} />{en ? "Create a favicon" : "파비콘 만들기"}<ArrowRight size={17} /></Link><span>{en ? "Free · No sign-up" : "무료 · 회원가입 없음"}</span></div>
          <div className="hero-search">
            <Search size={22} />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={en ? "Search tools: favicon, env, supabase, json..." : "도구 검색: favicon, env, supabase, json..."} aria-label={en ? "Search tools" : "도구 검색"} />
            <span>{filtered.length} tools</span>
          </div>
          <div className="quick-tags"><span>{en ? "Quick search" : "빠른 검색"}</span>{["favicon", "env", en ? "image" : "이미지", "codex", "seo"].map((tag) => <button key={tag} onClick={() => setQuery(tag)}>{tag}</button>)}</div>
          <div className="hero-stats"><span><b>9</b> {en ? "free tools" : "개 무료 도구"}</span><i /><span><b>100%</b> {en ? "in your browser" : "브라우저 처리"}</span><i /><span><b>KO · EN</b> {en ? "supported" : "지원"}</span></div>
        </div>
      </section>

      <div className="page-container home-content" id="tools">
        {query ? (
          <section className="tool-section search-section">
            <div className="section-heading"><div><span className="eyebrow">SEARCH RESULT</span><h2>{en ? "Search results" : "검색 결과"}</h2></div><span>{en ? `${filtered.length} tools` : `${filtered.length}개 도구`}</span></div>
            {filtered.length ? <div className="tool-grid">{filtered.map((tool) => <ToolCard key={tool.id} tool={tool} onOpen={rememberTool} />)}</div> : <div className="no-tools"><Search size={28} /><h3>{en ? "No tools found yet." : "아직 준비되지 않은 도구예요."}</h3><p>{en ? "Try another keyword." : "다른 키워드로 다시 검색해 보세요."}</p><button onClick={() => setQuery("")}>{en ? "View all tools" : "전체 도구 보기"}</button></div>}
          </section>
        ) : (
          <>
            <section className="start-section" aria-labelledby="start-title">
              <div className="section-heading"><div><span className="eyebrow">START HERE</span><h2 id="start-title">{en ? "What are you trying to do?" : "무엇을 하고 싶나요?"}</h2></div><span>{en ? "Choose one and get started" : "하나를 고르면 바로 시작할 수 있어요"}</span></div>
              <div className="goal-grid">{goals.map((goal) => { const Icon = goalIconMap[goal.id as keyof typeof goalIconMap]; return <button className="goal-card" key={goal.id} onClick={() => setQuery(goal.query)}><span><Icon size={21} /></span><strong>{goal.title}</strong><small>{goal.text}</small><ArrowRight size={17} /></button>; })}</div>
            </section>
            <section className="tool-section">
              <div className="section-heading"><div><span className="eyebrow">MOST USED</span><h2>{en ? "Popular tools" : "인기 도구"}</h2></div><span>{en ? "Open one whenever you get stuck" : "막히는 순간 바로 꺼내 쓰세요"}</span></div>
              <div className="popular-grid">{popular.map((tool, index) => <ToolCard key={tool.id} tool={tool} rank={index + 1} onOpen={rememberTool} />)}</div>
            </section>

            {recent.length > 0 && <section className="tool-section recent-section"><div className="section-heading"><div><span className="eyebrow">RECENTLY USED</span><h2>{en ? "Continue where you left off" : "최근 사용한 도구"}</h2></div><span>{en ? "Stored only in this browser" : "이 브라우저에만 저장됩니다"}</span></div><div className="tool-grid">{recent.map((tool) => <ToolCard key={tool.id} tool={tool} compact onOpen={rememberTool} />)}</div></section>}

            <AdSlot placement="home" />

            <section className="tool-section category-sections">
              <div className="section-heading"><div><span className="eyebrow">ALL TOOLS</span><h2>{en ? "Tools by category" : "카테고리별 도구"}</h2></div><span>{en ? "All processing stays in your browser" : "모든 처리는 내 브라우저에서"}</span></div>
              {categories.map((category) => {
                const group = tools.filter((tool) => tool.category === category);
                return group.length ? <div className="category-row" id={category.toLowerCase().replace(/\s+/g, "-")} key={category}><div className="category-label"><span>{category}</span><small>{group.length.toString().padStart(2, "0")}</small></div><div className="tool-grid">{group.map((tool) => <ToolCard key={tool.id} tool={tool} compact onOpen={rememberTool} />)}</div></div> : null;
              })}
            </section>
          </>
        )}

        <section className="principle-strip">
          <div><Zap size={20} /><strong>{en ? "Fast" : "빠르게"}</strong><span>{en ? "No installation needed" : "설치 없이 바로"}</span></div>
          <div><KeyRound size={20} /><strong>{en ? "Private" : "안전하게"}</strong><span>{en ? "Sensitive data stays in your browser" : "민감 정보는 브라우저에서만"}</span></div>
          <div><WandSparkles size={20} /><strong>{en ? "Ready" : "이어서"}</strong><span>{en ? "Prompts for AI implementation" : "AI 적용 프롬프트까지"}</span></div>
        </section>
        <section className="simple-guide" aria-labelledby="guide-title">
          <div><span className="eyebrow">HOW IT WORKS</span><h2 id="guide-title">{en ? "Get it done in three simple steps" : "세 단계면 끝나요"}</h2><p>{en ? "No account, installation, or complicated setup." : "회원가입도, 설치도, 복잡한 설정도 필요 없어요."}</p></div>
          <ol><li><b>01</b><span><strong>{en ? "Choose a tool" : "도구를 고르세요"}</strong><small>{en ? "Pick the task you need right now." : "지금 필요한 작업을 하나 고르세요."}</small></span></li><li><b>02</b><span><strong>{en ? "Add your content" : "내용을 넣으세요"}</strong><small>{en ? "Upload an image or paste your text." : "이미지를 올리거나 내용을 붙여 넣으세요."}</small></span></li><li><b>03</b><span><strong>{en ? "Download or copy" : "받아서 사용하세요"}</strong><small>{en ? "Use your result in your project right away." : "만든 결과를 바로 프로젝트에 쓰세요."}</small></span></li></ol>
        </section>
      </div>
    </main>
  );
}

function ToolCard({ tool, rank, compact = false, onOpen }: { tool: (typeof tools)[number]; rank?: number; compact?: boolean; onOpen?: (id: string) => void }) {
  const { language } = useLanguage();
  const copy = localizeTool(tool, language);
  const Icon = iconMap[tool.id as keyof typeof iconMap] ?? Code2;
  return (
    <Link href={`/tools/${tool.slug}`} onClick={() => onOpen?.(tool.id)} className={`tool-card ${compact ? "compact" : ""}`}>
      <div className="card-top">
        <span className="tool-icon" style={{ background: `${tool.accent}16`, color: tool.accent }}><Icon size={compact ? 20 : 24} /></span>
        {rank ? <span className="rank">0{rank}</span> : null}
      </div>
      <div><span className="card-category">{tool.category}</span><h3>{copy.shortName}</h3><p>{copy.description}</p></div>
      <div className="card-bottom"><span className="vibe-mini"><Sparkles size={12} /> Vibe Ready</span><ArrowRight size={18} /></div>
    </Link>
  );
}
