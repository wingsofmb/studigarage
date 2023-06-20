module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
  },
  plugins: ['@typescript-eslint', 'eslint-plugin-import', 'eslint-plugin-n', 'html', 'eslint-plugin-promise'],
  extends: ['standard-with-typescript', 'prettier'],
  overrides: [
    {
      files: ['frontend/**/*.ts'],
      env: {
        browser: true,
        es2021: true,
        node: false,
      },
      parserOptions: {
        project: ['frontend/tsconfig.json'],
      },
    },
    {
      files: ['*.spec.ts'],
      env: {
        node: true,
        jasmine: true,
      },
      plugins: ['jasmine'],
      extends: ['standard-with-typescript', 'prettier', 'plugin:jasmine/recommended'],
    },
    {
      files: ['frontend/**/*.html'],
      plugins: ['html'],
      rules: {},
    },
    {
      files: ['backend/**/*'],
      env: {
        browser: false,
        es2021: false,
        node: true,
      },
    },
    {
      files: ['.eslintrc.{js,cjs}'],
      env: {
        node: true,
      },
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {},
};
