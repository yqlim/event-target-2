module.exports = {
  '*.ts': () => 'tsc -p tsconfig.json',
  '*.{ts,js}': 'eslint --fix',
  '*.{ts,js,json}': 'prettier --write'
};
