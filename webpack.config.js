const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const dotenv = require("dotenv").config({ path: __dirname + "/.env" });
var webpack = require("webpack");
const yourWebsiteLinkHere = "./";
const devMode = process.env.NODE_ENV === JSON.stringify(process.env.NODE_ENV);
const isDevelopment = process.env.NODE_ENV !== "production";

const host = `http://localhost`;
const port = 8800;

const publicPath = devMode ? `${host}:${port}/` : yourWebsiteLinkHere;
const outputDir = "dist";

module.exports = {
  devServer: {
    port,
    static: {
      directory: path.join(__dirname, "public"),
    },
    compress: false,
    allowedHosts: "all",
  },
  context: path.resolve(__dirname),
  devtool: devMode ? "source-map" : false,
  entry: {
    app: "./src/app.js",
  },
  output: {
    filename: "./assets/js/" + (devMode ? "[name].js" : "[name].bundle.js"),
    path: path.join(__dirname, outputDir),
  },
  module: {
    rules: [
      // {
      //     test: /\.(pdf|gif|png|jpe?g|svg)$/i,
      //     loader: 'image-webpack-loader',
      //     enforce: 'pre',
      //     options: {
      //         disable: devMode,
      //         mozjpeg: {
      //             progressive: true,
      //             quality: 65
      //         },
      //         optipng: {
      //             enabled: true,
      //         },
      //         pngquant: {
      //             quality: [0.65, 0.90],
      //             speed: 4
      //         },
      //         gifsicle: {
      //             interlaced: false,
      //         },
      //     },
      // },
      {
        test: /\.(eot|ttf|woff|woff2)$/,
        loader: "url-loader",
        options: {
          name: "fonts/[name].[ext]",
          outputPath: "./assets/",
          limit: false,
        },
      },
      {
        test: /\.(pdf|png|jpeg|jpg|gif)$/,
        loader: "url-loader",
        options: {
          name: "images/[name].[ext]",
          outputPath: "./assets/",
          limit: 1024,
          esModule: false,
        },
      },
      {
        test: /\.svg$/,
        loader: "svg-url-loader",
        options: {
          name(file) {
            if (/fonts/.test(file)) {
              return "fonts/[name].[ext]";
            }
            return "vectors/[name].[ext]";
          },
          context: "src",
          outputPath: "./assets/",
          limit: 2 * 1024, //2KB
          noquotes: true,
        },
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              esModule: false,
            },
          },
          {
            loader: "css-loader",
            options: {
              esModule: false,
            },
          },
          {
            loader: "postcss-loader",
          },
          {
            loader: "sass-loader",
            options: {
              sassOptions: {
                includePaths: [
                  "./node_modules",
                  path.join(__dirname, "src", "images"),
                ],
              },
            },
          },
        ],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.(pug|jade)$/,
        use: [
          {
            loader: "pug-loader",
            options: {
              pretty: true,
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: [
      ".js",
      ".pug",
      ".jade",
      ".scss",
      ".sass",
      ".css",
      ".eot",
      ".ttf",
      ".woff",
      ".woff2",
      ".jpg",
      ".jpeg",
      ".png",
      ".svg",
      ".gif",
      ".ico",
    ],
    alias: {
      src: path.join(__dirname, "src"),
    },
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.DefinePlugin({
      "process.env": JSON.stringify(dotenv.parsed),
      "process.env.NODE_ENV": JSON.stringify(
        isDevelopment ? "development" : "production"
      ),
    }),
    new MiniCssExtractPlugin({
      filename:
        "./assets/css/" + (devMode ? "[name].css" : "[name].bundle.css"),
    }),
    new HtmlWebpackPlugin({
      filename: "residential.html",
      template: "src/pug/residential.pug",
      minify: false, // remove to minify html
      inject: "body",
      scriptLoading: "blocking",
      ban: "banner",
      disc: "disclaimer",
      tnc: "terms_condition",
      meb: "residential_membership"
    }),
    new HtmlWebpackPlugin({
      filename: "thank-you.html",
      template: "src/pug/thank-you.pug",
      minify: false, // remove to minify html
      inject: "body",
      scriptLoading: "blocking",
      tnc: "terms_condition"
    }),
    new CopyPlugin({
      patterns: [
        {
          from: "src/js/json",
          to: "assets/js/json",
        },
        {
          from: "src/images",
          to: "assets/images",
        },
        // {
        //   from: "src/pdf",
        //   to: "assets/pdf",
        // },
      ],
    }),
  ],
  optimization: {
    minimize: false,
    minimizer: [
      new TerserPlugin({
        parallel: false,
        terserOptions: {
          warnings: false,
        },
        extractComments: true,
      }),
    ],
  },
};
