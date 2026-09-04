export type ToolCategory = "Design" | "Vibe Coding" | "Developer" | "SEO" | "Deploy";

export type ToolDefinition = {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  description: string;
  category: ToolCategory;
  tags: string[];
  popular: boolean;
  vibeReady: boolean;
  accent: string;
  seoTitle: string;
  seoDescription: string;
};

export const categories: ToolCategory[] = ["Design", "Vibe Coding", "Developer", "SEO", "Deploy"];

export const tools: ToolDefinition[] = [
  {
    id: "favicon",
    slug: "favicon",
    name: "Favicon Generator",
    shortName: "파비콘 만들기",
    description: "이미지 하나로 favicon, Apple·Android 아이콘과 manifest를 한 번에 만듭니다.",
    category: "Design",
    tags: ["favicon", "파비콘", "icon", "이미지", "png", "ico", "pwa"],
    popular: true,
    vibeReady: true,
    accent: "#ff5c35",
    seoTitle: "무료 파비콘 만들기 - Favicon Generator",
    seoDescription: "PNG, JPG, SVG 이미지를 favicon.ico, Apple Touch Icon, PWA 아이콘으로 무료 변환하세요.",
  },
  {
    id: "og-image",
    slug: "og-image",
    name: "OG Image Generator",
    shortName: "OG 이미지",
    description: "서비스 이름과 한 줄 설명으로 1200×630 공유 이미지를 만듭니다.",
    category: "Design",
    tags: ["og", "open graph", "seo", "공유", "이미지", "social"],
    popular: true,
    vibeReady: true,
    accent: "#7c5cff",
    seoTitle: "무료 OG 이미지 만들기 - 1200×630 Generator",
    seoDescription: "템플릿을 골라 SNS 공유용 1200×630 OG 이미지를 브라우저에서 바로 만드세요.",
  },
  {
    id: "prompt-builder",
    slug: "prompt-builder",
    name: "Prompt Builder",
    shortName: "개발 프롬프트",
    description: "Codex·Cursor·Claude Code가 놓치지 않는 작업 지시서를 구조화합니다.",
    category: "Vibe Coding",
    tags: ["prompt", "프롬프트", "codex", "cursor", "claude", "lovable", "bolt", "v0"],
    popular: true,
    vibeReady: true,
    accent: "#1ea672",
    seoTitle: "Codex·Cursor 개발 프롬프트 생성기",
    seoDescription: "바이브코딩 작업 목표, 제약사항, 검증 기준을 빠짐없이 담은 개발 프롬프트를 만드세요.",
  },
  {
    id: "env",
    slug: "env",
    name: "ENV Tool",
    shortName: "ENV 정리",
    description: ".env 템플릿을 만들고 실제 값을 안전한 .env.example 형태로 바꿉니다.",
    category: "Deploy",
    tags: ["env", "환경변수", "supabase", "vercel", "deploy", "secret"],
    popular: true,
    vibeReady: true,
    accent: "#e4a11b",
    seoTitle: "무료 ENV 템플릿·env.example 생성기",
    seoDescription: "환경변수 값을 서버에 보내지 않고 .env 템플릿과 .env.example 파일을 만드세요.",
  },
  {
    id: "json-to-typescript",
    slug: "json-to-typescript",
    name: "JSON → TypeScript",
    shortName: "JSON 타입 변환",
    description: "JSON을 검사하고 중첩 구조까지 읽어 TypeScript 타입으로 변환합니다.",
    category: "Developer",
    tags: ["json", "typescript", "interface", "type", "개발"],
    popular: true,
    vibeReady: true,
    accent: "#3178c6",
    seoTitle: "JSON → TypeScript 변환기",
    seoDescription: "JSON을 검증하고 interface 또는 type으로 무료 변환하세요.",
  },
  {
    id: "image-resizer",
    slug: "image-resizer",
    name: "Image Resizer",
    shortName: "이미지 크기 변경",
    description: "자주 쓰는 규격이나 직접 지정한 크기로 이미지를 일괄 변환합니다.",
    category: "Design",
    tags: ["image", "resize", "이미지", "크기", "png", "jpg", "webp"],
    popular: false,
    vibeReady: true,
    accent: "#ec4899",
    seoTitle: "무료 이미지 크기 변경 - Image Resizer",
    seoDescription: "PNG, JPG, WEBP 이미지를 원하는 규격으로 브라우저에서 안전하게 변환하세요.",
  },
  {
    id: "svg",
    slug: "svg",
    name: "SVG Tool",
    shortName: "SVG 변환",
    description: "SVG를 미리 보고 최적화하거나 PNG와 React 컴포넌트로 변환합니다.",
    category: "Design",
    tags: ["svg", "react", "component", "png", "optimize", "아이콘"],
    popular: false,
    vibeReady: true,
    accent: "#14a6a6",
    seoTitle: "SVG 미리보기·PNG·React 변환 도구",
    seoDescription: "SVG 코드를 안전하게 미리 보고 최적화하거나 PNG와 React 컴포넌트로 변환하세요.",
  },
  {
    id: "metadata",
    slug: "metadata",
    name: "Metadata Generator",
    shortName: "메타데이터",
    description: "검색·공유에 필요한 Next.js Metadata 또는 HTML meta tag를 만듭니다.",
    category: "SEO",
    tags: ["metadata", "seo", "next.js", "html", "og", "twitter", "canonical"],
    popular: false,
    vibeReady: true,
    accent: "#2563eb",
    seoTitle: "Next.js·HTML 메타데이터 생성기",
    seoDescription: "SEO, canonical, Open Graph, Twitter 메타데이터 코드를 간편하게 생성하세요.",
  },
  {
    id: "secret",
    slug: "secret",
    name: "Secret Generator",
    shortName: "보안 키 생성",
    description: "Web Crypto로 안전한 Auth·JWT·CRON·Webhook Secret을 만듭니다.",
    category: "Developer",
    tags: ["secret", "jwt", "auth", "cron", "webhook", "api key", "보안"],
    popular: false,
    vibeReady: true,
    accent: "#8b5cf6",
    seoTitle: "안전한 Secret·API Key 생성기",
    seoDescription: "Web Crypto API로 32~128자 보안 키를 브라우저에서 생성하세요.",
  },
];

