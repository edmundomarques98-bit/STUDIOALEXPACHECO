"""Give CSS/JS URLs content versions so new deployments cannot reuse stale assets."""
import hashlib
from pathlib import Path
import re
import sys
from urllib.parse import urlsplit

root = Path(sys.argv[1]).resolve()
page = root / 'index.html'

def version(match):
    url = urlsplit(match[2])
    if url.scheme or url.netloc or not url.path.endswith(('.css', '.js')):
        return match[0]
    asset = (root / url.path).resolve()
    if not asset.is_relative_to(root) or not asset.is_file():
        raise SystemExit(f'Missing or unsafe asset: {url.path}')
    digest = hashlib.sha256(asset.read_bytes()).hexdigest()[:12]
    return f'{match[1]}="{url.path}?v={digest}"'

page.write_text(re.sub(r'(href|src)="([^"]+)"', version, page.read_text()))
