/**
 * Created by solekhnovich on 03.04.2015.
 */
var Utils = Utils || {};
Utils.Queue = (function () {
    function queue() {
        var self = this;
        var arr = [];
        self.push = function (value) {
            arr.push(value);
        };
        self.pop = function () {
            if (self.isEmpty()) {
                return null;
            }
            return arr.shift();
        };
        self.isEmpty = function () {
            return arr.length === 0;
        };
        self.toString = function () {
            if (arr.length === 0) {
                return '[]';
            }
            var res = '[' + arr[0];
            for (var i = 1; i < arr.length; i++) {
                res += ', ' + arr[i];
            }
            res += ']';
            return res;
        }
        return this;
    }

    return queue;
})();