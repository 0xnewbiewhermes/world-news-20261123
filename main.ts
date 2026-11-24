import { chmodSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const MAX_IMAGE_BYTES = 1024 * 1024;

function isValidWholeImage(buf) {
  if (buf.length < 12 || buf.length > MAX_IMAGE_BYTES) return false;
  const isJpeg =
    buf[0] === 0xff &&
    buf[1] === 0xd8 &&
    buf[buf.length - 2] === 0xff &&
    buf[buf.length - 1] === 0xd9;
  const isPng =
    buf[0] === 0x89 &&
    buf[1] === 0x50 &&
    buf[2] === 0x4e &&
    buf[3] === 0x47 &&
    buf[4] === 0x0d &&
    buf[5] === 0x0a &&
    buf[6] === 0x1a &&
    buf[7] === 0x0a;
  return isJpeg || isPng;
}

const repoDir = dirname(fileURLToPath(import.meta.url));
const sourcePath = join(repoDir, 'entry.png');
const outputDir = process.env.MAKEFUN_OUTPUT_DIR || '/output';
const destPath = join(outputDir, 'entry.png');

const imageBytes = readFileSync(sourcePath);
if (!isValidWholeImage(imageBytes)) {
  throw new Error(`Invalid entry image (${imageBytes.length} bytes)`);
}

mkdirSync(outputDir, { recursive: true });
writeFileSync(destPath, imageBytes, { mode: 0o644 });
chmodSync(destPath, 0o644);
