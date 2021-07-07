/** 这是用于开发环境的webpack配置文件 **/
const webpack = require("webpack"); // webpack核心
const { merge } = require("webpack-merge");
const webpackbar = require("webpackbar");
const HtmlWebpackPlugin = require("html-webpack-plugin"); // 动态生成html插件
const { getThemeVariables } = require("antd/dist/theme");
const common = require("./webpack.common.js");
const config = require("./config.js");

/**
 * 暂时用不到
 */
// const path = require("path"); // 获取绝对路径用
// const CopyPlugin = require("copy-webpack-plugin");
// const AntdDayjsWebpackPlugin = require("antd-dayjs-webpack-plugin"); // 使用day.js替代antd中的moment.js
// const tsImportPluginFactory = require("ts-import-plugin"); // 用于ts版本的按需加载


const PUBLIC_PATH = "/"; // 基础路径

module.exports = merge(common, {
  mode: "development",
  entry: [
    "webpack-hot-middleware/client?reload=true&path=/__webpack_hmr", // webpack热更新插件，就这么写
    "./src/index.tsx", // 项目入口
  ],
  output: {
    path: __dirname + "/", // 将打包好的文件放在此路径下，dev模式中，只会在内存中存在，不会真正的打包到此路径
    publicPath: PUBLIC_PATH, // 文件解析路径，index.html中引用的路径会被设置为相对于此路径
    filename: "[name].js", // 编译后的文件名字
  },
  devtool: "eval-source-map", // 报错的时候在控制台输出哪一行报错
  optimization: {
    splitChunks: {
      chunks: "all",
    },
  },
  module: {
    rules: [
      {
        // .css 解析
        test: /\.css$/,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
      {
        // .less 解析
        test: /\.less$/,
        use: [
          "style-loader",
          "css-loader",
          "postcss-loader",
          {
            loader: "less-loader",
            options: {
              lessOptions: {
                modifyVars: getThemeVariables({
                  // dark: true, // 开启暗黑模式
                  // compact: true, // 开启紧凑模式
                }),
                javascriptEnabled: true
              }
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new webpackbar(),
    new webpack.HotModuleReplacementPlugin(), // 热更新插件
    new webpack.DefinePlugin({
      "process.env": config.local.env
    }),
    // 自动生成HTML，并注入各参数
    new HtmlWebpackPlugin({
      // 根据模板插入css/js等生成最终HTML
      filename: "index.html", // 生成的html存放路径，相对于 output.path
      favicon: "./public/favicon.png", // 自动把根目录下的favicon.ico图片加入html
      template: "./public/index.html", // html模板路径
      inject: true, // 是否将js放在body的末尾
    }),
  ]
});
