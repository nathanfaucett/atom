var indexOf = require("index_of"),
    fastSlice = require("fast_slice"),
    isFunction = require("is_function");


module.exports = createAtom;


function createAtom(value) {
    var watchers = [],
        atom;

    function emit(atom, prev, next) {
        var i = -1,
            il = watchers.length - 1;

        while (i++ < il) {
            watchers[i](atom, prev, next);
        }
    }

    function swap(next) {
        var prev = value;
        value = next;
        emit(atom, prev, next);
    }

    atom = {
        watch: function(callback) {
            var index;

            if (!isFunction(callback)) {
                throw new TypeError("watch(callback) callback must be a function");
            }

            index = indexOf(watchers, callback);

            if (index === -1) {
                watchers[watchers.length] = callback;
            }
        },

        removeWatch: function(callback) {
            var index = indexOf(watchers, callback);

            if (index !== -1) {
                watchers.splice(index, 1);
            }
        },

        swap: function(fn) {
            if (!isFunction(fn)) {
                throw new TypeError("swap(fn) fn must be a function");
            } else {
                swap(fn.apply(null, [value].concat(fastSlice(arguments, 1))));
            }
        },

        reset: function(value) {
            swap(value);
        },

        deref: function() {
            return value;
        }
    };

    return atom;
}
