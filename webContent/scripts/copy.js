/**
 * Created by solekhnovich on 08.04.2015.
 */
var Utils = Utils || {};
Utils.deepCopy = function(object) {

    var deepCopy = function(obj) {
        if (obj == null) {
            return null;
        }
        var res = obj;
        if ($.isArray(obj)) {
            res = copyArray(obj);
        } else if ($.isPlainObject(obj)) {
            res = copyObject(obj);
        } else if (obj instanceof Date) {
            res = new Date(obj);
        }
        return res;
    };
    var copyArray = function (obj) {
        var res = obj.slice();
        for (var i = 0; i < res.length; i++) {
            res[i] = deepCopy(obj[i]);
        }
        return res;
    };
    var copyObject = function (obj) {
        var res = $.extend(true, {}, obj);
        for (var name in res) {
            res[name] = deepCopy(obj[name]);
        }
        return res;
    };

    return deepCopy(object);
};