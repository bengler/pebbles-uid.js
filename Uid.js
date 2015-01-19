var prop = require("./prop");

module.exports = Uid;

var InvalidUidError = require("./InvalidUidError");

var VALID_LABEL = /^[a-zA-Z0-9\*_-]+$/;
var UID = /((.*)^[^:]+)?:([^\$]*)?\$?(.*$)?/;
var MATCH_KLASS = 1;
var MATCH_PATH = 3;
var MATCH_OID = 4;

var slice = [].slice;

var PebblesPath = require("./Path");

function Uid(klass, path, oid) {
  var args = slice.call(arguments, 0);
  if (args.length === 1 && typeof klass === 'string') {
    return Uid.parse(klass);
  }
  else if (args.length === 1 && typeof klass === 'object') {
    return new Uid(klass[0].klass, klass[0].path, klass[0].oid);
  }

  if (!(this instanceof Uid)) {
    return new Uid(klass, path, oid);
  }

  this._klass = klass;
  this._path = new PebblesPath(path);
  this._oid = oid;

  this.validate('klass', 'path', 'oid');

}

prop(Uid.prototype)
  .getter('klass', '_')
  .getter('path', '_')
  .getter('oid', '_')
  .getter('parent', function() {
    if (this._path.isEmpty) throw new Error('Cannot get parent of an uid that is already at the top level: "' + this + '"');
    var parentOid = this._path.last;
    return new Uid(this._klass, this._path.parent, parentOid);
  })
  .getter('children', function () {
    var oid = this._oid;
    if (!isDefined(oid)) throw new Error("Cannot get child path of an uid without an oid");
    return new Uid(this._klass, this._path.child(oid));
  })
  .method('validate', function validate() {
    var args = slice.call(arguments, 0);
    if (args.length === 0) {
      return this.validate('klass', 'path', 'oid')
    }

    if (~args.indexOf('klass') && this._klass && !Uid.isValidKlass(this._klass)) {
      throw new InvalidUidError('Invalid klass "' + this._klass + '" in Uid: "' + this + '"')
    }
    if (~args.indexOf('path') && this._path && !Uid.isValidPath(this._path)) {
      throw new InvalidUidError('Invalid path "' + this._path + '" in Uid: "' + this + '"')
    }
    if (~args.indexOf('oid') && this._oid && !Uid.isValidOid(this._oid)) {
      throw new InvalidUidError('Invalid oid "' + this._oid + '" in Uid: "' + this + '"')
    }
    return this;
  })
  .method('with', function() {
    var args = slice.call(arguments, 0);
    if (args.length === 2) {
      var w = {};
      w[args[0]] = args[1];
      return this['with'](w)
    }
    if (args.length === 1 && (typeof args[0] === 'object')) {
      args = [args[0].klass, args[0].path, args[0].oid];
    }
    var klass = isDefined(args[0]) ? args[0] : this._klass;
    var path = isDefined(args[1]) ? args[1] : this._path;
    var oid = isDefined(args[2]) ? args[2] : this._oid;
    return new Uid(klass, path, oid);
  })
  .alias('set', 'with')
  .method('clone', function () {
    return this.with();
  })
  .method('get', function (prop) {
    return this['_' + prop];
  })
  .method('toString', function () {
    var oid = this._oid;
    return "" + (this._klass || '*') + ":" + (this._path || '') + (oid ? '$' + oid : '');
  });

// Class methods
Uid.parse = function (uid) {
  if (!this.isValid(uid)) throw new InvalidUidError("Invalid Uid " + uid);
  return Uid.apply(null, Uid.split(uid));
};

Uid.split = function (uid) {
  var match;
  if (!(match = uid.match(UID))) {
    return [];
  }
  return [match[MATCH_KLASS], match[MATCH_PATH], match[MATCH_OID]];
};

Uid.isValid = function (uid) {
  return UID.test(uid);
};

Uid.isValidKlass = function (klass) {
  return klass.split('.').every(isValidLabel);
};

Uid.isValidPath = function (path) {
  return new PebblesPath(path).toArray().every(isValidLabel);
};

Uid.isValidOid = function (oid) {
  return (typeof oid === "number") || (!!oid && oid.indexOf('/') === -1)
};

function isValidLabel(label) {
  return VALID_LABEL.test(label);
}

function isDefined(val) {
  return (typeof val !== 'undefined');
}
