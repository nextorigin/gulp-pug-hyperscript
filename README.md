# gulp-pug-hyperscript

[![Build Status][ci-master]][travis-ci]
[![Coverage Status][coverage-master]][coveralls]
[![Dependency Status][dependency]][david]
[![devDependency Status][dev-dependency]][david]
[![Downloads][downloads]][npm]

Compiles [Pug/Jade](https://github.com/pugjs/pug) templates to [Hyperscript](https://github.com/dominictarr/hyperscript).

[![NPM](https://nodei.co/npm/gulp-pug-hyperscript.png?downloads=true&downloadRank=true&stars=true)](https://npmjs.org/package/gulp-pug-hyperscript)


## About

**gulp-pug-hyperscript** is a gulp plugin to compile [Pug/Jade](https://github.com/pugjs/pug) templates to [Hyperscript](https://github.com/dominictarr/hyperscript).  Usable with [maquette](http://maquettejs.org/), [virtual-dom](https://github.com/Matt-Esch/virtual-dom), [react](https://github.com/mlmorg/react-hyperscript), or any other DOM library that supports Hyperscript.

This package was created by smashing [**gulp-iced-coffee**](https://github.com/doublerebel/gulp-iced-coffee) and [**virtual-jade-loader**](https://github.com/tdumitrescu/virtual-jade-loader) together until they fit.  It uses [**virtual-jade**](https://github.com/tdumitrescu/virtual-jade) to compile from Pug/Jade to Hyperscript.

## Installation
```sh
npm install --save-dev gulp-pug-hyperscript
```

## Usage

```javascript
var pugHyperscript = require('gulp-pug-hyperscript');

gulp.task('pug', function() {
  gulp.src('./src/views/*.pug')
    .pipe(pugHyperscript().on('error', gutil.log))
    .pipe(gulp.dest('./public/'))
});
```

### Error handling

gulp-pug-hyperscript will emit an error for cases such as invalid pug syntax. If uncaught, the error will crash gulp.

You will need to attach a listener (i.e. `.on('error')`) for the error event emitted by gulp-pug-hyperscript:

```javascript
var pugStream = pugHyperscript({pretty: false});

// Attach listener
pugStream.on('error', function(err) {});
```

In addition, you may utilize [gulp-util](https://github.com/wearefractal/gulp-util)'s logging function:

```javascript
var gutil = require('gulp-util');

// ...

var pugStream = pugHyperscript();

// Attach listener
pugStream.on('error', gutil.log);

```

Since `.on(...)` returns `this`, you can compact it as inline code:

```javascript

gulp.src('./src/views/*.pug')
  .pipe(pugHyperscript().on('error', gutil.log))
  // ...
```

## Options

The options object supports the same options as [**virtual-jade**](https://github.com/tdumitrescu/virtual-jade), with two additional options:
```coffee
  silent:   true
  runtime:  vjade.runtime
```

`silent: false` will dump the pre- and post-processed template to the console for debugging.

`vjade.runtime` [defaults to](https://github.com/tdumitrescu/virtual-jade/blob/b5405858c65378828b6b27b92420dc1297a2a50e/lib/index.js#L16) `var h = require('virtual-dom/h');`.  To use Maquette or another Hyperscript library, replace `vjade.runtime` string with the appropriate string of code.

## License

MIT

  [ci-master]: https://img.shields.io/travis/nextorigin/gulp-pug-hyperscript/master.svg?style=flat-square
  [travis-ci]: https://travis-ci.org/nextorigin/gulp-pug-hyperscript
  [coverage-master]: https://img.shields.io/coveralls/nextorigin/gulp-pug-hyperscript/master.svg?style=flat-square
  [coveralls]: https://coveralls.io/r/nextorigin/gulp-pug-hyperscript
  [dependency]: https://img.shields.io/david/nextorigin/gulp-pug-hyperscript.svg?style=flat-square
  [david]: https://david-dm.org/nextorigin/gulp-pug-hyperscript
  [dev-dependency]: https://img.shields.io/david/dev/nextorigin/gulp-pug-hyperscript.svg?style=flat-square
  [david-dev]: https://david-dm.org/nextorigin/gulp-pug-hyperscript#info=devDependencies
  [downloads]: https://img.shields.io/npm/dm/gulp-pug-hyperscript.svg?style=flat-square
  [npm]: https://www.npmjs.org/package/gulp-pug-hyperscript
