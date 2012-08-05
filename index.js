
var ProtoList = require('proto-list')
  , path = require('path')
  , fs = require('fs')
  , ini = require('ini')

var exports = module.exports = function () {
  var args = [].slice.call(arguments)
    , conf = new ProtoList()
    conf.push(conf.store = {})
  while(args.length) {
    var a = args.shift()
    if(a) conf.push
          ( 'string' === typeof a 
            ? json(a) 
            : a )
  }

  return conf
}
//recursively find a file...

var find = exports.find = function () {
  var rel = path.join.apply(null, [].slice.call(arguments))
  
  function find(start, rel) {
    var file = path.join(start, rel)
    try {
      fs.statSync(file)
      return file
    } catch (err) {
      if(start != '/')
        return find(path.dirname(start), rel)
    }
  }
  return find(__dirname, rel)
}

var parse = exports.parse = function (content, file) {

  //if it ends in .json or starts with { then it must be json.
  //must be done this way, because ini accepts everything.
  //can't just try and parse it and let it throw if it's not ini.
  //everything is ini. even json with a systax error.

  if((file && /\.json$/.test(file)) || /^\s*{/.test(content)) 
    return JSON.parse(content)
  return ini.parse(content)

}

var json = exports.json = function () {
  var file = path.join.apply(null, [].slice.call(arguments))
  try {
    parse(fs.readFileSync(file,'utf-8'), file) 
  } catch (err) {
    err.message += ' when attempting to read configuration from:' + file
    throw err
  }
}
