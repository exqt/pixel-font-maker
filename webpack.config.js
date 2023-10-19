const path = require('path');
const mode = process.env.NODE_ENV || 'development';
const prod = mode === 'production';
const { GitRevisionPlugin } = require('git-revision-webpack-plugin')
const gitRevisionPlugin = new GitRevisionPlugin()
const DefinePlugin = require('webpack').DefinePlugin;
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = (env, options) => {
  const prod = options.mode == 'production';

  return {
    entry: './src/index.tsx',
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist/build')
    },
    devtool: prod ? false : "eval-source-map",
    devServer: {
      contentBase: path.resolve(__dirname, 'dist'),
      writeToDisk: true,
      disableHostCheck: true,
      host: "0.0.0.0",
      port: 8000
    },
    resolve: {
      modules: [__dirname, 'src', 'node_modules'],
      extensions: ['*', '.js', '.jsx', '.tsx', '.ts'],
    },
    plugins: [
      new DefinePlugin({
        'VERSION': JSON.stringify(gitRevisionPlugin.version()),
        'COMMITHASH': JSON.stringify(gitRevisionPlugin.commithash()),
        'BRANCH': JSON.stringify(gitRevisionPlugin.branch()),
      }),
      /*
        new BundleAnalyzerPlugin({
          analyzerMode: "static",
        })
      */
    ],
    module: {
      rules: [
        {
          test: /\.tsx?$/i,
          exclude: /node_modules/,
          use: 'ts-loader'
        },
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader']
        },
        {
          test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name].[ext]',
                outputPath: 'fonts/'
              }
            }
          ]
        },
        {
          test: /\.(png|jpe?g|gif)$/i,
          use: [
            {
              loader: 'file-loader',
            },
          ],
        }
      ]
    },
  }
}
