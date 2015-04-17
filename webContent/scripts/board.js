/**
 * Created by solekhnovich on 03.04.2015.
 */
var Game = Game || {};
Game.Board = (function () {
    var config = Game.Config;
    var resources = Game.Resources;

    function Board() {

        var self = this;
        var gameOver;
        var playerType;
        var controller;
        var wolfMoves = false;
        var state = new Game.State();

        self.init = function () {
            init();
        };
        self.processClick = function (id) {
            return function () {
                if (gameOver) {
                    return;
                }
                var o = {
                    type: id.split(config.separator)[0],
                    position: {
                        x: parseInt(id.split(config.separator)[1][0]),
                        y: parseInt(id.split(config.separator)[1][1])
                    }
                };
                if (clickField(o)) {
                    return;
                }
                state.all.forEach(function (peg) {
                    if (peg.position.x === o.position.x && peg.position.y === o.position.y) {
                        clickPeg(peg);
                    } else {
                        deselectPeg(peg);
                    }
                });
            }
        };
        self.startGame = function (player, aiLevel, debug) {
            init();
            playerType = player;
            gameOver = false;
            state.setAiLevel(parseInt(aiLevel));
            state.setDebug(debug);
            controller.setTurnText(resources.turn + (playerType === resources.wolves ? resources.wolves : resources.rabbit));
            if (playerType === resources.wolves) {
                moveRabbit();
            }
        };
        self.stopGame = function () {
            gameOver = true;
        };
        self.setController = function (c) {
            controller = c;
        };

        var init = function () {
            clear();
            gameOver = true;
            wolfMoves = false;
            state.init();
            redraw();
        };

        var clickPeg = function (peg) {
            if (peg.type === config.wolfClass && !wolfMoves
                || peg.type === config.rabbitClass && wolfMoves) {
                return;
            }
            if (!peg.selected) {
                selectPeg(peg);
            } else {
                deselectPeg(peg);
            }
        };

        var getPegId = function (position) {
            return '#' + config.pegId + position.x + position.y;
        };

        var selectPeg = function (peg) {
            if (peg.selected) {
                return;
            }
            peg.selected = true;
            $(getPegId(peg.position)).addClass(config.selectedClass);
        };

        var deselectPeg = function (peg) {
            if (!peg.selected) {
                return;
            }
            peg.selected = false;
            $(getPegId(peg.position)).removeClass(config.selectedClass);
        };

        var clickField = function (o) {
            var moved = state.tryToMovePeg(o.position);
            if (moved != null) {
                movePeg(moved.peg, moved.oldPosition);
                testGameOver();
                if (moved.peg.type === config.wolfClass && !gameOver) {
                    moveRabbit();
                    testGameOver();
                }
                if (moved.peg.type === config.rabbitClass && !gameOver) {
                    moveWolf();
                    testGameOver();
                }
                if (config.showHeuristic) {
                    state.showHeuristic();
                }
                return true;
            }
            return false;
        };

        var movePeg = function (peg, oldPosition) {
            controller.setTurnText(resources.turn + (peg.type === config.wolfClass ? resources.rabbit : resources.wolves));
            $(getPegId(oldPosition)).removeClass(config.selectedClass + ' ' + peg.type);
            $(getPegId(peg.position)).addClass(peg.type);
        };

        var moveWolf = function () {
            var moved = state.moveWolf();
            movePeg(moved.peg, moved.oldPosition);
            wolfMoves = false;
        };

        var moveRabbit = function () {
            var moved = state.moveRabbit();
            movePeg(moved.peg, moved.oldPosition);
            wolfMoves = true;
        };

        var testGameOver = function () {
            var mes = state.getGameOverMessage();
            if (mes == null) {
                return;
            }
            gameOver = true;
            controller.stopGame(mes);
        };
        var clear = function () {
            state.all.forEach(function (peg) {
                $(getPegId(peg.position)).removeClass(peg.type);
            });
        };
        var redraw = function () {
            state.all.forEach(function (peg) {
                $(getPegId(peg.position)).addClass(peg.type);
            });
        };

        return this;
    }

    return Board;
})
();