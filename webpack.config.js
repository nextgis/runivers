var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = (env, argv) => {

  const isProd = argv.mode === 'production';

  const config = {
    mode: 'development',

    devtool: isProd ? 'none' : '#eval-source-map',

    entry: {
      // "vendor": ["babel-polyfill", "./common/polyfill.js", "./common/vendor.js",],
      'main': [
        './src/main.ts'
      ],
    },

    // optimization: {
    //   splitChunks: {
    //     // include all types of chunks
    //     chunks: 'all',
    //     minSize: 3000,
    //     maxSize: 20000,
    //   }
    // },

    output: {
      filename: '[name][hash:7].js',
    },

    resolve: {
      extensions: ['.ts', '.json'],
    },

    module: {
      rules: [
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
            {
              loader: 'tslint-loader',
            }
          ]
        },
        // {
        //   enforce: 'pre',
        //   test: /\.js$/,
        //   exclude: /node_modules/,
        //   loader: 'eslint-loader',
        //   options: {
        //     fix: true
        //   }
        // },
        // {
        //   test: /\.js$/,
        //   exclude: /(node_modules|bower_components)/,
        //   use: [{
        //     loader: 'babel-loader',
        //     options: {
        //       cacheDirectory: true,
        //       presets: [
        //         ['@babel/preset-env', { 'useBuiltIns': 'usage' }]
        //       ],
        //       plugins: [
        //         '@babel/plugin-syntax-dynamic-import',
        //         '@babel/plugin-proposal-class-properties',
        //         '@babel/plugin-proposal-object-rest-spread'
        //       ]
        //     }
        //   }]
        // },
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
      new HtmlWebpackPlugin({ template: 'src/index.html' })
    ]
  }

  if (isProd) {
    config.plugins.push(new CompressionPlugin());
  }

  return config;
};
