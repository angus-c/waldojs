module.exports = {
    entry: './src/finder.js',
    output: {
        path: 'lib',
        filename: 'waldo.js',
        library: 'waldo',
        libraryTarget: 'commonjs2'
    },
    module: {
        loaders: [
          {
            // es6 JavaScript
            test: /\.js$/,
            loader: 'babel-loader',
            exclude: 'node_modules',
            query: { cacheDirectory: true }
          }
        ],
        watch: true
    }
};
