#!/usr/bin/env node
const sodium = require('libsodium-wrappers');
const readline = require('readline');

function ask(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(resolve => rl.question(question, ans => { rl.close(); resolve(ans); }));
}

async function getInputOrEnv(name, prompt) {
  if (process.env[name]) return process.env[name];
  const v = await ask(`${prompt}: `);
  return v.trim();
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.error('Usage: node set-secrets.js <owner> <repo>');
    process.exit(1);
  }
  const owner = args[0];
  const repo = args[1];

  const token = process.env.GITHUB_TOKEN || await getInputOrEnv('GITHUB_TOKEN', 'Enter GitHub PAT (with repo:public_repo or repo scope) (visible)');
  if (!token) { console.error('No GitHub token provided'); process.exit(1); }

  const secrets = {};
  secrets.SENDGRID_API_KEY = await getInputOrEnv('SENDGRID_API_KEY', 'Enter SENDGRID_API_KEY');
  secrets.SENDGRID_FROM = await getInputOrEnv('SENDGRID_FROM', 'Enter SENDGRID_FROM (verified sender)');
  secrets.EMAIL_TO = await getInputOrEnv('EMAIL_TO', 'Enter EMAIL_TO');

  const headers = { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'User-Agent': 'set-secrets-script' };

  // Get public key
  const pkResp = await fetch(`https://api.github.com/repos/${owner}/${repo}/actions/secrets/public-key`, { headers });
  if (!pkResp.ok) {
    console.error('Failed to get public key:', pkResp.status, await pkResp.text());
    process.exit(1);
  }
  const pk = await pkResp.json();
  const publicKey = pk.key;
  const keyId = pk.key_id;

  for (const [name, value] of Object.entries(secrets)) {
    if (!value) { console.log(`Skipping empty secret ${name}`); continue; }
    // Convert the message and public key to Uint8Array's (Buffer implements that)
    const messageBytes = Buffer.from(value);
    const keyBytes = Buffer.from(publicKey, 'base64');

    // Encrypt using libsodium's crypto_box_seal
    await sodium.ready;
    const encryptedBytes = sodium.crypto_box_seal(new Uint8Array(messageBytes), new Uint8Array(keyBytes));
    const encrypted = Buffer.from(encryptedBytes).toString('base64');

    const putResp = await fetch(`https://api.github.com/repos/${owner}/${repo}/actions/secrets/${name}`, {
      method: 'PUT',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ encrypted_value: encrypted, key_id: keyId })
    });

    if (!putResp.ok) {
      console.error(`Failed to set secret ${name}:`, putResp.status, await putResp.text());
    } else {
      console.log(`Set secret ${name}`);
    }
  }
}

main().catch(err => { console.error(err); process.exit(1); });
