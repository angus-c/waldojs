module.exports = {
    entry: './src/finder.js',
    output: {
        path: 'lib',
        filename: 'waldo.js'
    },
    module: {
        loaders: [
          {
            // es6 JavaScript
            test: /\.js$/,
            loader: 'babel-loader?optional=runtime',
            exclude: 'node_modules'
          }
        ]
    }
};