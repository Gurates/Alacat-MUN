// compress-images.mjs
// Compresses all JPG images in public/images/ to reduce file size

import sharp from 'sharp';
import { readdir, stat, writeFile, mkdir, rename, unlink } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const inputDir = path.join(__dirname, 'public', 'images');
const outputDir = path.join(__dirname, 'public', 'images_compressed');

async function compressImages() {
  // Create output dir
  await mkdir(outputDir, { recursive: true });
  
  const files = await readdir(inputDir);
  const jpgFiles = files.filter(f => /\.(jpg|jpeg)$/i.test(f));

  console.log(`Found ${jpgFiles.length} images to compress...\n`);

  let totalBefore = 0;
  let totalAfter = 0;

  for (const file of jpgFiles) {
    const inputPath = path.join(inputDir, file);
    const outputPath = path.join(outputDir, file);
    
    const fileStat = await stat(inputPath);
    const beforeSize = fileStat.size;
    totalBefore += beforeSize;

    await sharp(inputPath)
      .resize({ width: 1200, withoutEnlargement: true })
      .jpeg({ quality: 75, mozjpeg: true })
      .toFile(outputPath);

    const afterStat = await stat(outputPath);
    const afterSize = afterStat.size;
    totalAfter += afterSize;

    const reduction = (((beforeSize - afterSize) / beforeSize) * 100).toFixed(1);
    console.log(`✓ ${file}`);
    console.log(`  ${(beforeSize / 1024).toFixed(0)}KB → ${(afterSize / 1024).toFixed(0)}KB (-${reduction}%)`);
  }

  console.log(`\n============================`);
  console.log(`Total before: ${(totalBefore / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Total after:  ${(totalAfter / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Saved: ${((totalBefore - totalAfter) / 1024 / 1024).toFixed(2)} MB (${(((totalBefore - totalAfter) / totalBefore) * 100).toFixed(1)}%)`);
  console.log(`\nCompressed files are in: public/images_compressed/`);
  console.log(`Run the following to replace originals:`);
  console.log(`  Remove-Item public/images -Recurse -Force`);
  console.log(`  Rename-Item public/images_compressed public/images`);
}

compressImages().catch(console.error);
