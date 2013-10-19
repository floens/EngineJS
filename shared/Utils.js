(function(global) {
'use strict';

/**
 * @namespace Utils
 */

Function.prototype.extend = function(object) {
    try {
        this.prototype = Object.create(object.prototype);
        this.prototype.parent = object.prototype;
        return this;
    } catch(err) {
    }
}

Array.prototype.remove = function(e) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] === e) {
            this.splice(i, 1);
            return true;
        }
    }

    return false;
}

global.requestAnimationFrame = (function(){
    return global.requestAnimationFrame || 
        global.webkitRequestAnimationFrame || 
        global.mozRequestAnimationFrame || 
        global.oRequestAnimationFrame || 
        global.msRequestAnimationFrame || 
        function(callback) {
            global.setTimeout(callback, 1000 / 60);
        };
})();

global.Map = function() {
    this.map = {};
}

Map.prototype.get = function(key) {
    var value = this.map[key];
    if (value == undefined) return null;
    return value;
}

Map.prototype.set = function(key, value) {
    this.map[key] = value;
}

Map.prototype.remove = function(key) {
    delete this.map[key];
}

Map.prototype.has = function(key) {
    return this.map[key] != undefined;
}

Map.prototype.clear = function() {
    this.map = {};
}

Map.prototype.keys = function() {
    return Object.keys(this.map);
}

global.Random = {};
Random.float = function() {
    return Math.random();
}

Random.evenFloat = function() {
    return Math.random() - Math.random();
}

Random.int = function(max) {
    return Math.floor(Math.random() * max);
}

global.Vec2 = function(x, y) {
    this.x = x;
    this.y = y;
}

global.Vec3 = function(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
}

global.Vec4 = function(x, y, z, a) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.a = a;
}

/**
 * Log a message in the console
 * @param  {String | Object} loggable What to log
 * @param  {boolean | enum}  level    If passed true, log it directly without time. 
 *                                     This is useful for when you want object to be inspectable.
 *                                     Otherwise enum log.INFO, log.WARN or log.ERROR
 */
global.log = function(loggable, level) {
    // You can pas a level (log.WARN) or direct mode (true) as second argument
    if (level === true) {
        _doLog(loggable);
        return;
    }

    var prefix = '',
        color = '';

    if (level == log.WARN) {
        prefix = 'WARNING';
        if (SERVER) color = '\u001b[31m';
    } else if (level == log.ERROR) {
        prefix = 'ERROR';
        if (SERVER) color = '\u001b[31m';
    } else {
        prefix = 'INFO';
    }

    var now = new Date();

    var mo = (now.getMonth() + 1).toString(),
        d  = now.getDate().toString(),
        h  = now.getHours().toString(),
        mi = now.getMinutes().toString(),
        s  = now.getSeconds().toString();

    if (mo.length == 1) mo = '0' + mo;
    if ( d.length == 1)  d = '0' + d;
    if ( h.length == 1)  h = '0' + h;
    if (mi.length == 1) mi = '0' + mi;
    if ( s.length == 1)  s = '0' + s;

    var finalMessage = color + d + '-' + mo + ' ' + h + ':' + mi + ':' + s + ' [' + prefix + '] ' + loggable;
    if (color.length > 0) {
        finalMessage += '\u001b[37m';
    }
    
    _doLog(finalMessage);
}
log.INFO = 0;
log.WARN = 1;
log.ERROR = 2;

var _doLog = function(e) {
    // Shared: browser may not have console
    if (global.console && global.console.log) {
        if (e instanceof Error) {
            if (global.console.dir) {
                global.console.dir(e);
                if (e.stack) global.console.log(e.stack);
            } else {
                global.console.log(e);
            }
        } else {
            global.console.log(e);
        }
    }
}

global.Utils = {};
Utils.interpolateLinear = function(a, b, x) {
    if (x < 0 || x > 1) throw new RangeError('Interpolation out of bounds.');
    return a + (b - a) * x;
}

Utils.interpolateCosine = function(a, b, x) {
    if (x < 0 || x > 1) throw new RangeError('Interpolation out of bounds.');
    var xx = (1 - Math.cos(x * Math.PI)) / 2;
    return (a * (1 - xx) + b * xx);
}

Utils.isNumber = function(e) {
    return typeof(e) === 'number' && isFinite(e) && !isNaN(e);
}

Utils.isString = function(e) {
    return typeof(e) === 'string';
}

Utils.isArray = function(e) {
    return Array.isArray(e);
}

Utils.removeWhitespace = function(value) {
    return value.replace(/^\s+/g, '');
}

Utils.isValidCharacter = function(string) {
    var value = string.charCodeAt(0);

    return value >= 32;
}

Utils.filterString = function(string) {
    var removedWhitespace = Utils.removeWhitespace(string);

    var newString = '';

    for (var i = 0; i < removedWhitespace.length; i++) {
        if (Utils.isValidCharacter(removedWhitespace[i])) {
            newString += removedWhitespace[i];
        }
    }

    return newString;
}

})(global);
