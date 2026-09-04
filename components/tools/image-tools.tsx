"use client";
/* eslint-disable @next/next/no-img-element */

import { Download, ImagePlus, Loader2, UploadCloud } from "lucide-react";
import { DragEvent, useEffect, useRef, useState } from "react";
import { canvasToBlob, createIco, createZip, downloadBlob, drawSquare, fileToDataUrl, loadImage } from "@/lib/browser-files";
import { CopyButton } from "@/components/copy-button";

const imageTypes = ["image/png", "image/jpeg", "image/webp", "image/svg+xml"];

function UploadBox({ onFile, accept = "image/png,image/jpeg,image/webp,image/svg+xml", note = "PNG, JPG, WEBP, SVG · 최대 15MB" }: { onFile: (file: File) => void; accept?: string; note?: string }) {
  const input = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  function take(files: FileList | null) { if (files?.[0]) onFile(files[0]); }
  function drop(event: DragEvent) { event.preventDefault(); setDragging(false); take(event.dataTransfer.files); }
  return <div className={`upload-box ${dragging ? "dragging" : ""}`} onDragOver={(e) => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={drop}>
    <span className="upload-icon"><UploadCloud size={26} /></span><strong>이미지를 끌어다 놓으세요</strong><p>{note}</p>
    <button type="button" className="secondary-button" onClick={() => input.current?.click()}><ImagePlus size={17} /> 파일 선택</button>
    <input ref={input} hidden type="file" accept={accept} onChange={(e) => take(e.target.files)} />
  </div>;
}

export function FaviconTool() {
  const [source, setSource] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [background, setBackground] = useState("#111827");
  const [transparent, setTransparent] = useState(false);
  const [scale, setScale] = useState(0.78);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [padding, setPadding] = useState(8);
  const [radius, setRadius] = useState(22);
  const [preview, setPreview] = useState("");
  const [working, setWorking] = useState(false);
  const [install, setInstall] = useState("Next.js");

  const options = { background, transparent, scale, x, y, padding, radius };

  async function choose(next: File) {
    setError("");
    if (!imageTypes.includes(next.type)) return setError("PNG, JPG, WEBP, SVG 이미지만 사용할 수 있어요.");
    if (next.size > 15 * 1024 * 1024) return setError("파일은 15MB 이하로 올려주세요.");
    setFile(next); setSource(await fileToDataUrl(next));
  }

  useEffect(() => {
    if (!source) { setPreview(""); return; }
    let active = true;
    loadImage(source).then((image) => {
      if (active) setPreview(drawSquare(image, 512, options).toDataURL("image/png"));
    }).catch(() => setError("이미지를 미리 볼 수 없습니다."));
    return () => { active = false; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source, background, transparent, scale, x, y, padding, radius]);

  async function downloadPackage() {
    if (!source) return setError("먼저 이미지를 선택해 주세요.");
    setWorking(true); setError("");
    try {
      const image = await loadImage(source);
      const sizes = [16, 32, 48, 180, 192, 512];
      const blobs = new Map<number, Blob>();
      for (const size of sizes) blobs.set(size, await canvasToBlob(drawSquare(image, size, options)));
      const ico = await createIco([16, 32, 48].map((size) => ({ size, blob: blobs.get(size)! })));
      const manifest = JSON.stringify({ name: "My Website", short_name: "Website", icons: [
        { src: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
        { src: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
      ], theme_color: background, background_color: background, display: "standalone" }, null, 2);
      const readme = "VibeKit Favicon Package\n\n파일을 프로젝트의 public 폴더에 넣고 제공된 link 또는 metadata 설정을 적용하세요.\n";
      const contents: { name: string; data: Blob | string }[] = [
        { name: "favicon.ico", data: ico }, { name: "favicon-16x16.png", data: blobs.get(16)! },
        { name: "favicon-32x32.png", data: blobs.get(32)! }, { name: "favicon-48x48.png", data: blobs.get(48)! },
        { name: "apple-touch-icon.png", data: blobs.get(180)! }, { name: "android-chrome-192x192.png", data: blobs.get(192)! },
        { name: "android-chrome-512x512.png", data: blobs.get(512)! }, { name: "site.webmanifest", data: manifest }, { name: "README.txt", data: readme },
      ];
      if (file?.type === "image/svg+xml") contents.push({ name: "favicon.svg", data: await file.text() });
      downloadBlob(await createZip(contents), "favicon-package.zip");
    } catch { setError("패키지를 만드는 중 문제가 생겼어요. 다른 이미지를 사용해 보세요."); }
    finally { setWorking(false); }
  }

  const installCodes: Record<string, string> = {
    HTML: `<link rel="icon" href="/favicon.ico" sizes="any">\n<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">\n<link rel="apple-touch-icon" href="/apple-touch-icon.png">\n<link rel="manifest" href="/site.webmanifest">`,
    "Next.js": `// app/layout.tsx\nexport const metadata = {\n  icons: {\n    icon: "/favicon.ico",\n    apple: "/apple-touch-icon.png",\n  },\n  manifest: "/site.webmanifest",\n};`,
    "React/Vite": `// public/ 폴더에 파일을 넣고 index.html <head>에 추가\n<link rel="icon" href="/favicon.ico" />\n<link rel="apple-touch-icon" href="/apple-touch-icon.png" />\n<link rel="manifest" href="/site.webmanifest" />`,
  };

  return <div className="workbench-stack">
    <section className="workbench two-col">
      <div className="panel editor-panel"><div className="panel-head"><span>01</span><div><h2>이미지와 모양</h2><p>모든 편집은 이 브라우저 안에서만 처리돼요.</p></div></div>
        {!source ? <UploadBox onFile={choose} /> : <>
          <div className="file-row">{preview ? <img src={preview} alt="업로드한 파비콘 미리보기" /> : <span className="file-preview-placeholder" aria-hidden="true" />}<span><strong>{file?.name}</strong><small>{file ? `${(file.size / 1024).toFixed(0)} KB` : ""}</small></span><button onClick={() => { setSource(""); setFile(null); }}>교체</button></div>
          <div className="control-grid">
            <label>배경색<span><input type="color" value={background} disabled={transparent} onChange={(e) => setBackground(e.target.value)} /><code>{background}</code></span></label>
            <label className="switch-label">투명 배경<input type="checkbox" checked={transparent} onChange={(e) => setTransparent(e.target.checked)} /><i /></label>
            <Range label="이미지 크기" value={scale} min={0.3} max={1.8} step={0.01} display={`${Math.round(scale * 100)}%`} onChange={setScale} />
            <Range label="여백" value={padding} min={0} max={45} display={`${padding}%`} onChange={setPadding} />
            <Range label="가로 위치" value={x} min={-40} max={40} display={`${x}`} onChange={setX} />
            <Range label="세로 위치" value={y} min={-40} max={40} display={`${y}`} onChange={setY} />
            <Range label="모서리" value={radius} min={0} max={100} display={`${radius}%`} onChange={setRadius} />
          </div>
        </>}
        {error && <p className="inline-error">{error}</p>}
      </div>
      <div className="panel preview-panel"><div className="panel-head"><span>02</span><div><h2>실시간 미리보기</h2><p>실제로 보이는 크기를 확인하세요.</p></div></div>
        <div className="favicon-previews">
          <div className="browser-preview"><div className="browser-bar"><i /><i /><i /></div><div className="browser-tab">{preview ? <img src={preview} alt="" /> : <span className="blank-favicon" />}<span>My Website</span><b>×</b></div><div className="address">🔒 mywebsite.com</div></div>
          <div className="google-preview"><small>Google 검색</small><div>{preview ? <img src={preview} alt="" /> : <span />}<p><b>My Website</b><em>https://mywebsite.com</em></p></div><h3>내 서비스의 멋진 제목</h3><p>검색 결과에서 파비콘이 이렇게 보여요.</p></div>
          <div className="mobile-bookmark"><small>모바일 홈 화면</small><div>{preview ? <img src={preview} alt="" /> : <span />}<b>My Website</b></div></div>
        </div>
        <button className="primary-button full" type="button" disabled={!source || working} onClick={downloadPackage}>{working ? <Loader2 size={18} className="spin" /> : <Download size={18} />}{working ? "패키지 만드는 중" : "전체 패키지 다운로드"}</button>
        <p className="button-note">ICO · PNG 6종 · manifest · README를 ZIP으로 받아요</p>
      </div>
    </section>
    <section className="install-section"><div className="section-title-row"><div><span className="eyebrow">INSTALL</span><h2>프로젝트에 설치하기</h2></div></div><div className="install-tabs">{Object.keys(installCodes).map((item) => <button key={item} className={install === item ? "active" : ""} onClick={() => setInstall(item)}>{item}</button>)}</div><div className="code-card"><div className="code-card-head"><span>{install} 설치 코드</span><CopyButton text={installCodes[install]} /></div><pre>{installCodes[install]}</pre></div></section>
    <InfoBlock title="파비콘, 어디에 쓰나요?" items={[{ h: "권장 파비콘 크기", p: "브라우저 탭에는 16·32·48px, iOS 홈 화면에는 180px, Android와 PWA에는 192·512px 아이콘이 주로 사용됩니다." }, { h: "Next.js에서는", p: "App Router의 app 폴더에 icon 파일을 두거나 Metadata의 icons와 manifest 경로를 지정할 수 있습니다." }, { h: "검색에 바로 안 보인다면", p: "파일 경로, 캐시, 검색엔진의 재수집 주기를 확인하세요. 파일을 바꿔도 검색 결과 반영에는 시간이 걸릴 수 있습니다." }]} />
  </div>;
}

function Range({ label, value, min, max, step = 1, display, onChange }: { label: string; value: number; min: number; max: number; step?: number; display: string; onChange: (v: number) => void }) {
  return <label className="range-control"><span>{label}<b>{display}</b></span><input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} /></label>;
}

export function ImageResizerTool() {
  const [source, setSource] = useState(""); const [file, setFile] = useState<File | null>(null); const [error, setError] = useState("");
  const [width, setWidth] = useState(1200); const [height, setHeight] = useState(630); const [ratio, setRatio] = useState(true); const [imageRatio, setImageRatio] = useState(1);
  const [format, setFormat] = useState("image/png"); const [selected, setSelected] = useState<string[]>(["1200×630"]); const [working, setWorking] = useState(false);
  const presets = ["16×16", "32×32", "48×48", "180×180", "192×192", "512×512", "1200×630", "1080×1080"];
  async function choose(next: File) { setError(""); if (!imageTypes.slice(0, 3).includes(next.type)) return setError("PNG, JPG, WEBP 이미지를 선택해 주세요."); if (next.size > 20 * 1024 * 1024) return setError("파일은 20MB 이하로 올려주세요."); const url = await fileToDataUrl(next); const image = await loadImage(url); setSource(url); setFile(next); setImageRatio(image.width / image.height); setWidth(image.width); setHeight(image.height); }
  async function exportImages() { if (!source) return setError("먼저 이미지를 선택해 주세요."); setWorking(true); try { const image = await loadImage(source); const sizes = selected.length ? selected.map((p) => p.split("×").map(Number) as [number, number]) : [[width, height] as [number, number]]; const extension = format.split("/")[1].replace("jpeg", "jpg"); const files = await Promise.all(sizes.map(async ([w, h]) => { const canvas = document.createElement("canvas"); canvas.width = w; canvas.height = h; const ctx = canvas.getContext("2d")!; ctx.imageSmoothingQuality = "high"; ctx.drawImage(image, 0, 0, w, h); return { name: `image-${w}x${h}.${extension}`, data: await canvasToBlob(canvas, format, 0.92) }; })); if (files.length === 1) downloadBlob(files[0].data, files[0].name); else downloadBlob(await createZip(files), "resized-images.zip"); } catch { setError("이미지를 변환할 수 없습니다."); } finally { setWorking(false); } }
  return <div className="workbench-stack"><section className="workbench two-col"><div className="panel"><div className="panel-head"><span>01</span><div><h2>원본 이미지</h2><p>이미지는 서버에 업로드되지 않아요.</p></div></div>{!source ? <UploadBox onFile={choose} accept="image/png,image/jpeg,image/webp" note="PNG, JPG, WEBP · 최대 20MB" /> : <div className="image-stage"><img src={source} alt="크기를 변경할 원본" /><div><strong>{file?.name}</strong><button onClick={() => setSource("")}>다른 이미지</button></div></div>}{error && <p className="inline-error">{error}</p>}</div>
    <div className="panel"><div className="panel-head"><span>02</span><div><h2>출력 크기</h2><p>여러 규격은 ZIP으로 한 번에 받아요.</p></div></div><div className="preset-grid">{presets.map((preset) => <button key={preset} className={selected.includes(preset) ? "active" : ""} onClick={() => setSelected((now) => now.includes(preset) ? now.filter((x) => x !== preset) : [...now, preset])}>{preset}</button>)}</div><div className="custom-size"><label>너비<input type="number" value={width} min={1} max={5000} onChange={(e) => { const v = Number(e.target.value); setWidth(v); if (ratio) setHeight(Math.round(v / imageRatio)); }} /></label><b>×</b><label>높이<input type="number" value={height} min={1} max={5000} onChange={(e) => { const v = Number(e.target.value); setHeight(v); if (ratio) setWidth(Math.round(v * imageRatio)); }} /></label></div><label className="check-row"><input type="checkbox" checked={ratio} onChange={(e) => setRatio(e.target.checked)} /> 원본 비율 유지</label><label className="field-label">출력 형식<select value={format} onChange={(e) => setFormat(e.target.value)}><option value="image/png">PNG</option><option value="image/jpeg">JPG</option><option value="image/webp">WEBP</option></select></label><button className="primary-button full" disabled={!source || working} onClick={exportImages}><Download size={18} />{working ? "변환 중" : selected.length > 1 ? `${selected.length}개 이미지 ZIP 다운로드` : "이미지 다운로드"}</button></div></section></div>;
}

export function OgImageTool() {
  const canvasRef = useRef<HTMLCanvasElement>(null); const [name, setName] = useState("VibeKit"); const [tagline, setTagline] = useState("바이브코딩에 필요한 도구를 한곳에서"); const [background, setBackground] = useState("#101114"); const [color, setColor] = useState("#ffffff"); const [template, setTemplate] = useState("Minimal"); const [logo, setLogo] = useState("");
  useEffect(() => { const canvas = canvasRef.current; if (!canvas) return; const ctx = canvas.getContext("2d")!; const draw = async () => { ctx.fillStyle = background; ctx.fillRect(0, 0, 1200, 630); ctx.fillStyle = color; if (template === "Minimal") { ctx.fillStyle = "#ff5c35"; ctx.fillRect(78, 82, 58, 10); ctx.fillStyle = color; ctx.font = "700 72px Arial"; wrapText(ctx, name, 78, 245, 980, 84); ctx.globalAlpha = .68; ctx.font = "400 32px Arial"; wrapText(ctx, tagline, 82, 445, 950, 46); ctx.globalAlpha = 1; } else if (template === "Centered") { ctx.textAlign = "center"; ctx.font = "700 76px Arial"; wrapText(ctx, name, 600, 286, 980, 88); ctx.globalAlpha = .72; ctx.font = "400 30px Arial"; wrapText(ctx, tagline, 600, 405, 940, 44); ctx.globalAlpha = 1; ctx.textAlign = "left"; } else { ctx.fillStyle = color; ctx.fillRect(0, 0, 620, 630); ctx.fillStyle = background; ctx.font = "700 66px Arial"; wrapText(ctx, name, 72, 220, 490, 78); ctx.globalAlpha = .72; ctx.font = "400 29px Arial"; wrapText(ctx, tagline, 76, 430, 470, 42); ctx.globalAlpha = 1; ctx.fillStyle = color; ctx.font = "700 110px Arial"; ctx.textAlign = "center"; ctx.fillText(name.slice(0, 1), 910, 355); ctx.textAlign = "left"; } if (logo) { try { const image = await loadImage(logo); ctx.drawImage(image, 1020, 64, 96, 96); } catch {} } }; draw(); }, [name, tagline, background, color, template, logo]);
  async function logoFile(file: File) { if (file.size < 10 * 1024 * 1024) setLogo(await fileToDataUrl(file)); }
  async function download() { if (canvasRef.current) downloadBlob(await canvasToBlob(canvasRef.current), "og-image-1200x630.png"); }
  return <div className="workbench-stack"><section className="workbench two-col"><div className="panel"><div className="panel-head"><span>01</span><div><h2>콘텐츠와 스타일</h2><p>1200×630 규격으로 바로 만들어요.</p></div></div><div className="form-stack"><label>서비스명<input value={name} maxLength={36} onChange={(e) => setName(e.target.value)} /></label><label>한 줄 설명<textarea value={tagline} maxLength={80} rows={3} onChange={(e) => setTagline(e.target.value)} /></label><div className="color-fields"><label>배경색<span><input type="color" value={background} onChange={(e) => setBackground(e.target.value)} /><code>{background}</code></span></label><label>글자색<span><input type="color" value={color} onChange={(e) => setColor(e.target.value)} /><code>{color}</code></span></label></div><label>로고 또는 이미지<input type="file" accept="image/png,image/jpeg,image/webp" onChange={(e) => e.target.files?.[0] && logoFile(e.target.files[0])} /></label></div></div><div className="panel"><div className="panel-head"><span>02</span><div><h2>미리보기</h2><p>템플릿을 골라 결과를 확인하세요.</p></div></div><div className="template-tabs">{["Minimal", "Centered", "Product"].map((item) => <button className={template === item ? "active" : ""} key={item} onClick={() => setTemplate(item)}>{item}</button>)}</div><div className="og-canvas-wrap"><canvas ref={canvasRef} width={1200} height={630} aria-label="OG 이미지 미리보기" /></div><button className="primary-button full" onClick={download}><Download size={18} /> PNG 다운로드</button></div></section><InfoBlock title="OG 이미지 적용 전 확인" items={[{ h: "권장 규격", p: "대부분의 서비스에서 1200×630px, 약 1.91:1 비율이 안정적으로 표시됩니다." }, { h: "중요한 내용은 중앙에", p: "플랫폼마다 가장자리가 잘릴 수 있어 로고와 핵심 문구는 안전 영역 안에 두는 것이 좋습니다." }]} /></div>;
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) { const words = text.split(" "); let line = ""; const lines: string[] = []; for (const word of words) { const test = line ? `${line} ${word}` : word; if (ctx.measureText(test).width > maxWidth && line) { lines.push(line); line = word; } else line = test; } lines.push(line); lines.forEach((value, index) => ctx.fillText(value, x, y + index * lineHeight)); }

export function InfoBlock({ title, items }: { title: string; items: { h: string; p: string }[] }) { return <section className="info-block"><span className="eyebrow">GUIDE</span><h2>{title}</h2><div>{items.map((item) => <article key={item.h}><h3>{item.h}</h3><p>{item.p}</p></article>)}</div></section>; }
