(function(global) {
'use strict';

global.UI = function() {
    this.width = Screen.width;
    this.height = Screen.height;
    this.canvas = new Canvas(this.width, this.height, 80);
}

UI.prototype.onRemove = function() {
    this.canvas.remove();
}

UI.prototype.onResize = function() {
    this.width = Screen.width;
    this.height = Screen.height;
    this.canvas.setDimensions(this.width, this.height);
}

UI.prototype.render = function() {

}

UI.prototype.tick = function() {
    
}

})(global);
