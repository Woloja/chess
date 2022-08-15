module.exports = {
    plugins: ['prettier'],
    extends: ['plugin:prettier/recommended', 'eslint:recommended', 'prettier'],
    ignorePatterns: ['dist', 'public', 'node_modules'],
    env: {
        es6: true,
        node: true,
        browser: true
    },
    parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        parser: 'babel-eslint'
    },
    globals: {
        Swiper: true
    },
    rules: {
        camelcase: 1,
        'prefer-template': 'off',
        'no-var': 1,
        'no-unused-vars': 1,
        'no-nested-ternary': 1,
        'no-console': process.env.NODE_ENV === 'production' ? 2 : 0,
        'no-template-curly-in-string': 1,
        'no-self-compare': 1,
        'import/prefer-default-export': 0,
        'arrow-body-style': 1,
        'import/no-extraneous-dependencies': ['off', { devDependencies: false }],
        'quote-props': ['error', 'as-needed'],
        'comma-dangle': ['error', 'never'],
        'comma-style': ['error', 'last'],
        'array-bracket-newline': ['error', 'consistent'],
        'array-element-newline': ['error', 'consistent'],
        'comma-spacing': [
            'error',
            {
                before: false,
                after: true
            }
        ],
        'max-len': [
            1,
            {
                code: 140,
                tabWidth: 4,
                ignoreComments: true,
                ignoreStrings: true
            }
        ],
        'prettier/prettier': [
            1,
            {
                trailingComma: 'none',
                endOfLine: 'auto',
                quoteProps: 'as-needed',
                semi: true,
                printWidth: 140
            }
        ]
    }
};
