import { defineConfig } from 'dumi';
import { webpackConfig } from './src/webpack-config';
import externals from '@sobot/soil-ui/lib/externals';
import theme from '@sobot/soil-ui/lib/theme';

export default defineConfig({
  // outputPath: 'docs-dist',
  // base: '/editor/',
  // publicPath: '/editor/',
  alias: {
    '@': '/src',
  },
  theme: {
    ...theme,
  },
  // externals,
  // ...webpackConfig,
  analyze: {
    analyzerMode: 'server',
    analyzerPort: 9999,
    openAnalyzer: true,
    // generate stats file while ANALYZE_DUMP exist
    generateStatsFile: false,
    statsFilename: 'stats.json',
    logLevel: 'info',
    defaultSizes: 'parsed', // stat  // gzip
  },
});
