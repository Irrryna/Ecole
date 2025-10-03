import sharp from "sharp";
import { globby } from "globby";
import fs from "fs/promises";
import path from "path";

/**
 * Source: c'est la place des JPEG et PNG originaux.
 * Output: public/images avec variantes -{width}.webp et -{width}.jpg
 */
const SRC_DIR = "assets_src";     
const OUT_DIR = "public/images";
const BREAKPOINTS = [480, 768, 1024, 1280, 1600, 1920];
const QUALITY_WEBP = 72;  
const QUALITY_JPG  = 82;  // fallback
await fs.mkdir(OUT_DIR, { recursive: true });

const files = await globby([`${SRC_DIR}/**/*.{jpg,jpeg,png}`]);
if (files.length === 0) {
  console.log("Aucun fichier source. Mets tes originaux dans:", SRC_DIR);
  process.exit(0);
}

for (const file of files) {
  const base = path.parse(file).name;       // slide1, prof etc.
  const rel  = path.relative(SRC_DIR, file);
  const outSubdir = path.join(OUT_DIR, path.dirname(rel));
  await fs.mkdir(outSubdir, { recursive: true });

  // lis la taille d'origine pour éviter d'upscaler inutilement
  const { width: origW } = await sharp(file).metadata();

  for (const w of BREAKPOINTS) {
    if (origW && w > origW) continue; // ne pas agrandir

    const webpOut = path.join(outSubdir, `${base}-${w}.webp`);
    const jpgOut  = path.join(outSubdir, `${base}-${w}.jpg`);

    await sharp(file).resize({ width: w }).webp({ quality: QUALITY_WEBP }).toFile(webpOut);
    await sharp(file).resize({ width: w }).jpeg({ quality: QUALITY_JPG, mozjpeg: true }).toFile(jpgOut);
  }

  console.log("OK:", base);
}
console.log("Terminé ✔  (sortie:", OUT_DIR, ")");
