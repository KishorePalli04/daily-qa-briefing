import type {
  Reporter, TestCase, TestResult, FullConfig, Suite, FullResult,
} from '@playwright/test/reporter';

/**
 * BriefingReporter — custom Playwright reporter.
 *
 * Demonstrates how to hook into Playwright's lifecycle:
 *  onBegin → onTestBegin → onTestEnd → onEnd
 *
 * In interviews, mention this shows you can build custom tooling
 * beyond the built-in reporters (HTML, JUnit, etc.)
 */
class BriefingReporter implements Reporter {
  private startTime: number = 0;
  private passed = 0;
  private failed = 0;
  private skipped = 0;

  onBegin(config: FullConfig, suite: Suite): void {
    this.startTime = Date.now();
    console.log(`\n📋 [BriefingReporter] Starting run with ${suite.allTests().length} tests`);
  }

  onTestBegin(test: TestCase): void {
    console.log(`  ▶ ${test.title}`);
  }

  onTestEnd(test: TestCase, result: TestResult): void {
    const icon   = result.status === 'passed'  ? '✅'
                 : result.status === 'failed'  ? '❌'
                 : result.status === 'skipped' ? '⏭️'
                 : '⚠️';

    const dur = `${(result.duration / 1000).toFixed(1)}s`;

    console.log(`  ${icon} ${test.title} (${dur})`);

    if (result.status === 'passed')  this.passed++;
    if (result.status === 'failed')  this.failed++;
    if (result.status === 'skipped') this.skipped++;

    // Print errors inline for fast debugging
    if (result.status === 'failed' && result.error) {
      console.log(`     Error: ${result.error.message}`);
    }
  }

  onEnd(result: FullResult): void {
    const duration = ((Date.now() - this.startTime) / 1000).toFixed(1);
    const total    = this.passed + this.failed + this.skipped;

    console.log(`\n${'─'.repeat(50)}`);
    console.log(`📊 [BriefingReporter] Summary`);
    console.log(`   Total   : ${total}`);
    console.log(`   ✅ Passed : ${this.passed}`);
    console.log(`   ❌ Failed : ${this.failed}`);
    console.log(`   ⏭️ Skipped: ${this.skipped}`);
    console.log(`   ⏱️ Duration: ${duration}s`);
    console.log(`   Status  : ${result.status.toUpperCase()}`);
    console.log(`${'─'.repeat(50)}\n`);
  }
}

export default BriefingReporter;
