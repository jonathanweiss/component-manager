var fs = require('fs');
var args = process.argv.slice(2);
var isCI = args.length >= 2 && args[1] === '--ci';

module.exports = function(config) {
  if (isCI && !process.env.SAUCE_USERNAME) {
    if (!fs.existsSync('sauce.json')) {
      console.log('Create a sauce.json with your credentials based on the sauce-sample.json file.');
      process.exit(1);
    } else {
      process.env.SAUCE_USERNAME = require('./sauce').username;
      process.env.SAUCE_ACCESS_KEY = require('./sauce').accessKey;
    }
  }

  var customLaunchers = {
    sl_chrome_46: {
      base: 'SauceLabs',
      browserName: 'chrome',
      version: '46'
    },

    sl_chrome_dev: {
      base: 'SauceLabs',
      browserName: 'chrome',
      version: 'dev'
    },

    sl_chrome_beta: {
      base: 'SauceLabs',
      browserName: 'chrome',
      version: 'beta'
    },

    sl_firefox_44: {
      base: 'SauceLabs',
      browserName: 'firefox',
      version: '44'
    },

    sl_firefox_dev: {
      base: 'SauceLabs',
      browserName: 'firefox',
      version: 'dev'
    },

    sl_firefox_beta: {
      base: 'SauceLabs',
      browserName: 'firefox',
      version: 'beta'
    },

    sl_ie_11: {
      base: 'SauceLabs',
      browserName: 'internet explorer',
      platform: 'Windows 8.1',
      version: '11'
    },

    sl_edge: {
      base: 'SauceLabs',
      browserName: 'microsoftedge',
      platform: 'Windows 10'
    },

    sl_android_5: {
      base: 'SauceLabs',
      browserName: 'android',
      platform: 'Linux',
      version: '5.1'
    }
  };

  config.set({
    // test results reporter to use
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['spec', 'coverage', 'saucelabs'],


    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine', 'jasmine-matchers'],


    captureTimeout: 600000,

    // list of files / patterns to load in the browser
    files: [
      'src/*.js',
      'test/*.spec.js'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'src/*.js': ['coverage']
    },


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: isCI ? Object.keys(customLaunchers) : ['Chrome', 'Firefox', 'Safari'],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,


    coverageReporter: {
      dir: 'coverage',
      reporters: [
        { type: 'text' },
        { type: 'html', subdir: 'report-html' },
        { type: 'lcovonly', subdir: '.', file: 'report-lcovonly.txt' }
      ],
      instrumenterOptions: {
        istanbul: { noCompact: true }
      }
    },

    customLaunchers: customLaunchers,

    sauceLabs: {
        testName: 'ComponentManager Unit Tests',
        public: 'public',
        build: process.env.TRAVIS_BUILD_NUMBER
    }

  })
}
