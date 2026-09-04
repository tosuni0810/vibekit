export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function canvasToBlob(canvas: HTMLCanvasElement, type = "image/png", quality = 0.92) {
  return new Promise<Blob>((resolve, reject) => canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("이미지를 만들 수 없습니다.")), type, quality));
}

export function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("이미지를 불러올 수 없습니다."));
    image.src = src;
  });
}

export function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("파일을 읽을 수 없습니다."));
    reader.readAsDataURL(file);
  });
}

export function drawSquare(
  image: HTMLImageElement,
  size: number,
  options: { background: string; transparent: boolean; scale: number; x: number; y: number; padding: number; radius: number },
) {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas를 사용할 수 없습니다.");
  ctx.clearRect(0, 0, size, size);
  const radius = (options.radius / 100) * (size / 2);
  ctx.save();
  roundedRect(ctx, 0, 0, size, size, radius);
  ctx.clip();
  if (!options.transparent) {
    ctx.fillStyle = options.background;
    ctx.fillRect(0, 0, size, size);
  }
  const base = size * (1 - options.padding / 100);
  const ratio = Math.min(base / image.width, base / image.height) * options.scale;
  const width = image.width * ratio;
  const height = image.height * ratio;
  const x = (size - width) / 2 + (options.x / 100) * size;
  const y = (size - height) / 2 + (options.y / 100) * size;
  ctx.drawImage(image, x, y, width, height);
  ctx.restore();
  return canvas;
}

function roundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
}

function crc32(bytes: Uint8Array) {
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc ^= byte;
    for (let i = 0; i < 8; i++) crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function write16(view: DataView, offset: number, value: number) { view.setUint16(offset, value, true); }
function write32(view: DataView, offset: number, value: number) { view.setUint32(offset, value, true); }

export async function createZip(files: { name: string; data: Blob | Uint8Array | string }[]) {
  const encoder = new TextEncoder();
  const prepared = await Promise.all(files.map(async (file) => ({
    name: encoder.encode(file.name),
    data: typeof file.data === "string" ? encoder.encode(file.data) : file.data instanceof Blob ? new Uint8Array(await file.data.arrayBuffer()) : file.data,
  })));
  const locals: Uint8Array[] = [];
  const centrals: Uint8Array[] = [];
  let offset = 0;
  for (const file of prepared) {
    const checksum = crc32(file.data);
    const local = new Uint8Array(30 + file.name.length + file.data.length);
    const lv = new DataView(local.buffer);
    write32(lv, 0, 0x04034b50); write16(lv, 4, 20); write16(lv, 6, 0x0800); write16(lv, 8, 0);
    write32(lv, 14, checksum); write32(lv, 18, file.data.length); write32(lv, 22, file.data.length); write16(lv, 26, file.name.length);
    local.set(file.name, 30); local.set(file.data, 30 + file.name.length);
    locals.push(local);
    const central = new Uint8Array(46 + file.name.length);
    const cv = new DataView(central.buffer);
    write32(cv, 0, 0x02014b50); write16(cv, 4, 20); write16(cv, 6, 20); write16(cv, 8, 0x0800);
    write32(cv, 16, checksum); write32(cv, 20, file.data.length); write32(cv, 24, file.data.length); write16(cv, 28, file.name.length); write32(cv, 42, offset);
    central.set(file.name, 46); centrals.push(central); offset += local.length;
  }
  const centralSize = centrals.reduce((sum, item) => sum + item.length, 0);
  const end = new Uint8Array(22); const ev = new DataView(end.buffer);
  write32(ev, 0, 0x06054b50); write16(ev, 8, prepared.length); write16(ev, 10, prepared.length); write32(ev, 12, centralSize); write32(ev, 16, offset);
  return new Blob([...locals, ...centrals, end].map(toArrayBuffer), { type: "application/zip" });
}

export async function createIco(entries: { size: number; blob: Blob }[]) {
  const buffers = await Promise.all(entries.map(async (entry) => ({ size: entry.size, bytes: new Uint8Array(await entry.blob.arrayBuffer()) })));
  const headerSize = 6 + buffers.length * 16;
  const total = headerSize + buffers.reduce((sum, item) => sum + item.bytes.length, 0);
  const output = new Uint8Array(total); const view = new DataView(output.buffer);
  write16(view, 0, 0); write16(view, 2, 1); write16(view, 4, buffers.length);
  let dataOffset = headerSize;
  buffers.forEach((item, index) => {
    const p = 6 + index * 16;
    output[p] = item.size >= 256 ? 0 : item.size; output[p + 1] = item.size >= 256 ? 0 : item.size;
    output[p + 2] = 0; output[p + 3] = 0; write16(view, p + 4, 1); write16(view, p + 6, 32);
    write32(view, p + 8, item.bytes.length); write32(view, p + 12, dataOffset);
    output.set(item.bytes, dataOffset); dataOffset += item.bytes.length;
  });
  return new Blob([toArrayBuffer(output)], { type: "image/x-icon" });
}

function toArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
}
