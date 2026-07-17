import 'dotenv/config';
import { mkdir, writeFile } from 'node:fs/promises';
import { runCommand, type CommandOptions } from './run-command';
import { aggregateReports } from './aggregate-reports';

async function main(): Promise<void> {
    await mkdir('reports', { recursive: true });

    const results: CommandOptions[] = [];

    results.push(
        await runCommand(
            'Tests E2E',
            'npx',
            [
                'playwright',
                'test',
                'tests/e2e',
                '--project=chromium',
            ]
        )
    );

    if (process.env.API_TESTS_ENABLED === 'true') {
        results.push(
            await runCommand(
                'Tests API',
                'npx',
                [
                    'playwright',
                    'test',
                    'tests/api',
                    '--project=chromium',
                ]
            )
        );
    }

    if (process.env.ACCESSIBILITY_ENABLED === 'true') {
        results.push(
            await runCommand(
                'Tests Accessibility',
                'npx',
                [
                    'playwright',
                    'test',
                    'tests/accessibility',
                    '--project=chromium',
                ]
            )
        );
    }

    if (process.env.LIGHTHOUSE_ENABLED === 'true') {
        results.push(
            await runCommand(
                'Tests Lighthouse',
                'npx',
                ['lhci', 'autorun'],
            )
        );
    }

    await writeFile('reports/execution-results.json', JSON.stringify(results, null, 2));

    await aggregateReports(results);

    const failedTests = results.filter(result => !result.succeeded);

    if (failedTests.length > 0) {
        console.error(
            `\n${failedTests.length} test(s) failed:\n` +
            failedTests.map(test => `- ${test.name} (Exit Code: ${test.exitCode}, Duration: ${test.duration}ms)`).join('\n')
        );
        process.exitCode = 1;
        return;
    } else {
        console.log('\nAll tests passed successfully!');
    }
}

main().catch(error => {
    console.error('An error occurred during test execution:', error);
    process.exitCode = 1;
});