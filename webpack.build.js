/** 这是用于生产环境的webpack配置文件 **/
const path = require("path");
const webpack = require("webpack"); // webpack核心
const { merge } = require("webpack-merge");
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); // 为了单独打包css
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin"); // 对CSS进行压缩
const TerserPlugin = require("terser-webpack-plugin"); // 优化js
const { CleanWebpackPlugin } = require("clean-webpack-plugin"); // 每次打包前清除旧的build文件夹
const HtmlWebpackPlugin = require("html-webpack-plugin"); // 生成html
const { getThemeVariables } = require("antd/dist/theme");
const common = require("./webpack.common.js");
const config = require("./config.js");
const env = process.env.NODE_ENV;

/**
 * 暂时用不到
 */
// const MiniCssExtractPlugin = require("mini-css-extract-plugin"); // 为了单独打包css
// const AntdDayjsWebpackPlugin = require("antd-dayjs-webpack-plugin"); // 使用day.js替代antd中的moment.js
// const tsImportPluginFactory = require("ts-import-plugin"); // 用于ts版本的按需加载
// const WorkboxPlugin = require("workbox-webpack-plugin");
// const CopyPlugin = require("copy-webpack-plugin"); // 用于直接复制public中的文件到打包的最终文件夹中
// const FaviconsWebpackPlugin = require("favicons-webpack-plugin"); // 自动生成各尺寸的favicon图标
// const webpackbar = require("webpackbar"); // 进度条

/**
 * 基础路径
 * 比如我上传到自己的服务器填写的是："/work/admin/"，最终访问为"https://isluo.com/work/admin/"
 * 根据你自己的需求填写
 * "/" 就是根路径，假如最终项目上线的地址为：https://isluo.com/， 那就可以直接写"/"
 * **/
const PUBLIC_PATH = "/";

const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

module.exports = merge(common, {
  mode: "production",
  entry: path.resolve(__dirname, "src", "index"),
  output: {
    path: path.resolve(__dirname, "dist"), // 将文件打包到此目录下
    publicPath: PUBLIC_PATH, // 在生成的html中，文件的引入路径会相对于此地址，生成的css中，以及各类图片的URL都会相对于此地址
    filename: "js/[name].[contenthash:8].js",
    chunkFilename: "js/[name].[contenthash:8].chunk.js",
  },
  // devtool: 'source-map',
  stats: {
    children: false, // 不输出子模块的打包信息
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: true, // 多线程并行构建
        // include: path.resolve(__dirname, "src"),
        terserOptions: {
          // https://github.com/terser/terser#minify-options
          compress: {
            warnings: false, // 删除无用代码时是否给出警告
            // drop_console: true, // 删除所有的console.*
            drop_debugger: true, // 删除所有的debugger
            pure_funcs: ["console.log"], // 删除所有的console.log
          },
        },
      }),
      new CssMinimizerPlugin()
    ],
    splitChunks: {
      chunks: "all",
    },
  },
  module: {
    rules: [
      {
        // .css 解析
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"],
      },
      {
        // .less 解析
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
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
    new CleanWebpackPlugin(), // 打包前删除上一次留下的旧代码（根据output.path）
    new webpack.DefinePlugin({  //在window环境中注入全局变量
      "process.env": config[env].env,
    }),
    // 提取CSS等样式生成单独的CSS文件
    new MiniCssExtractPlugin({
      filename: "css/[name].[contenthash:8].css", // 生成的文件名
      ignoreOrder: true, // 忽略因CSS文件引入顺序不一致而抛出的警告信息，多为antd内部css引起
    }),

    // 自动生成HTML，并注入各参数
    new HtmlWebpackPlugin({
      // 根据模板插入css/js等生成最终HTML
      filename: "index.html", // 生成的html存放路径，相对于 output.path
      favicon: "./public/favicon.png", // 自动把根目录下的favicon.ico图片加入html
      template: "./public/index.html", // html模板路径
      inject: true, // 是否将js放在body的末尾
      // publicPath: "/user-admin"
    }),

    // 展示各种包大小依赖
    // new BundleAnalyzerPlugin({ analyzerPort: 8081 })

    /**
     * 自动生成各种类型的favicon图标
     * 自动生成manifest.json文件
     * 这么做是为了各种设备上的扩展功能，PWA桌面图标/应用启动图标等，主题等
     * https://github.com/itgalaxy/favicons#usage
     * **/
    // new FaviconsWebpackPlugin({
    //   logo: "./public/favicon.png", // 原始图片路径
    //   // prefix: "", // 自定义目录，把生成的文件存在此目录下
    //   favicons: {
    //     appName: "ReactPWA", // 你的APP全称
    //     appShortName: "React", // 你的APP简称，手机某些地方会显示，比如切换多个APP时显示的标题
    //     appDescription: "ReactPWA Demo", // 你的APP简介
    //     background: "#222222", // APP启动页的背景色
    //     theme_color: "#222222", // APP的主题色
    //     appleStatusBarStyle: "black-translucent", // 苹果手机状态栏样式
    //     display: "standalone", // 是否显示搜索框，PWA就别显示了
    //     start_url: PUBLIC_PATH, // 起始页，‘.’会自动到主页，比'/'好，尤其是网站没有部署到根域名时
    //     logging: false, // 是否输出日志
    //     pixel_art: false, // 是否自动锐化一下图标，仅离线模式可用
    //     loadManifestWithCredentials: false, // 浏览器在获取manifest.json时默认不会代cookie。如果需要请设置true
    //     icons: {
    //       // 生成哪些平台需要的图标
    //       android: true, // 安卓
    //       appleIcon: false, // 苹果
    //       appleStartup: false, // 苹果启动页
    //       coast: false, // opera
    //       favicons: true, // web小图标
    //       firefox: false, // 火狐
    //       windows: false, // windows8 桌面应用
    //       yandex: false, // Yandex浏览器
    //     },
    //   },
    // }),
    /**
     * PWA - 自动生成server-worker.js
     * https://developers.google.com/web/tools/workbox/reference-docs/latest/module-workbox-webpack-plugin.GenerateSW?hl=en
     *  */
    // new WorkboxPlugin.GenerateSW(),
  ],
});
