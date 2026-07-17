const baseUrl = process.env.BASE_URL || 'http://localhost:3000';

module.exports = {
    ci: {
        collect: {
            url: [
                `${baseUrl}`,
                `${baseUrl}products`,
            ],
            numberOfRuns: 2,
            settings: {
                chromeFlags: ['--no-sandbox', '--disable-dev-shm-usage'],
                preset: 'desktop',
            }
        },
        assert: {
            assertions: {
                'categories:performance': ['error', { minScore: 0.9 }],
                'categories:accessibility': ['error', { minScore: 0.9 }],
                'categories:best-practices': ['error', { minScore: 0.9 }],
                'categories:seo': ['error', { minScore: 0.9 }],
                'categories:pwa': ['off'],
                'large-contentful-paint': ['warn', { maxNumericValue: 2500 }],
                'cumulative-layout-shift': ['warn', { maxNumericValue: 0.1 }],
            }
        },
        upload: {
            target: 'filesystem',
            outputDir: './reports/lighthouse',
        }
    }
};