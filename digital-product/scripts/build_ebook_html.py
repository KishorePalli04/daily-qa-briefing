#!/usr/bin/env python3
"""Convert the ebook markdown into a styled, printable HTML file."""
import markdown
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "03-ebook" / "ebook.md"
OUT = ROOT / "03-ebook" / "ebook.html"

body = markdown.markdown(
    SRC.read_text(encoding="utf-8"),
    extensions=["tables", "toc", "fenced_code", "sane_lists"],
)

HTML = """<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>The AI Freelance Freedom Accelerator — eBook</title>
<style>
  :root {{ --ink:#1a1a2e; --accent:#6C4DF6; --accent2:#00C2A8; --paper:#ffffff; --muted:#5b5b74; }}
  * {{ box-sizing:border-box; }}
  body {{ font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;
         color:var(--ink); line-height:1.7; margin:0; background:#eef0f6; }}
  .page {{ max-width:820px; margin:0 auto; background:var(--paper); padding:64px 72px; }}
  .cover {{ background:linear-gradient(135deg,#6C4DF6,#00C2A8); color:#fff; padding:120px 72px; text-align:center; }}
  .cover h1 {{ font-size:44px; line-height:1.1; margin:0 0 16px; letter-spacing:-.5px; }}
  .cover h3 {{ font-weight:500; opacity:.95; font-size:20px; margin:0 0 40px; }}
  .cover .badge {{ display:inline-block; background:rgba(255,255,255,.18); padding:8px 18px;
                   border-radius:100px; font-size:14px; letter-spacing:1px; text-transform:uppercase; }}
  h1,h2,h3 {{ line-height:1.25; letter-spacing:-.3px; }}
  h1 {{ font-size:30px; margin-top:8px; }}
  h2 {{ font-size:25px; margin-top:48px; padding-top:24px; border-top:2px solid #eee; color:var(--accent); }}
  h3 {{ font-size:19px; color:var(--ink); }}
  a {{ color:var(--accent); }}
  blockquote {{ background:#f4f2ff; border-left:4px solid var(--accent); margin:24px 0;
                padding:14px 20px; border-radius:0 8px 8px 0; color:#3a3a55; }}
  blockquote strong {{ color:var(--accent); }}
  table {{ border-collapse:collapse; width:100%; margin:20px 0; font-size:15px; }}
  th,td {{ border:1px solid #e5e5ee; padding:10px 12px; text-align:left; }}
  th {{ background:#f4f2ff; }}
  code {{ background:#f0f0f6; padding:2px 6px; border-radius:5px; font-size:14px; }}
  hr {{ border:none; border-top:1px solid #e5e5ee; margin:40px 0; }}
  ul,ol {{ padding-left:22px; }}
  li {{ margin:6px 0; }}
  @media print {{ body{{background:#fff;}} .page{{padding:0;}} h2{{page-break-before:auto;}} }}
  @media (max-width:640px) {{ .page,.cover{{padding:40px 22px;}} .cover h1{{font-size:32px;}} }}
</style>
</head>
<body>
  <div class="cover">
    <div class="badge">Australian Freelancers · AI Edition</div>
    <h1>The AI Freelance Freedom Accelerator</h1>
    <h3>The 30-Day System to Land High-Paying Clients Using AI</h3>
    <div class="badge">Companion eBook</div>
  </div>
  <div class="page">
    {body}
  </div>
</body>
</html>
""".format(body=body)

OUT.write_text(HTML, encoding="utf-8")
print(f"Wrote {OUT} ({len(HTML):,} bytes)")
