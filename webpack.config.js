const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  // Entry point to your app
  entry: './src/index.js',

  // Output configuration
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/', // Important for Vercel or when hosted on a subpath
  },

  // Resolve settings for handling file imports
  resolve: {
    fallback: {
      fs: false, // Disable fs module (not needed in browser)
      os: require.resolve('os-browserify/browser'), // Polyfill for os module
      path: require.resolve('path-browserify'), // Polyfill for path module
      stream: require.resolve('stream-browserify'), // Polyfill for stream module
      querystring: require.resolve('querystring-es3'), // Polyfill for querystring module
      https: require.resolve('https-browserify'), // Polyfill for https module
      http: require.resolve('stream-http'), // Polyfill for http module
    },
  },

  // Modules and rules
  module: {
    rules: [
      // Rule for JavaScript files (Babel transpiling)
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
      // Rule for handling CSS files
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },

  // Plugins for HTML generation and others
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html', // Path to your HTML template
    }),
  ],

  // Development server configuration
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
    compress: true,
    port: 3000,
    open: true,
    historyApiFallback: true, // Important for single-page applications
  },

  // Mode (set to 'development' for dev or 'production' for prod)
  mode: 'development',
  devtool: 'source-map', // Optional, useful for debugging

  // For production build optimizations
  optimization: {
    minimize: true, // Minimize the output for production
  },

  // Environment variables (for Vercel or any environment)
  node: {
    global: true, // Ensure global is available for modules that expect it
    __dirname: false, // Disable automatic __dirname handling, can be problematic with Vercel
  },
};
