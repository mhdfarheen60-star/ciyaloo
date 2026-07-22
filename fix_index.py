#!/usr/bin/env python3
"""Append missing closing tags to index.html"""

with open('index.html', 'a', encoding='utf-8') as f:
    f.write('\n</footer>\n</body>\n</html>\n')

print("Fixed index.html - added missing closing tags")
