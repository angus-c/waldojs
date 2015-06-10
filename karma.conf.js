module.exports = function (config) {
  config.set({

    // base path, that will be used to resolve files and exclude
    basePath: '',

    // list of files / patterns to load in the browser
    files: [
      'test/finder_spec.js'
    ],

    // list of files to exclude
    exclude: [

    ],

    // test results reporter to use
    // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
    reporters: ['dots'],

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: ['Firefox'],

    // If browser does not capture in given timeout [ms], kill it
    captureTimeout: 60000,

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false,

    frameworks: ['jasmine'],

    preprocessors: {
      'src/*.js': ['webpack', 'sourcemap'],
      'test/*spec.js': ['webpack', 'sourcemap']
    },

    plugins: [
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-jasmine',
      'karma-sourcemap-loader',
      'karma-webpack'
    ],

    webpack: {
      module: {
        loaders: [
          {
            // es6 JavaScript
            test: /\.js$/,
            loader: 'babel-loader?cacheDirectory=true',
            exclude: /node_modules/
          }
        ]
      },
      watch: true
    }
  });
};
