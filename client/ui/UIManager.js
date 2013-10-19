(function(global) {
'use strict';

global.UIManager = {};

var _current = null;
UIManager.set = function(e) {
    if (_current != null) _current.onRemove();
    _current = e;
    if (e != null) {
        e.onResize();
    }
}

UIManager.get = function() {
    return _current;
}

UIManager.clear = function() {
    this.set(null);
}

UIManager.onResize = function() {
    if (_current == null) return;

    _current.onResize();
}

UIManager.render = function() {
    if (_current == null) return;

    _current.render();
}

UIManager.tick = function() {
    if (_current == null) return;

    _current.tick();
}


})(global);
