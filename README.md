# angular-shopping-cart-orchestrator

A Playwright-based test orchestrator for end-to-end testing of Angular shopping cart applications.

## Overview

This project provides a comprehensive testing framework using Playwright to automate and orchestrate tests across the Angular shopping cart platform. It enables reliable, scalable test automation with support for multiple browsers and devices.

## Features

- **Cross-browser testing**: Chrome, Firefox, Safari, and Edge support
- **Multi-device testing**: Desktop, tablet, and mobile viewport configurations
- **Parallel execution**: Run tests simultaneously for faster feedback
- **Detailed reporting**: HTML reports with screenshots and traces
- **Reusable test components**: Page Object Model patterns for maintainability
- **CI/CD integration**: Easy integration with GitHub Actions, Jenkins, and other CI systems

## Prerequisites

- Node.js 16+
- npm or yarn
- Playwright browser binaries

## Installation

```bash
npm install
npx playwright install
```

## Running Tests

Run all tests:
```bash
npm test
```

Run specific test file:
```bash
npx playwright test tests/shopping-cart.spec.ts
```

Run in headed mode:
```bash
npx playwright test --headed
```

Generate test report:
```bash
npx playwright test && npx playwright show-report
```

## Project Structure

```
├── tests/
│   ├── pages/          # Page object models
│   ├── fixtures/       # Test fixtures and helpers
│   └── specs/          # Test specifications
├── playwright.config.ts
└── README.md
```

## Configuration

Edit `playwright.config.ts` to customize:
- Browser configurations
- Test timeouts
- Retry policies
- Report outputs

## Contributing

Contributions are welcome. Please ensure all tests pass before submitting pull requests.

## License

MIT

