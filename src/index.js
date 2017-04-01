var indexOf = require("@nathanfaucett/index_of"),
    isFunction = require("@nathanfaucett/is_function");


var AtomPrototype = Atom.prototype;


module.exports = Atom;


function Atom(value) {
    if (!(this instanceof Atom)) {
        throw new TypeError("Atom(value) must be called with new (i.e. new Atom(value))");
    }
    this._listeners = [];
    this._value = value;
}

AtomPrototype.get = function get() {
    return this._value;
};

AtomPrototype.set = function set(next) {
    var prev = this._value;
    this._value = next;
    return Atom_emit(this, prev, next);
};

AtomPrototype.addListener = function addListener(callback) {
    var listeners, index;

    if (!isFunction(callback)) {
        throw new TypeError("addListener(callback) callback must be a function");
    }

    listeners = this._listeners;
    index = indexOf(listeners, callback);

    if (index === -1) {
        listeners[listeners.length] = callback;
    }

    return this;
};

AtomPrototype.removeListener = function removeListener(callback) {
    var listeners = this._listeners,
        index = indexOf(listeners, callback);

    if (index !== -1) {
        listeners.splice(index, 1);
    }

    return this;
};

AtomPrototype.update = function update(fn) {
    if (!isFunction(fn)) {
        throw new TypeError("update(fn) fn must be a function");
    } else {
        return this.set(fn(this._value));
    }
};

function Atom_emit(_this, prev, next) {
    var listeners = _this._listeners,
        i = -1,
        il = listeners.length - 1;

    while (i++ < il) {
        listeners[i](prev, next);
    }
}