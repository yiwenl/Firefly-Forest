const path = require("path");
const pathOutput = path.resolve(__dirname, "dist");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");

const env = process.env.NODE_ENV;
const isProd = env === "production";
console.log("Environment isProd :", isProd);
console.log(path.resolve(__dirname, "../../src/alfrid.js"));
const entry = isProd
  ? { app: "./src/js/app.js" }
  : { app: "./src/js/app.js", debug: "./src/js/debug/debug.js" };
const output = isProd
  ? {
      filename: "assets/js/app.js",
      path: pathOutput,
    }
  : {
      filename: "assets/js/[name].js",
      path: pathOutput,
    };

const devtool = isProd ? "source-map" : "inline-source-map";

module.exports = {
  entry,
  devtool,
  output,
  devServer: {
    host: "0.0.0.0",
    contentBase: "./dist",
    hot: true,
    disableHostCheck: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.hbs$/,
        exclude: /node_modules/,
        use: {
          loader: "handlebars-loader",
        },
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
        test: /\.(sa|sc|c)ss$/,
        use: ["style-loader", "css-loader?url=false", "sass-loader"],
      },
      {
        test: /\.(glsl|vert|frag)$/,
        use: ["raw-loader", "glslify-loader"],
      },
    ],
  },
  optimization: {
    minimizer: [new TerserPlugin({ parallel: true })],
  },
  resolve: {
    alias: {
      libs: path.resolve(__dirname, "src/js/libs"),
      shaders: path.resolve(__dirname, "src/shaders"),
    },
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "assets/css/main.css",
    }),
  ],
};
