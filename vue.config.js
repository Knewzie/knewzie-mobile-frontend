const path = require("path")

module.exports = {
  devServer: {
    port: 9529
  },
  pages: {
    topic: {
      entry: "src/topic_share/main.js",
      template: "public/index.html",
      title: "The Waving"
    },
    show: {
      entry: "src/show/main.js",
      template: "public/show.html",
      title: "The Waving"
    },
    activity: {
      entry: "src/activity_share/main.js",
      template: "public/index.html",
      title: "The Waving"
    },
    track: {
      entry: "src/track_share/main.js",
    },
    profile: {
      entry: "src/profile/main.js",
      template: "public/index.html",
      title: "The Waving"
    },
    form: {
      entry: "src/form/main.js",
      template: "public/form.html",
      title: "Forms"
    }
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
