/**
 * Created by solekhnovich on 17.04.2015.
 * */
var Game = Game || {};
Game.Controller = (function () {
    var config = Game.Config;
    var resources = Game.Resources;

    function controller(board) {
        var self = this;
        self.pcOptions = ko.observableArray([
            resources.wolves,
            resources.rabbit,
            resources.none
        ]);
        self.aiLevelOptions = ko.observableArray([
            1, 2, 3, 4, 5, 6,
        ]);
        self.gameOver = ko.observable(true);
        self.startButtonText = ko.observable(resources.start);
        self.stopButtonText = ko.observable(resources.stop);
        self.pcOption = ko.observable();
        self.aiLevel = ko.observable(config.defaultAILevel);
        self.info = ko.observable();
        self.debug = ko.observable(config.debug);
        self.startGame = function () {
            board.startGame(self.pcOption(), self.aiLevel(), self.debug());
            self.gameOver(false);
        };
        self.abortGame = function () {
            board.stopGame();
            self.gameOver(true);
        };
        self.cssClass = ko.pureComputed(function () {
            return self.gameOver() ? 'gameOver' : 'gameRunning';
        });
        self.stopGame = function (message) {
            self.info(message);
            self.gameOver(true);
        };
        self.setTurnText = function (text) {
            self.info(text);
        };
        return this;
    }

    return controller;
})();
