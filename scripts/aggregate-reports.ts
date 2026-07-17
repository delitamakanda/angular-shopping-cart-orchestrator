import { readFile, writeFile, access, mkdir } from 'fs/promises';
import type { CommandOptions } from './run-command';

interface ReportStats {
    expected: number;
    unexpected: number;
    skipped: number;
    flaky: number;
    duration: number;
}

interface Report {
    stats: ReportStats;
}

async function fileExists(filePath: string): Promise<boolean> {
    try {
        await access(filePath);
        return true;
    } catch {
        return false;
    }
}

async function readJson<T>(filePath: string): Promise<T | null> {
    if (!(await fileExists(filePath))) {
        return null
    }
    const content = await readFile(filePath, 'utf-8');
    return JSON.parse(content) as T;
}

export async function aggregateReports(results: CommandOptions[]) {
  await mkdir('reports', { recursive: true });

  const executionResults = results ?? (await readJson<CommandOptions[]>('reports/execution-results.json')) ?? [];

  const playwrightReport = await readJson<Report>('reports/playwright.json');

  const generatedAt = new Date().toISOString();

  const report = {
    generatedAt,
    targetEnvironment: process.env.TARGET_ENVIRONMENT ?? 'prd',
    baseUrl: process.env.BASE_URL ?? 'https://www.example.com',
    status: executionResults.every(result => result.succeeded) ? 'success' : 'failure',
    results: executionResults,
    playwrightReport: playwrightReport ? {
        passed: playwrightReport.stats.expected,
        failed: playwrightReport.stats.unexpected,
        skipped: playwrightReport.stats.skipped,
        flaky: playwrightReport.stats.flaky,
        duration: playwrightReport.stats.duration,
    } : null,
  };
  await writeFile('reports/quality-report.json', JSON.stringify(report, null, 2));

  const markdownReport = [
    '# Quality Report',
    '',
    `**Status:** ${report.status === 'success' ? '✅ Success' : '❌ Failure'}`,
    `**Generated At:** ${generatedAt}`,
    `**Target Environment:** ${report.targetEnvironment}`,
    `**Base URL:** ${report.baseUrl ?? 'N/A'}`,
    '',
    '## Test Results',
    '',
    '| Control | Status | Duration (ms) |',
    '|---------|--------|----------------|',
    ...report.results.map(result => `| ${result.name} | ${result.succeeded ? '✅ Passed' : '❌ Failed'} | ${result.duration ?? 'N/A'} |`),
    '',
    '## Playwright Report',
    '',
    report.playwrightReport ? [
        `**Passed:** ${report.playwrightReport.passed}`,
        `**Failed:** ${report.playwrightReport.failed}`,
        `**Skipped:** ${report.playwrightReport.skipped}`,
        `**Flaky:** ${report.playwrightReport.flaky}`,
        `**Duration:** ${report.playwrightReport.duration} ms`,
    ].join('\n') : 'No Playwright report available.',
    '',
    '## Summary',
    '',
    `Total Controls: ${report.results.length}`,
    `Passed: ${report.results.filter(result => result.succeeded).length}`,
    `Failed: ${report.results.filter(result => !result.succeeded).length}`,
    `Skipped: ${report.playwrightReport?.skipped ?? 'N/A'}`,
    `Flaky: ${report.playwrightReport?.flaky ?? 'N/A'}`,
    `Total Duration: ${report.playwrightReport?.duration ?? 'N/A'} ms`,
  ].join('\n');

  await writeFile('reports/quality-report.md', markdownReport);

  console.log(markdownReport);
}

if (process.argv[1]?.endsWith('aggregate-reports.ts')) {
  aggregateReports([]).catch(error => {
    console.error('Error aggregating reports:', error);
    process.exitCode = 1;
  });
}