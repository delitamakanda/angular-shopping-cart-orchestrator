# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

This is **not** the Angular shopping cart application itself — it's a standalone **quality/QA orchestration harness** that runs black-box tests against a deployed instance of that app (Playwright E2E/API/accessibility tests + Lighthouse CI performance audits), then aggregates the results into a single pass/fail report. There is no application source code here, only test suites, orchestration scripts, and config.

## Commands

```bash
npm run quality            # full orchestrated run: e2e (+ api/a11y/lighthouse if enabled) -> aggregated report
npm run quality:e2e        # tests/e2e only
npm run quality:api        # tests/api only
npm run quality:a11y       # tests/accessibility only
npm run quality:lighthouse # lhci autorun (uses .lighthouserc.cjs)
npm run quality:report     # regenerate reports/quality-report.{json,md} from existing reports/execution-results.json
npm run quality:headed     # playwright test --headed
npm run quality:debug      # playwright test --debug
npm run report:playwright  # open the HTML report at reports/playwright-html
npm run e2e:install        # install Playwright browsers (local)
npm run e2e:install:ci     # install chromium + OS deps (CI)
```

Run a single test file or test by name directly with Playwright (bypasses the orchestrator):

```bash
npx playwright test tests/e2e/product-search.spec.ts
npx playwright test tests/api/products.spec.ts -g "returns a specific product"
```

There is no unit test runner — `npm test` is an unfilled placeholder.

## Configuration

- Copy `.env.example` to `.env` before running anything. Key vars: `TARGET_ENV`, `BASE_URL`, `API_URL`, `E2E_USERNAME`/`E2E_PASSWORD`, and the three feature flags below.
- `NODE_ENV` (`development` | `production`) selects between the two environments defined in [config/environments.ts](config/environments.ts). `development` hardcodes `localhost:3000`; `production` reads `BASE_URL`/`API_URL` from `.env`.
- Feature flags gate which suites `scripts/orchestrate.ts` runs beyond the always-on E2E suite: `API_TESTS_ENABLED`, `ACCESSIBILITY_ENABLED`, `LIGHTHOUSE_ENABLED` (each `'true'`/unset).
- `.lighthouserc.cjs` reads `BASE_URL` directly (not through `config/environments.ts`) and audits `${BASE_URL}` and `${BASE_URL}products`.

## Architecture

The orchestration flow (`npm run quality`) is: **[scripts/orchestrate.ts](scripts/orchestrate.ts)** → for each enabled suite, **[scripts/run-command.ts](scripts/run-command.ts)** spawns it as a child process and records `{name, command, exitCode, duration, succeeded}` → results are written to `reports/execution-results.json` → **[scripts/aggregate-reports.ts](scripts/aggregate-reports.ts)** merges those results with Playwright's own `reports/playwright.json` stats into `reports/quality-report.json` and a human-readable `reports/quality-report.md`. The orchestrator exits non-zero if any suite failed.

`aggregate-reports.ts` is also runnable standalone (`npm run quality:report`) — when invoked directly it falls back to reading `reports/execution-results.json` from disk instead of receiving results in-process, so it can regenerate the markdown/json report after the fact without re-running tests.

[playwright.config.ts](playwright.config.ts) is shared by all three Playwright suites (`tests/e2e`, `tests/api`, `tests/accessibility`) — it resolves `baseURL` via `config/environments.ts` using `NODE_ENV`, runs a single `chromium` project, and always emits list/html/json/junit reporters into `reports/`. Note that some existing specs (e.g. `tests/e2e/product-search.spec.ts`) navigate to a hardcoded URL rather than using `baseURL`-relative paths; prefer relative paths (`page.goto('/products')`, as in the accessibility spec) for new tests so they respect the environment config.

All test output — Playwright reports, Lighthouse results, and the aggregated quality report — is written under `reports/` and `.lighthouseci/`, both gitignored except for `reports/.gitkeep`.
