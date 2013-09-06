(function(global, undefined) {
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

var _loadFunction = null,
    _tickFunction = null,
    _renderFunction = null,
    _loadOptions = null,
    _started = false,
    _paused = false,
    _debugOverlay = null;

Engine.setOptions = function(options) {
    _loadOptions = options;
}

Engine.load = function(callback) {
    _loadFunction = callback;
}

Engine.tick = function(callback) {
    _tickFunction = callback;
}

Engine.render = function(callback) {
    _renderFunction = callback;
}

Engine.pause = function() {
    _paused = true;
}

Engine.resume = function() {
    _paused = false;
}

var _init = function() {
    if (_started == true) return;
    _started = true;

    log('Initializing.');


    if (!_loadOptions || typeof(_loadOptions.containerElement) != 'string') {
        throw new Error('Initialize: Specify the container element id via optionsObject.containerElement in Engine.setOptions(optionsObject).');
    }

    var container = document.getElementById(_loadOptions.containerElement);
    if (!container) throw new Error('Initialize: Element with id ' + _loadOptions.containerElement + ' not found.');

    Screen.containerElement = container;
    container.innerHTML = '';

    if (!_checkBrowserRequirements()) return;

    Input.setMouseTarget(Screen.containerElement);

    _debugOverlay = new Canvas(200, 120, 100);

    // Resize container
    _onResize();

    // Start loops
    requestAnimationFrame(_renderLoop);
    _tickLoop();

    // Start the user's load function
    if (_loadFunction != null) _loadFunction();
}


/**
 * Tick
 */
var _doTick = function() {
    if (_paused) return;

    UIManager.tick();

    if (_tickFunction != null) _tickFunction();
}

/**
 * Render
 */
var _doRender = function() {
    if (_paused) return;

    UIManager.render();
    
    if (_renderFunction != null) _renderFunction();
}

/**
 * Called on errors
 * @return {[type]}
 */
var _reset = function() {
    UIManager.clear();
}

/**
 * Render loop
 */
var _renderLoop = function() {
    requestAnimationFrame(_renderLoop);

    var startTime = _getNow();

    _doRender();

    var endTime = _getNow();
    _fpsRenderTime = (endTime - startTime);
    _doFps();
}

/**
 * Fps measurement
 */
var _fpsFrames = 0,
    _fpsFramesTotal = 0,
    _fpsLastTime = 0,
    _fpsRenderTime = 0;
var _doFps = function() {
    _fpsFrames++;
    if (_fpsLastTime == 0) _fpsLastTime = _getNow();
    if (_getNow() - _fpsLastTime >= 1000) {
        _fpsLastTime += 1000;
        _fpsFramesTotal = _fpsFrames;
        _fpsFrames = 0;
    }

    var debugCanvas = _debugOverlay;
    debugCanvas.clear();
    debugCanvas.fillText(_fpsFramesTotal + ' fps', 15, 15, '#000', 12);
    debugCanvas.fillText(_fpsRenderTime.toFixed(1) + ' ms', 15, 30, '#000', 12);
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
    if (global.performance != undefined && global.performance.now != undefined) return performance.now();
    return Date.now();
}

/**
 * Resize handling
 */
var _onResize = function() {
    Screen.width = document.documentElement.clientWidth;
    Screen.height = document.documentElement.clientHeight;
    
    if (Screen.width > 1200) Screen.width = 1200;
    if (Screen.height > 600) Screen.height = 600;
    if (Screen.width < 100) Screen.width = 100;
    if (Screen.height < 100) Screen.height = 100;

    // Rounding errors can be avoided by making the dimensions divisable by two
    if (Screen.width % 2 != 0) Screen.width--;
    if (Screen.height % 2 != 0) Screen.height--;

    Screen.containerElement.style.width = (Screen.width) + 'px';
    Screen.containerElement.style.height = (Screen.height) + 'px';

    UIManager.onResize();
}

/**
 * Check browser requirements for the Engine
 * @return {boolean} true if this browser has the required functions, false otherwise
 */
var _checkBrowserRequirements = function() {
    var canvas = document.createElement('canvas');
    if (!canvas.getContext || !canvas.getContext('2d')) {
        Engine.handleError('Your browser is not supported.<br>' + 
        'Please upgrade your browser to a newer version, or use another one:<br>' + 
        '- <a href="http://google.com/chrome">Get Chrome</a><br>' + 
        '- <a href="http://firefox.com/">Get Firefox</a><br><br><br><br>');
        return false;
    }

    if (typeof(global.localStorage) == 'undefined') {
        Engine.handleError('Your browser is not supported.<br>' + 
        'Please upgrade your browser to a newer version, or use another one:<br>' + 
        '- <a href="http://google.com/chrome">Get Chrome</a><br>' + 
        '- <a href="http://firefox.com/">Get Firefox</a><br><br><br><br>');
        return false;
    }

    return true;
}

/**
 * Global exception handling, overrides all onerror events
 */
global.onerror = function(err, file, line) {
    Engine.handleError(err, file, line);
}

var _crashed = false;
/**
 * Handle global error by creating a screen for the user with a crash message
 * @param  {Error or String} err
 * @param  {String or undefined} file
 * @param  {String or undefined} line
 * @param  {Stacktrace or undefined} stack
 */
Engine.handleError = function(err, file, line, stack) {
    if (_crashed) return;
    if (!Screen.containerElement) return;
    _crashed = true;

    _reset();

    if (err instanceof Error) {
        file = err.fileName || '';
        line = err.lineNumber || '';
        stack = err.stack || '';
    } else {
        if (file == undefined) file = '';
        if (line == undefined) line = '';
        if (stack == undefined) stack = '';
    }

    Screen.containerElement.innerHTML = '';

    var elem = document.createElement('div');
    elem.className = 'error';

    elem.innerHTML = '<h1>:(</h1>';
    if (stack == '') elem.innerHTML += err;
    if (file != '' && line != '') elem.innerHTML += '<br><br>' + file + ':' + line + '.'; 
    if (stack != '') elem.innerHTML += stack.replace(/\n/g, '<br>&nbsp;&nbsp;&nbsp;&nbsp;');
    // elem.innerHTML += '<br><br>Press F5 to reload.';

    Screen.containerElement.appendChild(elem);

    return;
}

// Check for <IE9 so that an error can by displayed with onerror if there is no canvas support
if (global.addEventListener) {
    global.addEventListener('load', _init);
    global.addEventListener('resize', _onResize);
} else {
    global.attachEvent('onload', function() {
        _init();
    });
}

global.Engine = Engine;


})(global);