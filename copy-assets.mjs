import fs from 'fs';
import path from 'path';

const srcDir = 'c:/Users/binya/Downloads/iguana_named_assets_english';
const destDir = 'c:/Users/binya/Downloads/zip/public/assets/mascot';

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

fs.readdirSync(srcDir).forEach(file => {
  if (file.endsWith('.png')) {
    fs.copyFileSync(path.join(srcDir, file), path.join(destDir, file));
    console.log(`Copied ${file}`);
  }
});
