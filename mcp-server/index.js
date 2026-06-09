const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const archiver = require('archiver');
const manifest = require('./manifest.json');

const app = express();
app.use(cors());

app.get('/manifest', (req, res) => {
  res.json(manifest);
});

// Download a zip of the workspace (one level up from mcp-server)
app.get('/download', (req, res) => {
  const repoPath = path.resolve(__dirname, '..');
  if (!fs.existsSync(repoPath)) return res.status(500).send('Repo path not found');

  res.setHeader('Content-Type', 'application/zip');
  res.setHeader('Content-Disposition', 'attachment; filename="workspace.zip"');

  const archive = archiver('zip', { zlib: { level: 9 } });
  archive.on('error', err => res.status(500).send({ error: err.message }));
  archive.directory(repoPath, false);
  archive.pipe(res);
  archive.finalize();
});

const port = process.env.PORT || 5174;
app.listen(port, () => console.log(`MCP server running on http://localhost:${port}`));
