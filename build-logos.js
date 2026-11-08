const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const src = path.join(__dirname, "logo.png");
const images = path.join(__dirname, "images");

function lum(r, g, b) {
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

async function loadTrimmed() {
  const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  return { data: Buffer.from(data), info };
}

function makeTransparentFromBlack(data, info, threshold = 48) {
  const out = Buffer.from(data);
  for (let i = 0; i < info.width * info.height; i++) {
    const p = i * 4;
    const r = out[p];
    const g = out[p + 1];
    const b = out[p + 2];
    const l = lum(r, g, b);
    if (l <= threshold) out[p + 3] = 0;
  }
  return out;
}

function recolor(data, info, mapper) {
  const out = Buffer.from(data);
  for (let i = 0; i < info.width * info.height; i++) {
    const p = i * 4;
    if (out[p + 3] < 20) continue;
    const r = out[p];
    const g = out[p + 1];
    const b = out[p + 2];
    const l = lum(r, g, b);
    const y = Math.floor(i / info.width);
    const mapped = mapper(r, g, b, l, y, info.height);
    out[p] = mapped[0];
    out[p + 1] = mapped[1];
    out[p + 2] = mapped[2];
    out[p + 3] = 255;
  }
  return out;
}

async function saveRaw(data, info, file, extra = {}) {
  let img = sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } }).trim();
  if (extra.flatten) {
    img = img.flatten({ background: extra.flatten });
  }
  await img.png().toFile(file);
  const meta = await sharp(file).metadata();
  console.log("Saved", path.basename(file), `${meta.width}x${meta.height}`);
  return meta;
}

(async () => {
  const { data, info } = await loadTrimmed();
  const transparent = makeTransparentFromBlack(data, info, 52);

  const white = recolor(transparent, info, (_r, _g, _b, l) => {
    const t = Math.min(1, l / 255);
    return [245, 240, 232].map((c) => Math.round(c * (0.82 + t * 0.18)));
  });

  const gold = recolor(transparent, info, (_r, _g, _b, l, y, h) => {
    const t = Math.min(1, l / 255);
    const warm = 0.85 + (y / h) * 0.15;
    return [
      Math.round((168 + 70 * t) * warm),
      Math.round((130 + 55 * t) * warm),
      Math.round((74 + 30 * t) * warm),
    ];
  });

  const dark = recolor(transparent, info, (_r, _g, _b, l) => {
    const t = Math.min(1, l / 255);
    return [42, 33, 28].map((c) => Math.round(c * (0.75 + t * 0.25)));
  });

  const whiteMeta = await saveRaw(white, info, path.join(images, "logo-white.png"));
  await saveRaw(gold, info, path.join(images, "logo-gold.png"));
  await saveRaw(dark, info, path.join(images, "logo-dark.png"));
  await saveRaw(dark, info, path.join(images, "logo-on-white.png"), { flatten: "#ffffff" });
  await saveRaw(white, info, path.join(images, "logo-on-gold.png"), { flatten: "#a88656" });

  // Also keep a full alias for backwards compatibility
  fs.copyFileSync(path.join(images, "logo-white.png"), path.join(images, "logo-full.png"));

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${whiteMeta.width} ${whiteMeta.height}" role="img" aria-label="Anife Memeti">
  <defs>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#E8D5A3"/>
      <stop offset="50%" stop-color="#C9A962"/>
      <stop offset="100%" stop-color="#8F6F2E"/>
    </linearGradient>
  </defs>
  <image href="images/logo-gold.png" width="${whiteMeta.width}" height="${whiteMeta.height}" preserveAspectRatio="xMidYMid meet"/>
</svg>`;

  fs.writeFileSync(path.join(__dirname, "logo.svg"), svg);
  console.log("Saved logo.svg");
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
