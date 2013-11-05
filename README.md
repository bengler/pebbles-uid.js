# Usage

```
var Uid = require("pebbles-uid");

var parent = Uid("foo.bar:baz.qux.quux$garply")

var children = parent
    .children()
    .with("klass", "child.klass");

console.log(""+parent +" is parent of "+children);
```

# Gotchas

 Constructing uids with missing values for `klass`, `path` or `oid` will not throw an error. However, trying to construct
 an uid with invalid values for any of these parts will throw an error.

 This means:

`new Uid({path: "a.b.c"})` will not fail, but `new Uid({klass: "$what"})` will.