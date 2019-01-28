const IntermediateEntryPlugin = require("../");
const path = require("path");

module.exports = {
    mode: "development",
    devtool: false,
    context: path.join(__dirname, "./src"),
    entry: {
        single: "./hello.js",
        multi: ["./foo.js", "./bar.js"]
    },
    output: {
        filename: "./[name].js",
        path: path.resolve(__dirname, "dist")
    },
    plugins: [
        new IntermediateEntryPlugin({ insert: "./init.js" })
    ]
}