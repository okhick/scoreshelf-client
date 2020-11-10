module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ['plugin:vue/essential', 'prettier', '@vue/prettier'],
  plugins: ['prettier'],
  parserOptions: {
    parser: 'babel-eslint',
  },
};
