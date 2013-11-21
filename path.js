var slice = [].slice;

var path = require("path")

// Todo: factor out!
// Pebbles path
// Takes either an array, or a '.' delimited string and provides methods for manipulating the path.
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

PebblesPath.prototype.set = function set(index, label) {
  var cloned = this._path.slice();
  cloned[index] = label;
  return new PebblesPath(cloned)
};

PebblesPath.prototype.empty = function isTopLevel() {
  return this._path.length === 0;
};

PebblesPath.prototype.toString = function toString() {
  return this._path.join(".")
};

PebblesPath.prototype.realm = function last() {
  if (arguments.length) return this.with("oid", oid);
  return this._path[0]
};

PebblesPath.prototype.parent = function parent() {
  var cloned = this._path.slice();
  cloned.pop();
  return new PebblesPath(cloned)
};

PebblesPath.prototype.append = function append(tail) {
  return this.cd(tail);
};

PebblesPath.prototype.cd = function cd(dest) {
  var cloned = this._path.slice();
  var newPath = path.join(cloned.join("/"), dest).split("/").filter(function(p) {
    return !(p === '' || p === '.' || p === '..')
  });
  return new PebblesPath(newPath)
};

PebblesPath.prototype.child = function child(oid) {
  var cloned = this._path.slice();
  cloned.push(oid);
  return new PebblesPath(cloned)
};

PebblesPath.prototype.last = function last() {
  return this._path[this._path.length - 1]
};

PebblesPath.prototype.toArray = function toArray() {
  return this._path.slice();
};

PebblesPath.prototype.first = function first() {
  return this._path[0]
};

module.exports = PebblesPath;