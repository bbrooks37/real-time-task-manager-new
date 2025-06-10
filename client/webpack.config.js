// client/webpack.config.js
const path = require('path');
const webpack = require('webpack');
const Dotenv = require('dotenv-webpack'); // Import dotenv-webpack

module.exports = (env, argv) => {
  const isDevelopment = argv.mode === 'development';

  return {
    // Set the mode based on the command line argument
    mode: isDevelopment ? 'development' : 'production',

    // Entry point of your application
    entry: './src/index.js',

    // Output configuration for bundled files
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist'), // Output to a 'dist' folder
      publicPath: '/', // Ensure public path is set for dev server and historyApiFallback
    },

    // Dev server configuration
    devServer: {
      static: {
        directory: path.join(__dirname, 'public'), // Serve static files from 'public'
      },
      port: 8080, // Frontend will run on port 8080
      open: true, // Open the browser automatically
      hot: true, // Enable Hot Module Replacement
      historyApiFallback: true, // Fallback to index.html for HTML5 History API based routing
      // Corrected: proxy must be an array of objects
      proxy: [
        {
          context: ['/api', '/socket.io'], // Proxy both /api and /socket.io requests
          target: process.env.API_BASE_URL || 'http://localhost:5000', // Target your backend
          secure: false, // For development, if backend uses HTTP
          changeOrigin: true, // Needed for virtual hosts
          ws: true, // Enable proxying of websocket requests for Socket.IO
        },
      ],
    },

    // Module rules for handling different file types
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader', // Use Babel for JS transpilation (if you have .babelrc configured)
            options: {
              presets: ['@babel/preset-env'],
            },
          },
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader', 'postcss-loader'], // For processing CSS and Tailwind
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: 'asset/resource', // For handling images
        },
      ],
    },

    // Plugins for additional functionalities
    plugins: [
      // NEW: Dotenv plugin to load .env files
      new Dotenv({
        path: isDevelopment ? './.env.development' : './.env.production', // Load appropriate .env file
      }),
      // DefinePlugin allows you to create global constants which can be configured at compile time.
      // This is crucial for injecting API_BASE_URL into your client-side JS.
      new webpack.DefinePlugin({
        'process.env.API_BASE_URL': JSON.stringify(isDevelopment ? process.env.API_BASE_URL_DEV : process.env.API_BASE_URL_PROD),
      }),
    ].filter(Boolean), // Filter out any falsey plugins if you have conditional ones

    // Source maps for debugging
    devtool: isDevelopment ? 'eval-source-map' : 'source-map',
  };
};
