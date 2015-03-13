var assert = require("assert"),
    createAtom = require("../src/index");


describe("createAtom(initial_value : Any)", function() {
    describe("swap(fn : Function)", function() {
        it("should swap atom value calling fn passing current value", function() {
            var atom = createAtom({
                key: "key"
            });

            atom.watch(function(atom, prev, next) {
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
