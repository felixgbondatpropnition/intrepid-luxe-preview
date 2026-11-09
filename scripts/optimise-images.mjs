// Makes photos web-ready before the site is built. It runs in the publishing workflow only,
// on a fresh copy of the repository, so the originals Emilie uploads are never changed.
//   - photos wider than 2000 pixels are shrunk to 2000 (phone photos are often 4000+)
//   - every photo gets a 900 pixel copy named like "photo-900.jpg", used by the article cards
//   - review photos are shrunk to 400 pixels
// Usage: node scripts/optimise-images.mjs public/img
import { readdir, stat, writeFile, rename } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const root = process.argv[2] ?? 'public/img';
const isPhoto = (f) => /\.jpe?g$/i.test(f) && !/-(700|900)\.jpe?g$/i.test(f); // skips the -700 / -900 copies
let changed = 0;

async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) { await walk(full); continue; }
    if (!isPhoto(entry.name)) continue;
    try {
      const isReview = path.basename(dir) === 'reviews';
      const max = isReview ? 400 : 2000;
      const jpeg = { quality: 82, mozjpeg: true, progressive: true };
      const meta = await sharp(full).metadata();
      const size = (await stat(full)).size;
      if ((meta.width ?? 0) > max || size > 900 * 1024) {
        const buf = await sharp(full).rotate().resize({ width: max, withoutEnlargement: true }).jpeg(jpeg).toBuffer();
        if (buf.length < size || (meta.width ?? 0) > max) {
          await writeFile(full + '.tmp', buf);
          await rename(full + '.tmp', full);
          changed++;
          console.log('shrunk', full, `${(size / 1024) | 0} KB -> ${(buf.length / 1024) | 0} KB`);
        }
      }
      if (!isReview) {
        const small = full.replace(/\.jpe?g$/i, '-900.jpg');
        const { width } = await sharp(full).metadata();
        if (!existsSync(small) && (width ?? 0) > 900) {
          await sharp(full).rotate().resize({ width: 900 }).jpeg({ ...jpeg, quality: 80 }).toFile(small);
          changed++;
          console.log('made', small);
        }
      }
    } catch (e) {
      // one unreadable file must never stop the site publishing
      console.log(`::warning::skipped ${full}: ${e.message}`);
    }
  }
}

await walk(root);
console.log(`optimise-images: ${changed} change(s)`);
