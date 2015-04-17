/**
 * Created by solekhnovich on 08.04.2015.
 */
var Game = Game || {};
Game.State = (function () {
    var config = Game.Config;
    var resources = Game.Resources;

    function state() {
        var self = this;
        var heuristic = new Game.Heuristics();
        var minmax = new Game.MinMax(heuristic);
        var gameOver;
        var arr = [];
        var aiLevel;
        var setDefaultState = function () {
            arr = [];
            arr.push({type: config.rabbitClass, position: {x: 3, y: 7}, selected: false, index: 0});
            arr.push({type: config.wolfClass, position: {x: 0, y: 0}, selected: false, index: 1});
            arr.push({type: config.wolfClass, position: {x: 2, y: 0}, selected: false, index: 2});
            arr.push({type: config.wolfClass, position: {x: 4, y: 0}, selected: false, index: 3});
            arr.push({type: config.wolfClass, position: {x: 6, y: 0}, selected: false, index: 4});
        };
        var updateIndices = function () {
            self.rabbit = arr[0];
            self.wolves = arr.slice(1);
            self.all = arr;
        };
        self.setState = function (newState) {
            arr = newState;
            updateIndices();
        };
        self.setDebug = function(value){
            minmax.setDebug(value);
        };
        self.init = function () {
            gameOver = false;
            setDefaultState();
            updateIndices();
        };
        self.setAiLevel = function (ailevel) {
            aiLevel = ailevel;
        };
        self.getPegByIndex = function (index) {
            return arr[index];
        };
        self.getGameOverMessage = function () {
            if (movesAvailable(self.rabbit).length === 0) {
                return resources.rabbitLose;
            } else if (self.rabbit.position.y === 0) {
                return resources.rabbitWin;
            }
            return null;
        };
        self.rabbitMovesAvailable = function (position) {
            return checkMoves(position, config.rabbitMoves);
        };
        self.tryToMovePeg = function (position) {
            for (var i in arr) {
                var peg = arr[i];
                if (peg.selected) {
                    var moves = movesAvailable(peg);
                    for (var move in moves) {
                        if (position.x === moves[move].x && position.y === moves[move].y) {
                            var position = {x: peg.position.x, y: peg.position.y};
                            movePeg(peg, moves[move]);
                            return {oldPosition: position, peg: peg};
                        }
                    }
                }
            }
            return null;
        };
        self.generateChildren = function (pegIndex) {
            var res = [];
            movesAvailable(arr[pegIndex]).forEach(function (move) {
                var child = self.generateChild(pegIndex, move);
                res.push(child);
            });
            return res;
        };
        self.generateChild = function (pegIndex, position) {
            var child = new Game.State();
            var newState = Utils.deepCopy(arr);
            newState[pegIndex].position = position;
            child.setState(newState);
            return child;
        };
        self.getPegCount = function () {
            return arr.length;
        };
        self.movesAvailable = function (pegIndex) {
            return movesAvailable(arr[pegIndex]);
        };
        self.moveRabbit = function () {
            var move = minmax.run(self, false, aiLevel);
            if (move.position != null) {
                var position = {x: self.rabbit.position.x, y: self.rabbit.position.y};
                movePeg(self.rabbit, move.position);
                return {oldPosition: position, peg: self.rabbit};
            } else {
                alert("Something is wrong!");
            }
        };
        self.moveWolf = function () {
            var move = minmax.run(self, true, aiLevel);
            if (move.position != null) {
                var peg = arr[move.pegIndex];
                var position = {x: peg.position.x, y: peg.position.y};
                movePeg(peg, move.position);
                return {oldPosition: position, peg: peg};
            } else {
                alert("Something is wrong!");
            }
        };
        self.showHeuristic = function () {
            heuristic.paint(self);
        };
        self.init();

        var movesAvailable = function (peg) {
            var directions = peg.type === config.rabbitClass ? config.rabbitMoves : config.wolfMoves;
            return checkMoves(peg.position, directions);
        };
        var checkMoves = function (position, directions) {
            var moves = [];
            var x = position.x;
            var y = position.y;
            directions.forEach(function (direction) {
                switch (direction) {
                    case 'ur':
                        if (validPosition({x: x + 1, y: y - 1})) {
                            moves.push({x: x + 1, y: y - 1});
                        }
                        break;
                    case 'dr':
                        if (validPosition({x: x + 1, y: y + 1})) {
                            moves.push({x: x + 1, y: y + 1});
                        }
                        break;
                    case 'dl':
                        if (validPosition({x: x - 1, y: y + 1})) {
                            moves.push({x: x - 1, y: y + 1});
                        }
                        break;
                    case 'ul':
                        if (validPosition({x: x - 1, y: y - 1})) {
                            moves.push({x: x - 1, y: y - 1});
                        }
                        break;
                }
            });
            return moves;
        };
        var movePeg = function (peg, position) {
            peg.selected = false;
            peg.position = position;
        };
        var validPosition = function (position) {
            var x = position.x;
            var y = position.y;
            if (x < 0 || x > 7 || y < 0 || y > 7) {
                return false;
            }
            for (var i in arr) {
                if (arr[i].position.x === x && arr[i].position.y === y) {
                    return false;
                }
            }
            return true;
        };

        return this;
    }

    return state;
})();