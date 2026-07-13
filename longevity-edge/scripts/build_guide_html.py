#!/usr/bin/env python3
"""Convert the Longevity Edge guide markdown into a styled, printable HTML file."""
import markdown
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "03-guide" / "guide.md"
OUT = ROOT / "03-guide" / "guide.html"

body = markdown.markdown(
    SRC.read_text(encoding="utf-8"),
    extensions=["tables", "toc", "fenced_code", "sane_lists"],
)

HTML = """<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>The Longevity Edge — The Protocol Playbook</title>
<style>
  :root{{
    --ink:#12201b; --muted:#5a6b63; --jade:#2f6f57; --jade2:#3f8f70;
    --champagne:#b08d4f; --paper:#fbfaf6; --line:#e7e4d9; --wash:#f2f4ef;
  }}
  *{{box-sizing:border-box;}}
  body{{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;
        color:var(--ink); line-height:1.75; margin:0; background:#eceae2;}}
  .serif{{font-family:'Iowan Old Style','Palatino Linotype',Palatino,'Book Antiqua',Georgia,serif;}}
  .page{{max-width:800px; margin:0 auto; background:var(--paper); padding:60px 70px;}}
  .cover{{background:
            radial-gradient(900px 500px at 78% -10%,rgba(63,143,112,.5),transparent 60%),
            linear-gradient(160deg,#0e1a15 0%,#12241c 55%,#0b1712 100%);
          color:#f3f1e8; padding:110px 70px; text-align:center;}}
  .cover .eyebrow{{letter-spacing:4px;text-transform:uppercase;font-size:13px;color:#c9a86a;font-weight:600;}}
  .cover h1{{font-family:'Iowan Old Style','Palatino Linotype',Palatino,Georgia,serif;
             font-size:52px;line-height:1.05;margin:18px 0 14px;letter-spacing:-.5px;}}
  .cover h3{{font-weight:400;opacity:.9;font-size:20px;margin:0 0 34px;}}
  .cover .rule{{width:64px;height:2px;background:#c9a86a;margin:0 auto 30px;}}
  .cover .badge{{display:inline-block;border:1px solid rgba(201,168,106,.5);color:#e7dcc2;
                 padding:9px 20px;border-radius:2px;font-size:13px;letter-spacing:2px;text-transform:uppercase;}}
  h1,h2,h3{{font-family:'Iowan Old Style','Palatino Linotype',Palatino,Georgia,serif;line-height:1.2;}}
  h1{{font-size:30px;margin-top:10px;}}
  h2{{font-size:27px;margin-top:52px;padding-top:26px;border-top:1px solid var(--line);color:var(--jade);}}
  h3{{font-size:20px;color:var(--ink);margin-top:30px;}}
  a{{color:var(--jade);}}
  strong{{color:#0f2019;}}
  blockquote{{background:var(--wash);border-left:3px solid var(--jade);margin:24px 0;
              padding:16px 22px;border-radius:0 6px 6px 0;color:#33453d;}}
  blockquote strong{{color:var(--jade);}}
  /* warning/disclaimer callouts (first blockquote-like) */
  table{{border-collapse:collapse;width:100%;margin:22px 0;font-size:15px;}}
  th,td{{border:1px solid var(--line);padding:11px 13px;text-align:left;vertical-align:top;}}
  th{{background:var(--wash);}}
  code{{background:#eef0ea;padding:2px 6px;border-radius:4px;font-size:14px;}}
  hr{{border:none;border-top:1px solid var(--line);margin:44px 0;}}
  ul,ol{{padding-left:22px;}} li{{margin:7px 0;}}
  @media print{{body{{background:#fff;}} .page{{padding:0;}}}}
  @media (max-width:640px){{.page,.cover{{padding:44px 24px;}} .cover h1{{font-size:36px;}}}}
</style>
</head>
<body>
  <div class="cover">
    <div class="eyebrow">For High Performers</div>
    <h1>The Longevity Edge</h1>
    <div class="rule"></div>
    <h3>The Peak-Performance Operating System</h3>
    <div class="badge">The Protocol Playbook</div>
  </div>
  <div class="page">
    {body}
  </div>
</body>
</html>
""".format(body=body)

OUT.write_text(HTML, encoding="utf-8")
print(f"Wrote {OUT} ({len(HTML):,} bytes)")
