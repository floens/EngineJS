(function(global) {
'use strict';
/**
 *     ______            _          
 *    / ____/___  ____ _(_)___  ___ 
 *   / __/ / __ \/ __ `/ / __ \/ _ \
 *  / /___/ / / / /_/ / / / / /  __/
 * /_____/_/ /_/\__, /_/_/ /_/\___/ 
 *             /____/               
 */


var Engine = {};

var _tickFunction = null,
    _loadOptions = null,
    _loadFunction = null,
    _paused = false;

Engine.setOptions = function(options) {
    _loadOptions = options;
}

Engine.load = function(e) {
    _loadFunction = e;
}

Engine.tick = function(callback) {
    _tickFunction = callback;
}

Engine.init = function() {
    _init();
}

Engine.pause = function() {
    _paused = true;
}

Engine.resume = function() {
    _paused = false;
}

var _init = function() {
    _tickLoop();

    // Start the user's load function
    if (_loadFunction != null) _loadFunction();
}


/**
 * Tick
 */
var _doTick = function() {
    if (_paused) return;

    // NetManager.tick();

    if (_tickFunction != null) _tickFunction();
}

/**
 * Tick loop
 */
var _tickUnprocessed = 0,
    _tickLastTime = 0;
var _tickLoop = function() {
    if (_tickLastTime == 0) _tickLastTime = _getNow();

    _tickUnprocessed += (_getNow() - _tickLastTime) / (1000 / 60);

    // After sleep etc. browser may hang
    if (_tickUnprocessed > 600) _tickUnprocessed = 0;

    while (_tickUnprocessed >= 1) {
        _tickUnprocessed -= 1;
        _doTick();
    }

    _tickLastTime = _getNow();

    setTimeout(_tickLoop, 1000 / 60);
}

var _getNow = function() {
    var time = process.hrtime();
    return time[0] * 1e3 + time[1] * 1e-6
}


global.Engine = Engine;

})(global);