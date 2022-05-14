const
  path = require('path'),
  PackageData = require('./package.json'),
  HtmlWebpackPlugin = require('html-webpack-plugin'),
  MiniCssExtractPlugin = require('mini-css-extract-plugin'),
  ESLintWebpackPlugin = require('eslint-webpack-plugin'),
  CopyPlugin = require('copy-webpack-plugin'),
  TerserPlugin = require('terser-webpack-plugin'),
  { DefinePlugin } = require('webpack')

require('dotenv').config({ path: './.env' });

const config = {
  context: path.resolve(__dirname, 'src'),
  resolve: {
    modules: [path.resolve(__dirname, 'node_modules')],
    extensions: ['.js', '.jsx', '.json'],
    alias: {
      '@assets': path.resolve(__dirname, 'src', 'assets'),
      '@components': path.resolve(__dirname, 'src', 'components'),
      '@pages': path.resolve(__dirname, 'src', 'pages'),
      '@services': path.resolve(__dirname, 'src', 'services'),
      '@utils': path.resolve(__dirname, 'src', 'utils'),

      '@routes': path.resolve(__dirname, 'src', 'routes'),
      '@store': path.resolve(__dirname, 'src', 'store'),
      '@api': path.resolve(__dirname, 'src', 'api'),
    }
  },
  entry: {
    'react': 'react',
    'react-dom': {
      import: 'react-dom',
      dependOn: 'react'
    },
    'react-router-dom': {
      import: 'react-router-dom',
      dependOn: ['react', 'react-dom']
    },
    main: {
      import: './index.js',
      dependOn: ['react', 'react-dom', 'react-router-dom']
    }
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.[contenthash].js',
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        include: path.resolve(__dirname, 'src'),
        exclude: path.resolve(__dirname, 'node_modules')
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
      { oneOf: [
          {
            test: /\.svg$/,
            resourceQuery: { not: [/component/] },
            type: 'asset/resource'
          },
          {
            test: /\.svg$/,
            resourceQuery: /component/,
            use: [
              'babel-loader',
              {
                loader: 'react-svg-loader',
                options: {
                  jsx: true,
                },
              }
            ],
          }
        ]
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'public/index.html')
    }),
    new MiniCssExtractPlugin({
      filename: 'bundle.[contenthash].css'
    }),
    new ESLintWebpackPlugin({
      extensions: ['js', 'jsx']
    }),
    new DefinePlugin({
      VM_HOST: JSON.stringify(process.env.VM_HOST),
      BACKEND_PORT: JSON.stringify(process.env.BACKEND_PORT),
      BUILD_NUM: JSON.stringify(process.env.BUILD_NUM) || 0,
      VERSION: JSON.stringify(PackageData.version)
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'public'),
          to: path.resolve(__dirname, 'dist'),
          filter: file => !file.includes('index.html'),
          noErrorOnMissing: true
        }
      ]
    })
  ]
}

module.exports = (env, options) => {
  const
    isProd = options.mode === 'production',
    stylesLoaders = [
      {
        test: /^((?!\.global).)*s[ac]ss$/,
        use: [
          isProd ? MiniCssExtractPlugin.loader : 'style-loader',
          {
            loader: 'css-loader',
            options: {
              sourceMap: !isProd,
              importLoaders: 1,
              modules: {
                localIdentName: '[path][name]__[local]__[hash:base64:8]'
              }
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: !isProd
            }
          }
        ]
      },
      {
        test: /\.global\.s[ac]ss$/,
        use: [isProd ? MiniCssExtractPlugin.loader : 'style-loader', 'css-loader', 'sass-loader']
      }
    ]

  config.mode = options.mode
  config.output.publicPath = env.publicPath ?? '/'
  config.module.rules.push(...stylesLoaders)
  config.plugins.push(new DefinePlugin({
    IS_PROD: isProd
  }))


  if (isProd) {
    config.devtool = false
    config.target = 'browserslist'
    config.performance = {
      maxEntrypointSize: 524288,
      maxAssetSize: 524288
    }
    config.optimization = {
      minimize: true,
      minimizer: [new TerserPlugin({
        parallel: true,
        terserOptions: {
          compress: {
            drop_console: true
          }
        }
      })],
    }
  } else {
    config.devtool = 'eval-cheap-module-source-map'
    config.target = 'web'
    config.devServer = {
      allowedHosts: 'all',
      host: '0.0.0.0',
      port: 2000,
      compress: true,
      historyApiFallback: true,
      hot: true,
      static: {
        publicPath: env.publicPath ?? '/',
      },
      client: {
        logging: 'error',
        overlay: false
      }
    }
    config.performance = {
      hints: 'warning',
      maxEntrypointSize: 10485760,
      maxAssetSize: 10485760
    }
  }

  return config
}
