const path = require('path');
module.exports = {
    root: true,
    extends: [
        'scratch',
        'scratch/es6',
        'scratch/react',
        'plugin:import/errors',
    ],
    env: {
        browser: true,
    },
    globals: {
        process: true,
    },
    rules: {
        'import/no-mutable-exports': 'error',
        'import/no-commonjs': 'error',
        'import/no-amd': 'error',
        'import/no-nodejs-modules': 'error',
        'object-curly-spacing': [2, 'always'],
        'comma-dangle': ['error', 'only-multiline'],
        'space-before-function-paren': 'off',
        'react/jsx-no-bind': 'off',
        'no-confusing-arrow': 'off',
        'react/jsx-max-props-per-line': 'off',
        'operator-linebreak': 'off',
        'no-undefined': 'off',
        indent: 'off',
        'require-jsdoc': 'off',
        'react/jsx-no-literals': 'off',
        'func-style': 'off',
        'react/prop-types': 'off',
        'import/named': 'off',
        'arrow-body-style': 'off',
        'quote-props': 'off',
    },
    settings: {
        react: {
            version: '16.2', // Prevent 16.3 lifecycle method errors
        },
        'import/resolver': {
            webpack: {
                config: path.resolve(__dirname, '../webpack.config.js'),
            },
        },
    },
};
