/**
 * Created by solekhnovich on 03.04.2015.
 */
var config = Game.Config;
QUnit.test("State test", function (assert) {
    var state = new Game.State();
    var newState = new Game.State();
    var children = state.generateChildren(1);
    assert.ok($.isArray(children), "Array returned");
    assert.equal(children.length, 1, "Correct number of children");
    var v = children[0].getPegByIndex(1);
    var oldV = state.getPegByIndex(1);
    assert.ok(v.position.x != oldV.position.x && v.position.y != oldV.position.y, "Previous state untouched");
    assert.ok(v.position.x === 1 && v.position.y === 1, "Correct movement");
    newState.setState(Utils.deepCopy(state.all));
    newState.rabbit.position = {x: 1, y: 3};
    assert.equal(state.getPegByIndex(1).position.x, newState.getPegByIndex(1).position.x, "State copied!");
    assert.ok(state.rabbit.position.y != newState.rabbit.position.y, "Objects differ after copy");
});
QUnit.test("Heuristic test", function (assert) {
    var state = new Game.State();
    var h = new Game.Heuristics();
    assert.equal(h.evaluate(state), config.maxValue, "Heuristic ok, wolves on top are blocking");
    state.wolves.forEach(function (wolf) {
        wolf.position.x++;
        wolf.position.y++;
    });
    assert.equal(h.evaluate(state), config.maxValue, "Heuristic ok, wolves are blocking");
    state.rabbit.position = {x: 5, y: 3};
    var newWolvesPositions = [{x: 0, y: 2}, {x: 3, y: 3}, {x: 5, y: 1}, {x: 7, y: 1}];
    state.wolves.forEach(function (wolf, index) {
        wolf.position = newWolvesPositions[index];
    });
    assert.equal(h.evaluate(state), 3, "Heuristic ok");
});
