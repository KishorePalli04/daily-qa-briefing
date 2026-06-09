import * as fs from 'fs';

/**
 * globalSetup — runs ONCE before the entire test suite.
 * Use it to: create directories, seed data, authenticate, etc.
 */
export default async function globalSetup(): Promise<void> {
  console.log('\n🚀 [Global Setup] Starting Daily QA Briefing run...');

  // Ensure output directories exist
  const dirs = ['test-results', 'test-results/screenshots', 'test-results/reports'];
  dirs.forEach(dir => fs.mkdirSync(dir, { recursive: true }));

  // Log run metadata
  const runMeta = {
    startedAt : new Date().toISOString(),
    timezone  : 'Australia/Sydney',
    runner    : process.env.GITHUB_ACTIONS ? 'GitHub Actions' : 'Local',
  };

  fs.writeFileSync(
    'test-results/run-meta.json',
    JSON.stringify(runMeta, null, 2)
  );

  console.log(`✅ [Global Setup] Run metadata written:`, runMeta);
}
