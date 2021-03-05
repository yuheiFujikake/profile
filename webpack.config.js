const { glob } = require('glob');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const environment = process.env.NODE_ENV || 'development';
const src = __dirname + "/src";
const dist = __dirname + "/docs";
const isDevMode = environment === "development";
let plugins = [];

function getHtmlPath() {
  const path = './src/view/';
  const pattern = `${path}**/*.html`;
  const options = {
    ignore: [ `${path}**/_*.html` ]
  }
  let output = [];
  glob.sync(pattern, options).forEach((filePath) => {
    let fileName = filePath.replace(path, "");
    output.push(fileName);
  });

  return output;
}


getHtmlPath().forEach((filename) => {
  plugins.push(new HtmlWebpackPlugin({
    template: `view/${filename}`,
    filename: filename
  }));
});

plugins.push(new webpack.ProvidePlugin({ $: 'jquery' }));

module.exports = {
  context: src,
  mode: environment,
  watchOptions: {
    ignored: "node_modules/**",
  },
  entry: "./js/main.js",
  output: {
    path: dist,
    filename: "index.js"
  },
  devServer: {
    contentBase: dist,
    open: true,
    host: '0.0.0.0',
    overlay: true,
    useLocalIp: true,
    quiet: true
  },
  module: {
    rules: [
      /****** JavaScript Loader ******/
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: /node_modules/,
        options: {
          presets: [
            '@babel/preset-env',
          ]
        }
      },
      /****** SCSS Loader ******/
      {
        test: /\.scss$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              url: false,
              sourceMap: isDevMode,
              importLoaders: 2
            }
          },
          {
            loader: "postcss-loader",
            options: {
              sourceMap: isDevMode,
              postcssOptions: {
                plugins: [
                  ["autoprefixer", { grid: true }]
                ]
              }
            }
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: isDevMode
            }
          },
          "import-glob-loader"
        ]

      }
    ],
  },
  plugins: plugins
};
