<h1 align="center">Webpack Intermediate Entry</h1>
<br />
<br />

A webpack plugin allowing you to specify a "middleware" file which takes the place of your entries, in the situation you have multiple. It allows you to then import the respective entries it replaces as a normal import under the name `__webpack_entry__`. 

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

Within your intermediate, you can include your initialization code. Simply import your actual entry and do what you will with it.

- `init.js`

```js
import Entry from "__webpack_entry__";

console.log(Entry);
```

<br />
<br />

## License

[MIT License](http://opensource.org/licenses/MIT)