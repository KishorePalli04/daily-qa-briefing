# MCP server for Daily QA Briefing

This minimal MCP server exposes a manifest and a single endpoint to download the workspace as a zip. Use it to fetch the workspace and then push it to GitHub.

Install and run:

```bash
cd mcp-server
npm install
npm start
```

Download the workspace zip:

```bash
curl -o workspace.zip http://localhost:5174/download
unzip workspace.zip -d workspace-copy
```

Create a GitHub repo and push (using GitHub CLI):

```bash
cd workspace-copy
gh repo create my-daily-qa-briefing --public --source=. --remote=origin --push
```

If you prefer manual git flow:

```bash
cd workspace-copy
git init
git add .
git commit -m "Initial import from MCP server"
gh repo create my-daily-qa-briefing --public
git remote add origin https://github.com/<your-username>/my-daily-qa-briefing.git
git push -u origin main
```

If you want, I can help implement an authenticated upload endpoint that uses a GitHub token to create a repo and push files programmatically.
