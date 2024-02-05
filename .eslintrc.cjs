module.exports = {
    root: true,
    env: {
        es2022: true,
        browser: true,
        node: true
    },
    extends: [
        'eslint:recommended',
        'plugin:jest/recommended',
    ],
    parserOptions: {
        sourceType: 'module'
    },
    plugins: ['jest'],
    rules: {
        'no-var': 'error',
        'quotes': [
            'error',
            'single'
        ],
        'semi': [
            'error',
            'always'
        ],
        'indent': 'error',
        'no-multi-spaces': 'error',
        'space-in-parens': 'error',
        'no-multiple-empty-lines': 'error',
        'prefer-const': 'error',
        'no-use-before-define': 'error',
        'react/prop-types': 'off',
        'no-unused-vars': 'off',
        'no-unused-labels': 'off'
    },
    overrides: [
        {
            files: ['**/*.cjs', '**/*.test.js'],
            env: {
                node: true,
                jest: true,
            },
        },
    ],
};