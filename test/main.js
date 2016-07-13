var pugHyperscript = require('../');
var should = require('should');
var gutil = require('gulp-util');
var fs = require('fs');
var path = require('path');
var vjade = require('virtual-jade');
var escapeStringRegexp = require('escape-string-regexp');
require('mocha');


var createFile = function (filepath, contents) {
  var base = path.dirname(filepath);
  return new gutil.File({
    path: filepath,
    base: base,
    cwd: path.dirname(base),
    contents: contents
  });
};

describe('gulp-pug-hyperscript', function() {
  describe('pugHyperscript()', function() {
    before(function() {
      this.testData = function (expected, newPath, done) {
        var newPaths = [newPath];
        expected = [expected];

        return function (newFile) {
          this.expected = expected.shift();
          this.newPath = newPaths.shift();

          should.exist(newFile);
          should.exist(newFile.path);
          should.exist(newFile.relative);
          should.exist(newFile.contents);
          newFile.path.should.equal(this.newPath);
          newFile.relative.should.equal(path.basename(this.newPath));
          String(newFile.contents).should.equal(this.expected);

          if (done && !expected.length) {
            done.call(this);
          }
        };
      };
    });

    it('should emit errors correctly', function(done) {
      var filepath = '/home/contra/test/file.jade';
      var contents = new Buffer('section\r\nsection');

      pugHyperscript()
        .on('error', function(err) {
          err.message.should.equal('You can only have one top-level tag!');
          done();
        })
        .on('data', function(newFile) {
          throw new Error('no file should have been emitted!');
        })
        .write(createFile(filepath, contents));
    });

    it('should compile a file (pretty)', function(done) {
      var filepath = 'test/fixtures/hello.jade';
      var contents = new Buffer(fs.readFileSync(filepath));
      var opts = {
        name:     "_pug_template_fn",
        pretty:   true
      };
      var expected = vjade(String(contents), opts);
      expected += "\nmodule.exports = _pug_template_fn;\n"

      pugHyperscript(opts)
        .on('error', done)
        .on('data', this.testData(expected, path.normalize('test/fixtures/hello.js'), done))
        .write(createFile(filepath, contents));
    });

    it('should compile a file (not pretty)', function(done) {
      var filepath = 'test/fixtures/hello.jade';
      var contents = new Buffer(fs.readFileSync(filepath));
      var opts = {
        name:     "_pug_template_fn",
        pretty:   false
      };
      var expected = vjade(String(contents), opts);
      expected += "\nmodule.exports = _pug_template_fn;\n"

      pugHyperscript(opts)
        .on('error', done)
        .on('data', this.testData(expected, path.normalize('test/fixtures/hello.js'), done))
        .write(createFile(filepath, contents));
    });

    it('exports a template function', function(done) {
      var filepath = 'test/fixtures/hello.jade';
      var contents = new Buffer(fs.readFileSync(filepath));
      var opts = {
        name:     "_pug_template_fn",
        pretty:   true
      };
      var expectations = function(data) {
        compiled = data._contents.toString();
        compiled.should.match(/exports = _pug_template_fn/);
        done();
      };

      pugHyperscript(opts)
        .on('error', done)
        .on('data', expectations)
        .write(createFile(filepath, contents));
    });

    it('uses a custom runtime', function(done) {
      var filepath = 'test/fixtures/hello.jade';
      var contents = new Buffer(fs.readFileSync(filepath));
      var runtime  = "var h = require('maquette').h;"
      var opts = {
        name:     "_pug_template_fn",
        pretty:   true,
        runtime:  "\n" + runtime + "\n"
      };
      var expectations = function(data) {
        compiled = data._contents.toString();
        compiled.should.match(new RegExp(escapeStringRegexp(runtime)));
        done();
      };

      pugHyperscript(opts)
        .on('error', done)
        .on('data', expectations)
        .write(createFile(filepath, contents));
    });

    it('inserts included file content', function(done) {
      var filepath = 'test/fixtures/include.jade';
      var contents = new Buffer(fs.readFileSync(filepath));
      var opts = {
        name:     "_pug_template_fn",
        pretty:   true
      };
      var expectations = function(data) {
        compiled = data._contents.toString();
        compiled.should.match(/h\("div", {/);
        compiled.should.match(/Hello/);
        compiled.should.match(/llamas!!!/);
        compiled.should.match(/world/);
        done();
      };

      pugHyperscript(opts)
        .on('error', done)
        .on('data', expectations)
        .write(createFile(filepath, contents));
    });

    it('inserts extended file content', function(done) {
      var filepath = 'test/fixtures/extends.jade';
      var contents = new Buffer(fs.readFileSync(filepath));
      var opts = {
        name:     "_pug_template_fn",
        pretty:   true
      };
      var expectations = function(data) {
        compiled = data._contents.toString();
        compiled.should.match(/h\("div", {/);
        compiled.should.match(/capybara/);
        compiled.should.not.match(/overridden animal/);
        compiled.should.match(/default content/);
        done();
      };

      pugHyperscript(opts)
        .on('error', done)
        .on('data', expectations)
        .write(createFile(filepath, contents));
    });
  });
});
