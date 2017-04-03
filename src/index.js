var indexOf = require("@nathanfaucett/index_of"),
    isFunction = require("@nathanfaucett/is_function");


var AtomPrototype = Atom.prototype;


module.exports = Atom;


function Atom(value) {
    if (!(this instanceof Atom)) {
        throw new TypeError("Atom(value) must be called with new (i.e. new Atom(value))");
    }
    this._listeners = [];
    this._addListeners = [];
    this._removeListeners = [];
    this._isEmitting = false;
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

    if (this._isEmitting) {
        this._addListeners.push(callback);
    } else {
        listeners = this._listeners;
        index = indexOf(listeners, callback);

        if (index === -1) {
            listeners.push(callback);
        }
    }

    return this;
};

AtomPrototype.removeListener = function removeListener(callback) {
    var listeners, index;

    if (this._isEmitting) {
        this._removeListeners.push(callback);
    } else {
        listeners = this._listeners;
        index = indexOf(listeners, callback);

        if (index !== -1) {
            listeners.splice(index, 1);
        }
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

function Atom_addListeners(_this) {
    var listeners = _this._listeners,
        addListeners = _this._addListeners,
        i = -1,
        il = addListeners.length - 1,
        callback;

    while (i++ < il) {
        callback = addListeners[i];
        index = indexOf(listeners, callback);

        if (index === -1) {
            listeners.push(callback);
        }
    }

    addListeners.length = 0;
}

function Atom_removeListeners(_this) {
    var listeners = _this._listeners,
        removeListeners = _this._removeListeners,
        i = -1,
        il = removeListeners.length - 1;

    while (i++ < il) {
        index = indexOf(listeners, removeListeners[i]);

        if (index === -1) {
            listeners.splice(index, 1);
        }
    }

    removeListeners.length = 0;
}

function Atom_emit(_this, prev, next) {
    var listeners = _this._listeners,
        i = -1,
        il = listeners.length - 1;

    _this._isEmitting = true;

    while (i++ < il) {
        listeners[i](prev, next);
    }

    Atom_addListeners(_this);
    Atom_removeListeners(_this);

    _this._isEmitting = false;
}