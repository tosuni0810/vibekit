import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { LanguageProvider } from "@/components/language-provider";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://vibe-ready-tools.blue-leaf-4589.chatgpt.site"),
  title: { default: "VibeKit - 바이브코딩 개발 도구", template: "%s | VibeKit" },
  description: "Favicon, OG Image, ENV, SEO, 개발 Prompt까지. 바이브코딩에 필요한 무료 브라우저 도구를 한곳에서 사용하세요.",
  alternates: { canonical: "/" },
  keywords: ["바이브코딩", "개발 도구", "파비콘", "OG 이미지", "프롬프트 생성기", "ENV", "JSON TypeScript"],
  icons: { icon: "/favicon.ico", shortcut: "/favicon.ico", apple: "/favicon.svg" },
  openGraph: { type: "website", locale: "ko_KR", alternateLocale: "en_US", title: "VibeKit | Free browser developer tools", description: "Free, private developer tools for Favicon, OG images, ENV, SEO, JSON and AI prompts." },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "WebSite", name: "VibeKit", description: "Free browser-based developer tools for vibe coding", inLanguage: ["ko", "en"] }) }} />
        <LanguageProvider>
          <SiteHeader />
          {children}
          <SiteFooter />
        </LanguageProvider>
      </body>
    </html>
  );
}
