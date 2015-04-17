/**
 * Created by solekhnovich on 03.04.2015.
 */
$(document).ready(function () {
    var gameBoard = new Game.Board();
    var controller = new Game.Controller(gameBoard);
    gameBoard.setController(controller);
    ko.applyBindings(controller, document.getElementById('controller'));
    var config = Game.Config;
    var screenBoard = $('#board');
    for (var i = 0; i < 8; i++) {
        for (var j = 0; j < 8; j++) {
            var cell = $('<div></div>');
            cell.addClass((i + j) % 2 != 0 ? 'white' : 'black');
            cell.addClass(config.cellClass);
            var text = $('<span></span>');
            text.attr('id', 'text_' + j + i);
            var peg = $('<div></div>');
            peg.addClass(config.pegClass);
            var pegId = config.pegId + j + i;
            peg.attr('id', pegId);
            cell.append(peg);
            cell.append(text);
            var cellId = config.cellId + j + i;
            cell.attr('id', cellId);
            cell.click(gameBoard.processClick(cellId));
            screenBoard.append(cell);
        }
    }
    gameBoard.init();
});
