var tape = require("tape"),
    Atom = global.Atom = require("..");


tape("should update atom value calling fn passing current value", function(assert) {
    var atom = new Atom({
        key: "key"
    });

    function onUpdate(prev, next) {
        assert.deepEqual(prev, {
            key: "key"
        });
        assert.deepEqual(next, {
            key: "key",
            value: "value"
        });
    }

    function update(current) {
        return {
            key: current.key,
            value: "value"
        };
    }

    atom.addListener(onUpdate);
    atom.update(update);

    assert.deepEqual(atom.get(), {
        key: "key",
        value: "value"
    });

    assert.end();
});

tape("should throw error if not called with new", function(assert) {
    try {
        Atom({
            key: "key"
        });
    } catch (e) {
        assert.equals(!!e, true);
    }
    assert.end();
});

tape("should throw error if addListener not passed function", function(assert) {
    var atom = new Atom({
        key: "key"
    });

    try {
        atom.addListener(null);
    } catch (e) {
        assert.equals(!!e, true);
    }
    assert.end();
});

tape("should throw error if update not passed function", function(assert) {
    var atom = new Atom({
        key: "key"
    });

    try {
        atom.update(null);
    } catch (e) {
        assert.equals(!!e, true);
    }
    assert.end();
});

tape("should not call onUpdate if listener removed", function(assert) {
    var atom = new Atom({
            key: "key"
        }),
        called = false;

    function onUpdate( /* prev, next */ ) {
        called = true;
    }

    function update(current) {
        return {
            key: current.key,
            value: "value"
        };
    }

    atom.addListener(onUpdate);
    atom.removeListener(onUpdate);
    atom.update(update);

    assert.equal(called, false);

    assert.end();
});

tape("should ignore remove if listener not in atom", function(assert) {
    var atom = new Atom(null);
    atom.removeListener(function empty() {});
    assert.end();
});

tape("should ignore add if listener is already in atom", function(assert) {
    var atom = new Atom(null);

    function empty() {}
    atom.addListener(empty);
    atom.addListener(empty);
    assert.end();
});