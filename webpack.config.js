const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

const { baseUrl } = require('./config.json');

let alias = {};
try {
  const { getAliases } = require('./@nextgis/scripts/aliases');
  alias = getAliases();
} catch (er) {
  // ignore
}

module.exports = (env, argv) => {
  const isProd = argv.mode === 'production';

  const plugins = [
    new CopyPlugin({ patterns: [{ from: 'font', to: 'font' }] }),
    new FaviconsWebpackPlugin('./src/img/favicon.png'),
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      // favicon: 'src/images/favicon.ico',
    }),
    new ForkTsCheckerWebpackPlugin({
      async: false,
    }),
    new ESLintPlugin({
      extensions: ['js', 'jsx', 'ts', 'tsx'],
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(argv.mode || 'development'),
      __BROWSER__: true,
      __DEV__: !isProd,
    }),
  ];

  if (isProd) {
    plugins.push(
      ...[
        // new BundleAnalyzerPlugin(),
        new MiniCssExtractPlugin(),
        new CompressionPlugin(),
      ],
    );
  }

  const config = {
    mode: 'development',

    devtool: isProd ? 'source-map' : 'inline-source-map',

    entry: {
      main: ['./src/main.ts'],
    },

    output: {
      filename: '[name][hash:7].js',
      publicPath: '/',
    },

    resolve: {
      modules: [path.resolve(__dirname, 'node_modules')],
      extensions: ['.js', '.ts', '.json'],
      alias,
    },

    module: {
      rules: [
        {
          test: /\.(ts|js)x?$/i,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
          },
        },
        {
          test: /\.css$/i,
          use: [
            isProd ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader',
          ],
        },
        {
          test: /\.(scss)$/,
          use: [
            isProd ? MiniCssExtractPlugin.loader : 'style-loader',
            {
              loader: 'css-loader',
              options: { sourceMap: true }, // translates CSS into CommonJS modules
            },
            {
              loader: 'postcss-loader', // Run post css actions
              options: {
                sourceMap: true,
                postcssOptions: {
                  plugins: function () {
                    // post css plugins, can be exported to postcss.config.js
                    return [require('precss'), require('autoprefixer')];
                  },
                },
              },
            },
            {
              loader: 'sass-loader', // compiles Sass to CSS
              options: { sourceMap: true },
            },
          ],
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: 'asset/resource',
        },

        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: 'asset/resource',
        },
        {
          test: /\.csv$/,
          loader: 'csv-loader',
          options: {
            dynamicTyping: true,
            header: true,
            skipEmptyLines: true,
          },
        },
      ],
    },

    plugins,

    devServer: {
      historyApiFallback: true,
      open: true,
      hot: true,
      proxy: {
        '/api': {
          target: baseUrl,
        },
      },
    },

    optimization: {
      runtimeChunk: 'single',
      splitChunks: {
        chunks: 'all',
        minSize: 10000,
        maxSize: 250000,
      },
    },
  };

  return config;
};
