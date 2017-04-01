Atom
=======

clojure like atom for the browser and node.js

```javascript
var Atom = require("@nathanfaucett/atom");


var atom = Atom({
  key: null
});

atom.addListener(function onChange(prev, next) {
  // use prev and next state
});

atom.update(function update(current) {
  return {
    key: "value"
  }
});
console.log(atom.get()); // { key: "value" }

atom.set({
  key: null
});
console.log(atom.get()); // { key: null }


```
