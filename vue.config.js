module.exports = {
    pages: {
        index: {
            entry: "src/main.js",
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
        }
    }
}