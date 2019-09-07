<h1 align="center">Webpack Intermediate Entry</h1>
<br />
<br />

A webpack plugin allowing you to specify a "middleware" file which takes the place of your entries. With it you can programatically bundle any number of entry modules, all of which should share a common bootstraping logic. For each entry file, the common module will be loaded instead. Within that common module, importing `__webpack_entry__` will resolve to the original entry file respective to each _instance_ of common.

<br />
<br />

## Use Case

Similarly to a [Next.js](https://nextjs.org) stack, you have a folder containing a number of modules. Each of those export a default component, which supplies the "page" for a named route, instanciated with react. This plugin gives that same functionality, but for those who wish to build static page-bundles, for a CDN or such-like, in conjunction with [HTMLWebpackPlugin](https://webpack.js.org/plugins/html-webpack-plugin/), thus bypassing SSR.

<br />
<br />

## Install

```
npm install --save-dev webpack-intermediate-entry
```

<br />
<br />

## How to use

**Check out `/example` in this repo for a good example of how this plugin fits into a project.**

<br />

In your config, import and include this package amongst your plugins.

- `webpack.config.js`

```js
const IntermediateEntryPlugin = require("webpack-intermediate-entry");

module.exports = {
    entry: {
        hello: "./hello.js"
    },
    plugins: [
        new IntermediateEntryPlugin({ insert: "./init.js" })
    ]
}
```

<br />

In your config, import and include this package amongst your plugins.

- `hello.js`

```js
export default "Hello World!"
```

<br />

Within your intermediate, you can include common init logic. Simply import your actual entry and do what you will with it.

- `init.js`

```js
import Entry from "__webpack_entry__";

console.log(Entry);
```

<br />

> In a more realistic use case, `init.js` might contain a `ReactDOM.render()` call, which consumes the component suppliedby your entries.

<br />

## License

[MIT License](http://opensource.org/licenses/MIT)
