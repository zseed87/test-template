/** 这是用于开发环境的webpack配置文件 **/

const path = require("path"); // 获取绝对路径用
const CopyPlugin = require("copy-webpack-plugin");
const AntdDayjsWebpackPlugin = require("antd-dayjs-webpack-plugin"); // 使用day.js替代antd中的moment.js
const tsImportPluginFactory = require("ts-import-plugin"); // 用于ts版本的按需加载

/**
 * 暂时用不到
 */
// const webpack = require("webpack"); // webpack核心
// const webpackbar = require("webpackbar");
// const MiniCssExtractPlugin = require("mini-css-extract-plugin"); // 为了单独打包css


module.exports = {
  target: process.env.NODE_ENV === 'development' ? 'web' : 'browserslist',
  module: {
    rules: [
      // {
      //   // 编译前通过eslint检查代码 (注释掉即可取消eslint检测)
      //   test: /\.(ts|tsx|js|jsx)?$/,
      //   enforce: "pre",
      //   use: ["source-map-loader", "eslint-loader"],
      //   include: path.resolve(__dirname, "src"),
      // },
      {
        // .tsx用typescript-loader解析解析
        test: /\.(ts|tsx|js|jsx)?$/,
        use: [
          {
            loader: "awesome-typescript-loader",
            options: {
              getCustomTransformers: () => ({
                before: [
                  tsImportPluginFactory({
                    libraryName: "antd",
                    libraryDirectory: "lib",
                    style: true,
                  }),
                ],
              }),
            },
          },
        ],
        include: path.resolve(__dirname, "src"),
      },
      {
        // 文件解析
        test: /\.(eot|woff|otf|svg|ttf|woff2|appcache|mp3|mp4|pdf)(\?|$)/,
        include: path.resolve(__dirname, "src"),
        use: [
          {
            loader: "file-loader",
            options: {
              name: "assets/[name].[hash:4].[ext]",
            },
          },
        ],
      },
      {
        // 图片解析
        test: /\.(png|jpg|jpeg|gif)$/i,
        include: path.resolve(__dirname, "src"),
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 8192,
              name: "assets/[name].[hash:4].[ext]",
            },
          },
        ],
      },
      {
        // wasm文件解析
        test: /\.wasm$/,
        include: path.resolve(__dirname, "src"),
        type: "webassembly/experimental",
      },
      {
        // xml文件解析
        test: /\.xml$/,
        include: path.resolve(__dirname, "src"),
        use: ["xml-loader"],
      },
    ],
  },
  plugins: [
    new AntdDayjsWebpackPlugin(),
    // 拷贝public中的文件到最终打包文件夹里
    new CopyPlugin({
      patterns: [
        {
          from: "public/**/*",
          to: "./",
          globOptions: {
            ignore: ["**/favicon.png", "**/index.html"],
          },
          noErrorOnMissing: true,
        },
      ],
    }),

    // new webpack.DllReferencePlugin({
    // 	manifest: require('./dll/react-manifest.json'), // eslint-disable-line
    // }),
    // 拷贝dll中的文件到最终打包文件夹里
    // new CopyPlugin({
    //   patterns: [
    //     {
    //       from: "./dll/**/*",
    //       to: "./",
    //       globOptions: {
    //         // ignore: ["**/favicon.png", "**/index.html"],
    //         ignore: ["**/index.html"],
    //       },
    //       noErrorOnMissing: true,
    //     },
    //   ],
    // }),
  ],
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx", ".less", ".css", ".wasm"], // 后缀名自动补全
    alias: {
      "@": path.resolve(__dirname, "src"),
    }
  },
};
