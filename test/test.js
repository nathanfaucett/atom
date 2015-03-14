var assert = require("assert"),
    Atom = require("../src/index");


describe("Atom(initial_value : Any)", function() {
    describe("#swap(fn : Function)", function() {
        it("should swap atom value calling fn passing current value", function() {
            var atom = new Atom({
                key: "key"
            });

            atom.watch(function(prev, next) {
                assert.deepEqual(prev, {
                    key: "key"
                });
                assert.deepEqual(next, {
                    key: "key",
                    value: "value"
                });
            });

            atom.swap(function(current) {
                return {
                    key: current.key,
                    value: "value"
                };
            });
        });
    });
});
