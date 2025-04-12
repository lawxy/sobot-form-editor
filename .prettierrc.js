module.exports = {
  pluginSearchDirs: false,
  plugins: [
    // require.resolve('prettier-plugin-organize-imports'),
    require.resolve('prettier-plugin-packagejson'),
  ],
  printWidth: 80,
  proseWrap: 'never',
  singleQuote: true,
  trailingComma: 'all',
  bracketSpacing: true,
  jsxBracketSameLine: false,
  jsxSingleQuote: false,
  arrowParens: 'always',
  // semi: true,
  overrides: [
    {
      files: '*.md',
      options: {
        proseWrap: 'preserve',
      },
    },
  ],
};
