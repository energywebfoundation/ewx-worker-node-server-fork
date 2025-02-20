module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  ignorePatterns: ['dist/*'],
  extends: ['standard-with-typescript', 'prettier'],
  overrides: [
    {
      files: ['*.ts', '*.tsx', '*.js', '*.jsx'],
      rules: {},
    },
    {
      env: {
        node: true,
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    '@typescript-eslint/semi': [2, 'always'],
  },
};
