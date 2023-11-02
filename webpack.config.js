module.exports = (env, argv) => {
  const production = argv && argv.mode && argv.mode !== "development";

  const { VueLoaderPlugin } = require("vue-loader");
  const htmlWebpackPlugin = require("html-webpack-plugin");
  const MiniCssExtractPlugin = require("mini-css-extract-plugin");
  const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
  const { CleanWebpackPlugin } = require("clean-webpack-plugin");
  const autoprefixer = require("autoprefixer");
  const TerserPlugin = require("terser-webpack-plugin");
  const webpack = require("webpack");
  const path = require("path");

  const postcssOpts = {
    postcssOptions: {
      plugins: [autoprefixer],
    },
  };

  return {
    entry: path.resolve(__dirname, "src/main.js"),
    output: {
      filename: "js/[name].js",
      path: path.resolve(__dirname, "dist/"),
      publicPath: "/",
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: [["@babel/preset-env"]],
              plugins: [
                "@babel/plugin-transform-destructuring",
                "@babel/plugin-proposal-object-rest-spread",
                "@babel/plugin-transform-template-literals",
              ],
              babelrc: false,
            },
          },
        },
        {
          test: /\.vue$/,
          loader: "vue-loader",
        },
        {
          test: /\.css$/,
          use: [
            { loader: MiniCssExtractPlugin.loader },
            { loader: "css-loader" },
            {
              loader: "postcss-loader",
              options: postcssOpts,
            },
          ],
        },
        {
          test: /\.scss$/,
          use: [
            { loader: MiniCssExtractPlugin.loader },
            { loader: "css-loader" },
            {
              loader: "postcss-loader",
              options: postcssOpts,
            },
            { loader: "sass-loader" },
          ],
        },
        {
          test: /\.html$/,
          use: [
            {
              loader: "html-loader",
              options: { minimize: true },
            },
          ],
        },
        {
          test: /\.(eot|ttf|woff|woff2)(\?\S*)?$/,
          loader: "file-loader",
          options: {
            context: "src/assets/fonts",
            name: "[path][name].[ext]",
            outputPath: "fonts",
          },
        },
        {
          test: /\.(png|jpe?g|gif|webm|mp4|svg)$/,
          loader: "file-loader",
          options: {
            context: "src/assets/img",
            name: "[path][name].[ext]",
            outputPath: "img",
          },
        },
      ],
    },
    plugins: [
      new VueLoaderPlugin(),
      new CleanWebpackPlugin(),
      new webpack.DefinePlugin({
        __VUE_OPTIONS_API__: false,
        __VUE_PROD_DEVTOOLS__: false,
      }),
      new MiniCssExtractPlugin({
        filename: "css/[name].css",
        esModule: false,
      }),
      new OptimizeCssAssetsPlugin(),
      new htmlWebpackPlugin({
        template: path.resolve(__dirname, "public", "index.html"),
        favicon: "./public/favicon.ico",
      }),
    ],
    optimization: {
      minimize: production,
      minimizer: [
        new TerserPlugin({
          parallel: true,
          terserOptions: {
            toplevel: true,
            output: {
              beautify: false,
            },
          },
        }),
      ],
      sideEffects: true,
    },

    performance: {
      hints: false,
    },
    devServer: {
      hot: true,
      host: "127.0.0.1",
      writeToDisk: true,
    },
  };
};
