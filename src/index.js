var indexOf = require("index_of"),
    fastSlice = require("fast_slice"),
    isFunction = require("is_function");


var AtomPrototype = Atom.prototype;


module.exports = Atom;


function Atom(value) {
    this.__watchers = [];
    this.__value = value;
}

AtomPrototype.watch = function(callback) {
    var watchers, index;

    if (!isFunction(callback)) {
        throw new TypeError("watch(callback) callback must be a function");
    }

    watchers = this.__watchers;
    index = indexOf(watchers, callback);

    if (index === -1) {
        watchers[watchers.length] = callback;
    }

    return this;
};

AtomPrototype.removeWatch = function(callback) {
    var watchers = this.__watchers,
        index = indexOf(watchers, callback);

    if (index !== -1) {
        watchers.splice(index, 1);
    }

    return this;
};

AtomPrototype.swap = function(fn) {
    if (!isFunction(fn)) {
        throw new TypeError("swap(fn) fn must be a function");
    } else {
        Atom_swap(this, fn.apply(null, [this.__value].concat(fastSlice(arguments, 1))));
    }
    return this;
};

AtomPrototype.set = function(value) {
    Atom_swap(this, value);
    return this;
};

AtomPrototype.deref = function() {
    return this.__value;
};

function Atom_swap(_this, next) {
    var prev = _this.__value;
    _this.__value = next;
    Atom_emit(_this, prev, next);
}

function Atom_emit(_this, prev, next) {
    var watchers = _this.__watchers,
        i = -1,
        il = watchers.length - 1;

    while (i++ < il) {
        watchers[i](prev, next);
    }
}
