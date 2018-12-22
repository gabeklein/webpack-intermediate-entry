const InitializeEntryPlugin = require("../");
const path = require("path");

module.exports = {
    mode: "development",
    entry: {
        single: "./hello.js",
        multi: ["./foo.js", "./bar.js"]
    },
    context: path.join(__dirname, "./src"),
    output: {
        filename: "./[name].js",
        path: path.resolve(__dirname, "dist")
    },
    plugins: [
        new InitializeEntryPlugin({ insert: "./init.js" })
    ],
    devtool: false
}