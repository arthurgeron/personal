import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from '@rspack/cli';
import { rspack } from '@rspack/core';

const targets = ['chrome >= 87', 'edge >= 88', 'firefox >= 78', 'safari >= 14'];
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  context: __dirname,
  entry: {
    main: './src/index.tsx',
  },
  resolve: {
    extensions: ['...', '.tsx', '.ts', '.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.svg$/,
        type: 'asset',
      },
      {
        test: /\.(png|jpe?g|gif|webp)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.module\.css$/,
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
        type: 'css/module',
      },
      {
        test: /\.css$/,
        exclude: /\.module\.css$/,
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
      {
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
      },
      {
        test: /\.(j|t)sx$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['solid'],
              plugins: ['solid-refresh/babel'],
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new rspack.HtmlRspackPlugin({
      template: './index.html',
      title: 'Arthur Geron - Web3 & React Developer',
    }),
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
    historyApiFallback: true,
    hot: true,
  },
  experiments: {
    css: true,
  },
});
