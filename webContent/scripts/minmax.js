/**
 * Created by solekhnovich on 08.04.2015.
 */
var Game = Game || {};
Game.MinMax = (function () {
    var config = Game.Config;

    function minMax(heuristics) {
        var self = this;
        var debug;
        self.setDebug = function (value) {
            debug = value;
        };
        self.run = function (state, isWolf, aiLevel) {
            var bestMove = {};
            var alternativeMove = {};
            var v = isWolf ? config.minValue : config.maxValue;
            var alpha = config.minValue;
            var beta = config.maxValue;
            var tmp;
            var i;
            var from = isWolf ? 1 : 0;
            var to = isWolf ? 5 : 1;
            var moves = [];
            for (i = from; i < to; i++) {
                moves.push({pegIndex: i, moves: state.movesAvailable(i)});
            }
            debugOutput(config.debugClear);

            for (var moveIndex in moves) {
                var move = moves[moveIndex];
                if (isWolf) {
                    for (i in move.moves) {
                        tmp = value(
                            state.generateChild(move.pegIndex, move.moves[i]),
                            aiLevel - 1,
                            0,
                            alpha,
                            beta
                        );
                        debugOutput(
                            config.debugAppend,
                            'wolf' + move.pegIndex + ': ' + move.moves[i].x + ',' + move.moves[i].y + ': ' + tmp + '\n'
                        );
                        if (tmp > v) {
                            v = tmp;
                            bestMove.pegIndex = move.pegIndex;
                            bestMove.position = move.moves[i];
                        }
                        if (tmp >= v) {
                            alternativeMove.pegIndex = move.pegIndex;
                            alternativeMove.position = move.moves[i];
                        }
                        if (v > beta) {
                            return bestMove;
                        }
                        alpha = Math.max(alpha, v);
                    }
                    if (bestMove.pegIndex == null) {
                        bestMove = alternativeMove;
                    }
                } else {
                    bestMove.pegIndex = 0;
                    for (i in move.moves) {
                        tmp = value(
                            state.generateChild(move.pegIndex, move.moves[i]),
                            aiLevel - 1,
                            state.getPegCount() - 1,
                            alpha,
                            beta
                        );
                        debugOutput(
                            config.debugAppend,
                            '' + move.moves[i].x + ',' + move.moves[i].y + ': ' + tmp + '\n'
                        );
                        if (tmp < v) {
                            v = tmp;
                            bestMove.position = move.moves[i];
                        }
                        if (v <= alpha) {
                            return bestMove;
                        }
                        beta = Math.min(beta, v);
                    }
                    if (bestMove.position == null) {
                        for (i = move.moves.length; i > 0; i--) {
                            if (move.moves[i - 1].y < state.rabbit.position.y) {
                                bestMove.position = move.moves[i - 1];
                                break;
                            }
                        }
                    }
                    if (bestMove.position == null) {
                        bestMove.position = move.moves[0];
                    }
                }
            }
            debugOutput(
                config.debugAppend,
                'moves to: ' + bestMove.position.x + ',' + bestMove.position.y + '\n'
            );
            return bestMove;
        };
        var value = function (state, depth, index, alpha, beta) {
            if (state.getGameOverMessage() != null || depth === 0) {
                var res = heuristics.evaluate(state);
                return res;
            }
            if (index === 0) {
                return max(state, depth - 1, state.getPegCount() - 1, alpha, beta);
            } else {
                return min(state, depth, 0, alpha, beta);
            }
        };
        var max = function (state, depth, index, alpha, beta) {
            var v = config.minValue;
            var children = state.generateChildren(0);
            for (var i in children) {
                var child = children[i];
                v = Math.max(v, value(child, depth, index - 1, alpha, beta));
                if (v >= beta) {
                    return v;
                }
                alpha = Math.max(alpha, v);
            }
            return v;
        };
        var min = function (state, depth, index, alpha, beta) {
            var v = config.maxValue;
            var children = state.generateChildren(index);
            for (var i in children) {
                var child = children[i];
                v = Math.min(v, value(child, depth - 1, state.getPegCount() - 1, alpha, beta));
                if (v <= alpha) {
                    return v;
                }
                beta = Math.min(beta, v);
            }
            return v;
        };
        var debugOutput = function (action, text) {
            if (!debug) {
                return;
            }
            var debugField = $('#' + config.debugId);
            switch (action) {
                case config.debugAppend:
                    debugField.append(text);
                    break;
                case config.debugClear:
                    debugField.text('');
                    break;
            }
        };

        return this;
    }

    return minMax;
})();