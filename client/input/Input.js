(function(global, undefined) {
'use strict';

global.Input = {};

/**
 * Create an text form at the given location.
 * @param {number} x             
 * @param {number} y             
 * @param {number} width         
 * @param {number} height        
 * @param {string} defaultString What should be already filled in
 * @param {string} textAlign     Alignment of the text inside the form
 */
global.InputTextform = function(x, y, width, height, defaultString, textAlign) {
    if (defaultString == undefined) defaultString = '';
    if (textAlign == undefined) textAlign = 'center';

    this.inputElement = this._createTextform(x, y, width, height, defaultString, textAlign);

    Screen.containerElement.appendChild(this.inputElement);
}

InputTextform.prototype._createTextform = function(x, y, width, height, defaultString, textAlign) {
    var inputElement = document.createElement('input');
    inputElement.setAttribute('type', 'text');
    inputElement.value = defaultString;
    inputElement.style.position = 'absolute';
    inputElement.style.margin = '0';
    inputElement.style.padding = '0';
    inputElement.style.border = '0';
    inputElement.style.outline = '0';
    inputElement.style.zIndex = 200;
    inputElement.style.left = (x) + 'px';
    inputElement.style.top = (y) + 'px';
    inputElement.style.width = (width) + 'px';
    inputElement.style.height = (height) + 'px';
    inputElement.style.textAlign = textAlign;
    inputElement.style.fontSize = '18px';
    inputElement.spellcheck = false;
    inputElement.maxLength = 120;

    inputElement.focus();

    return inputElement;
}

/**
 * Move this text form around
 * @param {number} x 
 * @param {number} y 
 */
InputTextform.prototype.setPosition = function(x, y) {
    this.inputElement.style.left = (x) + 'px';
    this.inputElement.style.top = (y) + 'px';
}

/**
 * Get the value of the form
 * @return {string} 
 */
InputTextform.prototype.getValue = function() {
    return this.inputElement.value;
}

/**
 * Remove this text form
 */
InputTextform.prototype.remove = function() {
    Screen.containerElement.removeChild(this.inputElement);
}






var _pressedKeys = {},
    _pressedKeysOnce = {},
    _keyCodes = {
        65: 'a',66: 'b',67: 'c',68: 'd',69: 'e',70: 'f',71: 'g',72: 'h',73: 'i',
        74: 'j',75: 'k',76: 'l',77: 'm',78: 'n',79: 'o',80: 'p',81: 'q',82: 'r',
        83: 's',84: 't',85: 'u',86: 'v',87: 'w',88: 'x',89: 'y',90: 'z', 190: '.',
        49: '1', 50: '2', 51: '3', 52: '4', 53: '5', 54: '6', 55: '7', 56: '8', 57: '9', 48: '0',
        32: 'space', 46: 'del', 13: 'enter', 16: 'shift', 8: 'backspace', 17: 'control', 27: 'escape',
        9: 'tab', 37: 'left', 39: 'right', 38: 'up', 40: 'down',
        121: 'F10'
    }

Input.isKeyPressed = function(name) {
    return _pressedKeys[name] == undefined ? false : true;
}

// Only returns true once when called until the key is lifted again
Input.isKeyPressedOnce = function(name) {
    var keyPressed = Input.isKeyPressed(name);

    if (keyPressed && _pressedKeysOnce[name] == undefined) {
        _pressedKeysOnce[name] = true;
        return true;
    }

    return false;
}


var _onKeyDown = function(event) {
    // log(event.keyCode);
    var i = _keyCodes[event.keyCode];
    if (i == undefined) return;

    /*if (i == 'left' || i == 'right' || i == 'up' || i == 'down') {
        event.preventDefault();
    }*/

    if (i == 'escape' || i == 'tab' || i == 'F10') {
        event.preventDefault();
    }

    _pressedKeys[i] = true;
}

var _onKeyUp = function(event) {
    // event.preventDefault();
    var i = _keyCodes[event.keyCode];
    if (i == undefined) return;

    delete _pressedKeys[i];
    delete _pressedKeysOnce[i];
}



var _mouseTarget = null,
    _mouseX = 0,
    _mouseY = 0,
    _mouseDelta = 0,
    _mousePressedLeftHold = false,
    _mousePressedRightHold = false,
    _mousePressedLeft = false,
    _mousePressedRight = false;

Input.BUTTON_LEFT = 0;
Input.BUTTON_RIGHT = 2;

Input.setMouseTarget = function(element) {
    _mouseTarget = element;

    document.addEventListener('mousemove', _onMouseMove, false);
    element.addEventListener('mousedown', _onMouseDown, false);
    element.addEventListener('mouseup', _onMouseUp, false);
    element.addEventListener('contextmenu', _onContextMenu, false);
    document.addEventListener('mousewheel', _onMouseScroll, false);
    document.addEventListener('DOMMouseScroll', _onMouseScroll, false);
}

Input.getMouseScroll = function() {
    return _mouseDelta;
}

Input.getMousePosition = function() {
    return [Math.floor(_mouseX), Math.floor(_mouseY)];
}

Input.getMousePressed = function(button) {
    if (button == Input.BUTTON_LEFT) return _mousePressedLeft;
        else if (button == Input.BUTTON_RIGHT) return _mousePressedRight;

    return false;
}

Input.getMousePressedOnce = function(button) {
    if (button == Input.BUTTON_LEFT && _mousePressedLeft && !_mousePressedLeftHold) {
        _mousePressedLeftHold = true;
        return true;
    } else if (button == Input.BUTTON_RIGHT && _mousePressedRight && !_mousePressedRightHold) {
        _mousePressedRightHold = true;
        return true;
    }

    return false;
}

var _onContextMenu = function(event) {
    event.preventDefault();
}

var _onMouseMove = function(event) {
    var bb = _mouseTarget.getBoundingClientRect();

    _mouseX = event.pageX - bb.left;
    _mouseY = event.pageY - bb.top;
}

var _onMouseDown = function(event) {
    var b = event.button;
    if (b == 0) _mousePressedLeft = true;
        else if (b == 2) _mousePressedRight = true;
}

var _onMouseUp = function(event) {
    var b = event.button;
    if (b == 0) {
        _mousePressedLeft = false;
        _mousePressedLeftHold = false;
    } else if (b == 2) {
        _mousePressedRight = false;
        _mousePressedRightHold = false;
    }
}

var _onMouseScroll = function(e) {
    _mouseDelta += Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
}



if (document.addEventListener != undefined) {
    document.addEventListener('keydown', _onKeyDown, false);
    document.addEventListener('keyup', _onKeyUp, false);
}


})(global);