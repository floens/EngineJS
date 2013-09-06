(function(global, undefined) {
'use strict';

global.UI = function() {
    this.w = Screen.width;
    this.h = Screen.height;
    this.canvas = new Canvas(this.w, this.h, 80);
}

UI.prototype.onRemove = function() {
    this.canvas.remove();
}

UI.prototype.onResize = function() {
    this.w = Screen.width;
    this.h = Screen.height;
    this.canvas.setDimensions(this.w, this.h);
}

UI.prototype.render = function() {

}

UI.prototype.tick = function() {
    
}

})(global);
