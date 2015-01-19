var slice = [].slice;

var prop = require("./prop");
var path = require("path");

// Pebbles path
// Takes either an array, or a '.' delimited string and provides methods for querying + manipulating a pebbles path.
function PebblesPath(path) {
  if (!(this instanceof PebblesPath)) {
    return new PebblesPath(path);
  }
  if (path instanceof PebblesPath) {
    return new PebblesPath(path.toArray());
  }
  path || (path = []);
  if (!Array.isArray(path)) {
    return new PebblesPath(path.split("."));
  }
  // The path is represented as an array internally
  this._path = path || [];
}

prop(PebblesPath.prototype)
  .method('set', function(index, label) {
    var cloned = this._path.slice();
    cloned[index] = label;
    return new PebblesPath(cloned)
  })
  .getter('isEmpty', function() {
    return this._path.length === 0;
  })
  .getter('realm', function () {
    return this._path[0]
  })
  .getter('parent', function () {
    var cloned = this._path.slice();
    cloned.pop();
    return new PebblesPath(cloned);
  })
  .method('concat', function (tail) {
    var args = slice.call(arguments);
    if (args.length > 1) {
      return new PebblesPath(this._path.concat(args));
    }
    return new PebblesPath(this._path.concat(tail.split(".")))
  })
  .method('cd', function (dest) {
    var cloned = this._path.slice();
    var newPath = path.join(cloned.join(path.sep), dest).split(path.sep).filter(function (p) {
      return !(p === '' || p === '.' || p === '..')
    });
    return new PebblesPath(newPath)
  })
  .method('child', function (oid) {
    var cloned = this._path.slice();
    cloned.push(oid);
    return new PebblesPath(cloned)
  })
  .getter('last', function () {
    return this._path[this._path.length - 1];
  })
  .getter('first', function () {
    return this._path[0];
  })
  .method('toArray', function () {
    return this._path.slice();
  })
  .method('toString', function () {
    return this._path.join(".")
  });

module.exports = PebblesPath;