const path = require("path")

module.exports = {
  devServer: {
    // proxy: 'http://localhost:9529'
    port: 9529
  },
  pages: {
    topic_mobile: {
      entry: "src/topic/main.js",
      template: "public/index.html"
    },
    topic: {
      entry: "src/topic_share/main.js",
      template: "public/index.html",
      title: "答知新"
    },
    editor: {
      entry: "src/editor/main.js",
      template: "public/editor.html",
      title: "编辑器"
    },
    reply: {
      entry: "src/answer_share/main.js",
      template: "public/answer.html",
      title: "答知新"
    },
    show: {
      entry: "src/show/main.js",
      template: "public/show.html",
      title: "答知新 - 晒一晒"
    },
    reply_mobile: {
      entry: "src/answer/main.js",
      template: "public/answer.html"
    },
    activity_mobile: {
      entry: "src/activity/main.js",
      template: "public/index.html"
    },
  },
  // chainWebpack: config => config.optimization.minimize(false),
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      }
    }
  }
}
