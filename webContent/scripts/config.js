/**
 * Created by solekhnovich on 06.04.2015.
 */
var Game = Game || {};
Game.Config = (function () {
    return {
        cellClass: 'cell',
        cellId: 'cell_',
        pegClass: 'peg',
        pegId: 'peg_',
        wolfClass: 'wolf',
        wolfMoves: ['dr', 'dl'],
        rabbitClass: 'rabbit',
        rabbitMoves: ['ur', 'dr', 'dl', 'ul'],
        separator: '_',
        selectedClass: 'selected',
        debugAppend: 'append',
        debugClear: 'clear',
        debugId: 'debug',
        debug: false,
        showHeuristic: false,
        defaultAILevel: '3',
        minValue: 0,
        maxValue: 255
    }
})();