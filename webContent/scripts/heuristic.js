/**
 * Created by solekhnovich on 10.04.2015.
 */
var Game = Game || {};
Game.Heuristics = (function () {
    var config = Game.Config;

    function heuristics() {
        var self = this;
        var map = [];
        self.evaluate = function (state) {
            var rabbit = state.rabbit;
            if (rabbit.position.y === 0) {
                return 0;
            }
            clearMap();
            var q = new Utils.Queue();
            q.push(rabbit.position);
            map[rabbit.position.x][rabbit.position.y] = 0;
            while (!q.isEmpty()) {
                var curPos = q.pop();
                state.rabbitMovesAvailable(curPos).forEach(function (pos) {
                    if (map[pos.x][pos.y] != null) {
                        return;
                    }
                    map[pos.x][pos.y] = map[curPos.x][curPos.y] + 1;
                    q.push(pos);
                });
            }
            var min = config.maxValue;
            for (var i = 0; i < 4; i++) {
                if (map[i * 2][0] != null && map[i * 2][0] < min) {
                    min = map[i * 2][0];
                }
            }
            return min;
        };
        self.paint = function (state) {
            console.log(self.evaluate(state));
            var selector;
            for (var i = 0; i < 8; i++) {
                for (var j = 0; j < 8; j++) {
                    selector = '#text_' + j + i;
                    $(selector).text(map[j][i] == null ? '' : map[j][i]);
                }
            }
            clearMap();
        };
        var clearMap = function () {
            for (var i = 0; i < map.length; i++) {
                for (var j = 0; j < map[i].length; j++) {
                    map[i][j] = null;
                }
            }
        };
        var initMap = function () {
            for (var i = 0; i < 8; i++) {
                var row = [];
                for (var j = 0; j < 8; j++) {
                    row.push(null);
                }
                map.push(row);
            }
        };
        initMap();
        return this;
    }

    return heuristics;
})();