module.exports = {
    pages: {
        topic_mobile: {
            entry: "src/topic/main.js",
            template: "public/index.html"
        },
        editor: {
            entry: "src/editor/main.js",
            template: "public/editor.html",
            title: "编辑器"
        },
        reply: {
            entry: "src/answer/main.js",
            template: "public/answer.html"
        },
        topic: {
            entry: "src/topic_share/main.js",
            template: "public/index.html"
        }
    }
}