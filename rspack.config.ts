import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from '@rspack/cli';
import { rspack } from '@rspack/core';

const targets = ['chrome >= 87', 'edge >= 88', 'firefox >= 78', 'safari >= 14'];
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dev = process.env.NODE_ENV === 'development';
const extensions = ['...', '.tsx', '.ts'];

const typescript = {
  test: /\.ts$/,
  use: [
    {
      loader: 'builtin:swc-loader',
      options: {
        jsc: {
          parser: {
            syntax: 'typescript',
          },
        },
        env: { targets },
      },
    },
  ],
};

const solid = (options: object, plugins: string[] = []) => ({
  test: /\.tsx$/,
  use: [
    {
      loader: 'babel-loader',
      options: {
        babelrc: false,
        presets: [
          ['solid', options],
          ['@babel/preset-typescript', { onlyRemoveTypeImports: true }],
        ],
        plugins,
      },
    },
  ],
});

const client = defineConfig({
  name: 'client',
  context: __dirname,
  entry: {
    main: './src/index.tsx',
  },
  output: {
    clean: true,
  },
  resolve: {
    extensions,
    // jsPDF imports these lazily for HTML and SVG rendering, which the CV does not use
    alias: { html2canvas: false, dompurify: false, canvg: false },
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                config: path.resolve(__dirname, './postcss.config.js'),
              },
            },
          },
        ],
        type: 'css',
      },
      {
        test: /\.js$/,
        use: [
          {
            loader: 'builtin:swc-loader',
            options: {
              jsc: {
                parser: {
                  syntax: 'ecmascript',
                },
              },
              env: { targets },
            },
          },
        ],
      },
      typescript,
      solid({ hydratable: true }, dev ? ['solid-refresh/babel'] : []),
    ],
  },
  plugins: [
    new rspack.HtmlRspackPlugin({ template: './index.html' }),
    new rspack.CopyRspackPlugin({ patterns: [{ from: 'public' }] }),
  ],
  optimization: {
    minimizer: [
      new rspack.SwcJsMinimizerRspackPlugin(),
      new rspack.LightningCssMinimizerRspackPlugin({
        minimizerOptions: { targets },
      }),
    ],
    splitChunks: {
      chunks: 'all',
    },
  },
  devServer: {
    port: 3030,
    hot: true,
  },
  experiments: {
    css: true,
  },
});

// renders the page to a string at build time, which scripts/prerender.ts writes into dist/index.html
const prerender = defineConfig({
  name: 'prerender',
  context: __dirname,
  target: 'node',
  entry: {
    server: './src/entry-server.tsx',
  },
  output: {
    path: path.resolve(__dirname, '.ssr'),
    filename: '[name].cjs',
    library: { type: 'commonjs2' },
    clean: true,
  },
  resolve: { extensions },
  externals: ['react', 'react-dom', 'react-dom/client', 'jspdf'],
  module: {
    rules: [typescript, solid({ generate: 'ssr', hydratable: true })],
  },
  optimization: {
    minimize: false,
  },
});

export default [client, prerender];
