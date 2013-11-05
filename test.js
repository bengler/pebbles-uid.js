var Uid = require("./");
var should = require("should");

describe('Uid', function() {

  it("can parse a string into an array", function() {
    var uid = Uid.parse("post:a.b.c$1");
    uid.klass().should.equal('post');
    uid.path().should.equal('a.b.c');
    uid.oid().should.equal('1');
  });

  it("can create an Uid instance from a string", function() {
    var uid = Uid.parse("klass:path$oid");
    uid.klass().should.eql("klass");
    uid.path().should.eql("path");
    uid.oid().should.eql("oid");
    uid.toString().should.eql("klass:path$oid");
  });

  it("parses an uid with no oid correctly", function() {
    var uid = Uid.parse("klass:path");
    uid.klass().should.eql("klass");
    uid.path().should.eql("path");
    should.not.exist(uid.oid());
    uid.toString().should.eql("klass:path");
  });

  it("parses an uid with no path correctly", function() {
    var uid = Uid.parse("klass:$oid");
    uid.klass().should.eql("klass");
    should.not.exist(uid.path());
    uid.oid().should.eql("oid");
    uid.toString().should.eql("klass:$oid");
  });

  it("can be created with a string", function() {
    var uid = new Uid("klass:some.path$oid");
    uid.toString().should.eql("klass:some.path$oid");
  });
  it("can be created using parameters", function() {
    var uid;
    uid = new Uid('klass', 'some.path', 'oid');
    return uid.toString().should.eql("klass:some.path$oid");
  });
  it("raises an error if parameter is neither string or hash", function() {
    (function() {
      return Uid.parse([]);
    }).should.throw();
    (function() {
      return Uid.parse(NaN);
    }).should.throw();
    return (function() {
      return Uid.parse(Number());
    }).should.throw();
  });
  it("raises an exception when you try to create an invalid uid", function() {
    return (function() {
      return new Uid('!', 'some.path', 'oid');
    }).should.throw(Uid.InvalidUidError);
  });
  describe('Parent', function() {
    it("has a parent", function() {
      var uid = new Uid("klass:some.parent.path$oid");
      uid.parent().should.eql(new Uid("klass:some.parent$path"));
    });
    it("has a parent even without an oid", function() {
      var uid;
      uid = new Uid("klass:some.old.path");
      return uid.parent().should.eql(new Uid("klass:some.old$path"));
    });
    it("has a parent even with only one label", function() {
      var uid = new Uid("klass:some");
      return uid.parent().should.eql(Uid("klass:$some"));
    });
    return it("has a parent with a different klass", function() {
      var uid = new Uid("klass:some.old.path$oid");
      return uid.parent().klass('otherklass').should.eql(Uid.parse("otherklass:some.old$path"));
    });
  });
  describe('Children', function() {
    it("has children", function() {
      return Uid("klass:some.old.path$oid").children().should.eql(Uid("klass:some.old.path.oid"));
    });
    return it("has children with a different klass", function() {
      var uid;
      uid = new Uid("klass:some.old.path$oid");
      return uid.children().klass('otherklass').should.eql(Uid("otherklass:some.old.path.oid"));
    });
  });
  describe('ChildPath', function() {
    return it("has a childPath", function() {
      var uid = new Uid("klass:some.old.path$oid");
      return uid.children().path().should.eql("some.old.path.oid");
    });
  });
  describe("klass", function() {
    var path_oid;
    path_oid = "path$oid";
    return it("allows sub-klasses", function() {
      (function() {
        return Uid.parse("sub.sub.class:" + path_oid);
      }).should.not.throw();
      describe("is valid", function() {
        var c;
        return ((function() {
          var _i, _len, _ref1, _results;
          _ref1 = '.-_8';
          _results = [];
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            c = _ref1[_i];
            _results.push(c);
          }
          return _results;
        })()).forEach(function(nice_character) {
              return it("with '" + nice_character + "'", function() {
                return (function() {
                  return Uid.parse("a" + nice_character + "b:" + path_oid);
                }).should.not.throw();
              });
            });
      });
      return describe("is invalid", function() {
        var c;
        return ((function() {
          var _i, _len, _ref1, _results;
          _ref1 = '!/:$%';
          _results = [];
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            c = _ref1[_i];
            _results.push(c);
          }
          return _results;
        })()).forEach(function(funky_character) {
              return it("with '" + funky_character + "'", function() {
                return (function() {
                  return Uid.parse("a" + funky_character + "b:" + path_oid);
                }).should.throw(Uid.InvalidUidError);
              });
            });
      });
    });
  });
  describe("oid", function() {
    ["abc123", "abc123!@\#$%^&*()[]{}", "abc 123", "alice@example.com", "abc/123", "post:some.path$oid"].forEach(function(oid) {
      return it("'" + oid + "' is a valid oid if escaped", function() {
        return Uid.isValidOid(encodeURIComponent(oid)).should.be.true;
      });
    });
    it("'abc/123' is an invalid oid", function() {
      Uid.isValidOid('abc/123').should.be.false;
    });
    it("can be missing", function() {
      should.not.exist(Uid.parse('klass:path').oid());
    });
    it("is not valid if it is null", function() {
      Uid.isValidOid(null).should.be.false;
    });
  });
  it("rejects invalid labels for klass", function() {
    Uid.isValidKlass("abc123").should.be.true;
    Uid.isValidKlass("abc123!").should.be.false;
    Uid.isValidKlass("").should.be.false;
  });
  describe("path", function() {
    it("accepts valid paths", function() {
      Uid.isValidPath("abc123").should.be.true;
      Uid.isValidPath("abc.123").should.be.true;
      Uid.isValidPath("abc.de-f.123").should.be.true;
    });
    return it("rejects invalid paths", function() {
      Uid.isValidPath("abc!.").should.be.false;
      Uid.isValidPath(".").should.be.false;
      Uid.isValidPath("ab. 123").should.be.false;
    });
  });
  it("knows how to parse in place", function() {
    Uid.split("klass:path$oid").should.eql(['klass', 'path', 'oid']);
    Uid.split("post:this.is.a.path.to$object_id").should.eql(['post', 'this.is.a.path.to', 'object_id']);
    Uid.split("post:$object_id").should.eql(['post', null, 'object_id']);
  });
  it("knows the valid uids from the invalid ones", function() {
    Uid.isValid("*$ f\34%$#!!!").should.be.false;
    Uid.isValid("").should.be.false;
    Uid.isValid("d$f").should.be.false;
    Uid.isValid("abc").should.be.false;
    Uid.isValid("bang:").should.be.true;
    Uid.isValid(":bang").should.be.true;
    Uid.isValid(":bang$paff").should.be.true;
    Uid.isValid("$paff").should.be.false;
    Uid.isValid("a:b.c.d$e").should.be.true;
    Uid.isValid("a:$e").should.be.true;
    Uid.isValid("a:b.c.d").should.be.true;
  });

  describe("equality", function() {
    var uid = "klass:realm$3";
    it("is dependent on the actual uid", function() {
      Uid("klass:realm$3").should.eql(new Uid("klass:realm$3"));
    });
    it("also works for ==", function() {
      Uid.parse("klass:realm$3").should.eql(new Uid("klass:realm$3"));
    });
  });
});