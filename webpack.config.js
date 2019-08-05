var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
let FaviconsWebpackPlugin = require('favicons-webpack-plugin')

let alias = {};
try {
  const { getAliases } = require('./nextgisweb_frontend/build/aliases');
  alias = getAliases();
} catch (er) {
  // ignore
}


module.exports = (env, argv) => {

  const isProd = argv.mode === 'production';

  const config = {
    mode: 'development',

    devtool: isProd ? 'none' : 'inline-source-map',

    entry: {
      'main': [
        './src/main.ts'
      ],
    },

    output: {
      filename: '[name][hash:7].js',
    },

    resolve: {
      extensions: ['.js', '.ts', '.json'],
      alias
    },

    module: {
      rules: [
        {
          test: /\.ts$/,
          enforce: 'pre',
          use: [
            {
              loader: 'eslint-loader',
              options: { fix: true }
            }
          ]
        },
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'ts-loader',
              options: {
                // disable type checker - we will use it in fork plugin
                transpileOnly: true,
              }
            },
          ]
        },
        {
          test: /\.css$/,
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [{ loader: 'css-loader', options: { sourceMap: true } }],
            publicPath: './',
          })
        },
        {
          test: /\.(scss)$/,
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            publicPath: './',
            use: [
              {
                loader: 'css-loader', options: { sourceMap: true }// translates CSS into CommonJS modules
              },
              {
                loader: 'postcss-loader', // Run post css actions
                options: {
                  sourceMap: true,
                  plugins: function () { // post css plugins, can be exported to postcss.config.js
                    return [
                      require('precss'),
                      require('autoprefixer'),
                    ];
                  }
                }
              },
              {
                loader: 'sass-loader', // compiles Sass to CSS
                options: { sourceMap: true }
              }
            ]
          })
        },
        {
          test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
          use: ['url-loader?limit=10000&mimetype=application/font-woff&name=fonts/[name]-[hash:7].[ext]']
        },
        {
          test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
          use: ['url-loader?limit=10000&mimetype=application/octet-stream&name=fonts/[name]-[hash:7].[ext]']
        },
        { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, use: ['file-loader?name=fonts/[name]-[hash:7].[ext]'] },
        {
          test: /\.(jpe?g|png|gif|svg)$/i,
          use: [
            'file-loader?name=images/[name].[ext]',
            'image-webpack-loader?bypassOnDebug'
          ]
        },
        {
          test: /\.csv$/,
          loader: 'csv-loader',
          options: {
            dynamicTyping: true,
            header: true,
            skipEmptyLines: true
          }
        }
      ]
    },

    plugins: [
      new ForkTsCheckerWebpackPlugin({ vue: true }),
      new ExtractTextPlugin({ filename: '[name][hash:7].css', allChunks: true }),
      new HtmlWebpackPlugin({ template: 'src/index.html' }),
      new FaviconsWebpackPlugin('./src/img/favicon.png')
    ],

    optimization: {
      runtimeChunk: 'single',
      splitChunks: {
        chunks: 'all',
        maxInitialRequests: Infinity,
        minSize: 0,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name(module) {
              // get the name. E.g. node_modules/packageName/not/this/part.js
              // or node_modules/packageName
              const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];

              // npm package names are URL-safe, but some servers don't like @ symbols
              return `npm.${packageName.replace('@', '')}`;
            },
          },
        },
      },
    },
  }

  return config;
};
