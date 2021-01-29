module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ['plugin:vue/essential', '@vue/typescript', 'prettier', '@vue/prettier'],
  plugins: ['@typescript-eslint', 'prettier'],
  parserOptions: {
    parser: '@typescript-eslint/parser',
    // parser: 'babel-eslint',
  },
};