export function getTool(slug: string) {
  return tools.find((tool) => tool.slug === slug);
}

const englishCopy: Record<string, Pick<ToolDefinition, "shortName" | "description" | "seoTitle" | "seoDescription">> = {
  favicon: { shortName: "Favicon Maker", description: "Create a favicon, Apple and Android icons, and a manifest from one image.", seoTitle: "Free Favicon Maker", seoDescription: "Convert PNG, JPG, or SVG images into favicon.ico, Apple Touch Icons, and PWA icons." },
  "og-image": { shortName: "OG Image", description: "Create a 1200×630 social image from your service name and a short description.", seoTitle: "Free OG Image Generator", seoDescription: "Make social-ready 1200×630 OG images directly in your browser." },
  "prompt-builder": { shortName: "Dev Prompt", description: "Structure clear task instructions for Codex, Cursor, and Claude Code.", seoTitle: "Developer Prompt Builder", seoDescription: "Create complete development prompts with goals, constraints, and verification criteria." },
  env: { shortName: "ENV Helper", description: "Create .env templates and safely turn real values into .env.example files.", seoTitle: "Free ENV Template Generator", seoDescription: "Create ENV templates and .env.example files without sending values to a server." },
  "json-to-typescript": { shortName: "JSON to TypeScript", description: "Validate JSON and convert nested data into TypeScript types.", seoTitle: "JSON to TypeScript Converter", seoDescription: "Validate JSON and generate interface or type definitions for free." },
  "image-resizer": { shortName: "Image Resizer", description: "Batch-convert images to common presets or custom dimensions.", seoTitle: "Free Image Resizer", seoDescription: "Resize PNG, JPG, and WEBP images safely in your browser." },
  svg: { shortName: "SVG Converter", description: "Preview and optimize SVGs, then convert them to PNG or React components.", seoTitle: "SVG Preview, PNG, and React Converter", seoDescription: "Preview, optimize, and convert SVG code safely in your browser." },
  metadata: { shortName: "Metadata", description: "Generate Next.js Metadata or HTML meta tags for search and sharing.", seoTitle: "Next.js and HTML Metadata Generator", seoDescription: "Generate SEO, canonical, Open Graph, and Twitter metadata code." },
  secret: { shortName: "Secret Generator", description: "Generate secure Auth, JWT, CRON, and Webhook secrets with Web Crypto.", seoTitle: "Secure Secret and API Key Generator", seoDescription: "Generate secure 32–128 character keys with the Web Crypto API." },
};

export function localizeTool(tool: ToolDefinition, language: "ko" | "en") {
  return language === "en" ? { ...tool, ...englishCopy[tool.id] } : tool;
}
