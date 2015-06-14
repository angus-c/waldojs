module.exports = {
    entry: './src/waldo.js',
    output: {
        path: 'lib',
        filename: 'waldobundle.js'
    },
    module: {
        loaders: [
          {
            // es6 JavaScript
            test: /\.js$/,
            loader: 'babel-loader',
            exclude: /node_modules/,
            query: {
              optional: ['runtime']
            }
          }
        ],
        watch: true
    }
};
