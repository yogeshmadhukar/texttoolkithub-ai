import os
import re

dir_path = "src/components"
pattern_link = re.compile(
    r"document\.body\.appendChild\(link\);\s*link\.click\(\);\s*document\.body\.removeChild\(link\);\s*(?:URL\.)?revokeObjectURL\(url\);",
    re.MULTILINE
)

pattern_link_2 = re.compile(
    r"document\.body\.appendChild\(link\);\s*link\.click\(\);\s*document\.body\.removeChild\(link\);",
    re.MULTILINE
)

pattern_element = re.compile(
    r"document\.body\.appendChild\(element\);\s*element\.click\(\);\s*document\.body\.removeChild\(element\);\s*(?:URL\.)?revokeObjectURL\(url\);",
    re.MULTILINE
)

sub_link = """document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 150);"""

sub_link_no_revoke = """document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        document.body.removeChild(link);
      }, 150);"""

sub_element = """document.body.appendChild(element);
      element.click();
      setTimeout(() => {
        document.body.removeChild(element);
        URL.revokeObjectURL(url);
      }, 150);"""

fixed_count = 0

for filename in os.listdir(dir_path):
    if not filename.endswith(".tsx"):
        continue
    filepath = os.path.join(dir_path, filename)
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
    
    original = content
    # Try replacing patterns
    content = pattern_link.sub(sub_link, content)
    content = pattern_element.sub(sub_element, content)
    content = pattern_link_2.sub(sub_link_no_revoke, content)
    
    if content != original:
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Fixed download timing in: {filename}")
        fixed_count += 1

print(f"Total files fixed: {fixed_count}")
