through        = require "through2"
gutil          = require "gulp-util"
path           = require "path"
merge          = require "merge"
pugParser      = require "pug-parser"
pugLexer       = require "pug-lexer"
vjade          = require "virtual-jade"
{PluginError}  = gutil


class Parser extends pugParser.Parser
  constructor: (src, filename, options) ->
    tokens = pugLexer src, {filename}
    super tokens, {filename, src}

gulpPugHyperscript = (options) ->
  replaceExtension = (path) ->
    gutil.replaceExtension path, ".js"

  transform = (file, enc, cb) ->
    return cb null, file                                                        if file.isNull()
    return cb new PluginError "gulp-pug-hyperscript", "Streaming not supported" if file.isStream()

    data     = undefined
    str      = file.contents.toString "utf8"
    dest     = replaceExtension file.path
    defaults =
      filename: file.path
      name:     "_pug_template_fn"
      parser:   Parser
      pretty:   true
      silent:   true
      runtime:  vjade.runtime
    options  = merge defaults, options
    vjade.runtime = options.runtime

    console.log str unless options.silent

    try
      data  = vjade str, options
      data += "\nmodule.exports = _pug_template_fn;\n"
    catch err
      return cb new PluginError "gulp-pug-hyperscript", err

    console.log data unless options.silent

    file.contents = new Buffer data
    file.path     = dest
    cb null, file

  through.obj transform


module.exports = gulpPugHyperscript
