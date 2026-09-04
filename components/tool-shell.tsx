"use client";

import Link from "next/link";
import { ChevronRight, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import type { ToolDefinition } from "@/data/tools";
import { localizeTool } from "@/data/tools";
import { CopyButton } from "./copy-button";
import { useLanguage } from "./language-provider";

const agents = ["Codex", "Cursor", "Claude Code", "Lovable", "Bolt", "v0", "직접 개발"];
const frameworks = ["Auto", "Next.js", "React", "Vite", "Vue", "Nuxt", "HTML"];

const tips: Record<string, { title: string; body: string }[]> = {
  "image-resizer": [{ title: "여러 크기를 한 번에 받을 수 있나요?", body: "필요한 preset을 두 개 이상 선택하면 각각 변환한 이미지를 하나의 ZIP으로 내려받습니다." }, { title: "원본 이미지가 서버에 남나요?", body: "아니요. 불러오기, 크기 변경, 다운로드 파일 생성까지 현재 브라우저에서 처리됩니다." }],
  svg: [{ title: "SVG 코드가 실행되나요?", body: "script, event handler, 위험한 URL 속성을 제거한 뒤 이미지로만 미리 보여줍니다." }, { title: "React 변환 결과는 바로 쓸 수 있나요?", body: "기본 JSX 속성을 변환해 주며, 프로젝트의 아이콘 규칙과 접근성 속성은 적용 전에 확인하는 것이 좋습니다." }],
  metadata: [{ title: "Title은 얼마나 길어야 하나요?", body: "길이보다 페이지 목적이 분명한지가 중요합니다. 핵심 검색어와 서비스명을 자연스럽게 앞쪽에 배치하세요." }, { title: "OG Image URL은 무엇인가요?", body: "페이지를 공유했을 때 보일 1200×630 이미지의 절대 주소입니다. 배포 도메인에서 실제 접근 가능한 주소를 사용하세요." }],
  env: [{ title: ".env.example에는 값을 남겨도 되나요?", body: "공개 저장소에 포함될 수 있으므로 변수 이름과 설명만 남기고 실제 키·비밀번호는 모두 비워야 합니다." }, { title: "NEXT_PUBLIC_ 변수는 안전한가요?", body: "브라우저 번들에 노출되는 값입니다. 비밀 키나 서버 전용 자격 증명에는 사용하면 안 됩니다." }],
  secret: [{ title: "어떤 길이를 선택하면 되나요?", body: "서비스가 지정한 규격을 우선 따르세요. 별도 규격이 없다면 일반적인 인증 Secret에는 64자를 권장합니다." }, { title: "생성한 값을 다시 찾을 수 있나요?", body: "보안을 위해 저장하지 않습니다. 복사한 뒤 안전한 비밀 관리 도구에 즉시 보관하세요." }],
  "json-to-typescript": [{ title: "중첩 JSON도 변환되나요?", body: "객체와 배열을 탐색해 중첩 구조별 타입을 자동 생성합니다." }, { title: "실제 API 응답에 바로 적용해도 되나요?", body: "샘플에 없던 null이나 선택 필드가 있을 수 있으므로 여러 실제 응답을 비교해 최종 타입을 확인하세요." }],
  "prompt-builder": [{ title: "AI API를 호출하나요?", body: "아니요. 선택한 조건을 템플릿에 조합하므로 비용 없이 브라우저에서 바로 결과를 만듭니다." }, { title: "좋은 작업 결과를 받으려면", body: "목표에 화면, 데이터, 예외 상황, 완료 기준을 구체적으로 적을수록 AI가 범위를 정확히 이해합니다." }],
};

export function ToolShell({ tool, children }: { tool: ToolDefinition; children: React.ReactNode }) {
  const { language } = useLanguage();
  const en = language === "en";
  const copy = localizeTool(tool, language);
  const [agent, setAgent] = useState("Codex");
  const [framework, setFramework] = useState("Auto");
  const prompt = useMemo(() => en
    ? `Analyze the current project structure first.\n\n## Goal\nApply the result created with ${copy.name} to this project.\n\n## Environment\n- AI tool: ${agent}\n- Framework: ${framework}\n\n## Requirements\n- Do not change existing design or functionality\n- Check for configuration conflicts first\n- Verify generated file and reference paths\n- Follow the framework's recommended approach\n\n## Constraints\n- Avoid unnecessary refactors\n- Minimize new dependencies\n- Never include sensitive values in code or the repository\n\n## Verification\n- Check TypeScript errors\n- Run the build\n- Explain applied changes and files`
    : `현재 프로젝트 구조를 먼저 분석해줘.\n\n## 목표\n${tool.name}에서 만든 결과를 현재 프로젝트에 적용해줘.\n\n## 환경\n- AI 도구: ${agent}\n- 프레임워크: ${framework}\n\n## 요구사항\n- 기존 디자인과 기능은 변경하지 말 것\n- 기존 설정과 충돌 여부를 먼저 확인할 것\n- 생성 결과의 파일 경로와 참조 경로가 일치하는지 확인할 것\n- 현재 프레임워크의 권장 방식을 따를 것\n\n## 제약사항\n- 불필요한 리팩터링 금지\n- 새로운 dependency 최소화\n- 민감한 값을 코드나 저장소에 포함하지 말 것\n\n## 검증\n- TypeScript 오류 확인\n- build 실행\n- 적용 결과와 변경 파일을 설명할 것`, [agent, framework, tool.name, en, copy.name]);

  return (
    <main className="tool-page">
      <div className="page-container">
        <nav className="breadcrumbs" aria-label={en ? "Current location" : "현재 위치"}>
          <Link href="/#tools">Tools</Link><ChevronRight size={14} /><span>{tool.category}</span><ChevronRight size={14} /><span>{copy.shortName}</span>
        </nav>
        <section className="tool-heading">
          <div>
            <span className="category-kicker" style={{ color: tool.accent }}>{tool.category}</span>
            <h1>{copy.shortName}</h1>
            <p>{copy.description}</p>
          </div>
          <span className="vibe-badge"><Sparkles size={14} /> Vibe Ready</span>
        </section>

        {children}

        <section className="apply-section">
          <div className="section-title-row">
            <div><span className="eyebrow">APPLY WITH AI</span><h2>{en ? "Apply this result to your project" : "이 결과를 내 프로젝트에 적용하기"}</h2></div>
            <span className="privacy-chip">{en ? "Your input is never sent" : "입력 내용은 전송되지 않아요"}</span>
          </div>
          <div className="apply-grid">
            <div className="choice-stack">
              <fieldset><legend>{en ? "Tool" : "사용 도구"}</legend><div className="choice-pills">{agents.map((item) => <button key={item} type="button" className={agent === item ? "active" : ""} onClick={() => setAgent(item)}>{item}</button>)}</div></fieldset>
              <fieldset><legend>{en ? "Framework" : "프레임워크"}</legend><div className="choice-pills">{frameworks.map((item) => <button key={item} type="button" className={framework === item ? "active" : ""} onClick={() => setFramework(item)}>{item}</button>)}</div></fieldset>
            </div>
            <div className="code-card"><div className="code-card-head"><span>{en ? "Implementation prompt" : "적용 프롬프트"}</span><CopyButton text={prompt} label={en ? "Copy" : "복사"} /></div><pre>{prompt}</pre></div>
          </div>
        </section>
        {tips[tool.slug] && <section className="tool-faq"><span className="eyebrow">QUICK GUIDE</span><h2>사용 전 알아두세요</h2><div>{tips[tool.slug].map((item) => <article key={item.title}><h3>{item.title}</h3><p>{item.body}</p></article>)}</div></section>}
      </div>
    </main>
  );
}
