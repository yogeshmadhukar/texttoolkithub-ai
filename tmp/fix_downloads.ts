import * as fs from 'fs';
import * as path from 'path';

const dirPath = 'src/components';
const files = fs.readdirSync(dirPath);

let fixedCount = 0;

for (const filename of files) {
  if (!filename.endsWith('.tsx')) continue;
  const filepath = path.join(dirPath, filename);
  let content = fs.readFileSync(filepath, 'utf-8');
  const original = content;

  // Replace link-based pattern with setTimeout
  content = content.replace(
    /document\.body\.appendChild\(link\);\s*link\.click\(\);\s*document\.body\.removeChild\(link\);\s*URL\.revokeObjectURL\(url\);/g,
    `document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 150);`
  );

  // Replace link-based pattern without revoke
  content = content.replace(
    /document\.body\.appendChild\(link\);\s*link\.click\(\);\s*document\.body\.removeChild\(link\);/g,
    `document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        document.body.removeChild(link);
      }, 150);`
  );

  // Replace element-based pattern with setTimeout
  content = content.replace(
    /document\.body\.appendChild\(element\);\s*element\.click\(\);\s*document\.body\.removeChild\(element\);\s*URL\.revokeObjectURL\(url\);/g,
    `document.body.appendChild(element);
      element.click();
      setTimeout(() => {
        document.body.removeChild(element);
        URL.revokeObjectURL(url);
      }, 150);`
  );

  if (content !== original) {
    fs.writeFileSync(filepath, content, 'utf-8');
    console.log(`Fixed download timing in: ${filename}`);
    fixedCount++;
  }
}

console.log(`Total files fixed: ${fixedCount}`);
