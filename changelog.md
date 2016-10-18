# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/) 
and this project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased]

## [1.2.1] - 2016-10-18
### Added
- Add NPM command to commit using `commitizen`
- Add chapter about known issues in `README.md`
- Add npm task `karma` for local testing with browsers that keep running after the test has finished
- Use Saucelabs for cross-browser / cross-device unit testing
- Use JavaScript Standard Style for JS style guide
- Add `.editorconfig`. See http://EditorConfig.org for details
- Optimize work flow: add `serve`, `watch` and `uglifyjs` to keep the minified version up to date and start both the web server and the watch tassk with a single command.

### Changed
- Update version for bower
- Adjust test for `onRemove` callback to run in IE11
- Increase captureTimeout for Karma

## [1.2.0] - 2016-09-07
### Added
- Integrate travis
- Write unit tests
- Syntax highlighting for the JS snippets in README.md
- Badges with information about license, version and file size to README.md

### Changed
- Fixed typos in README.md
- Correct sorting in Safari

## [1.1.1] - 2016-09-07
### Changed
- Fixed typo in Readme

## [1.1.0] - 2016-09-07
### Added
- Optional parameter "priority" for `register()` allows prioritisation of component initialisation
- Demo to feature prioritisation of components

## [1.0.0] - 2016-08-12
### First version
