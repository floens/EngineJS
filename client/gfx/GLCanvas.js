(function(global) {
'use strict';

global.GLCanvas = function(width, height, zIndex, webglOptions) {
    this.ready = true;

    this.width = width;
    this.height = height;

    this.canvas = document.createElement('canvas');
    this.canvas.width = width;
    this.canvas.height = height;
    this.canvas.style.position = 'absolute';
    this.canvas.style.zIndex = zIndex;
    this.canvas.style.left = '0px';
    this.canvas.style.top = '0px';
    
    this.gl = this.canvas.getContext('webgl', webglOptions) || this.canvas.getContext('experimental-webgl', webglOptions) || null;

    if (!this.gl) {
        this.ready = false;
    } else {
        Screen.containerElement.appendChild(this.canvas);
    }
}

GLCanvas.prototype.setDimensions = function(w, h) {
    this.width = w;
    this.height = h;
    this.canvas.width = w;
    this.canvas.height = h;

    var width = this.gl.drawingBufferWidth;
    var height = this.gl.drawingBufferHeight;

    this.gl.viewport(0, 0, width, height);
}

GLCanvas.prototype.setPosition = function(x, y) {
    this.canvas.style.left = (x) + 'px';
    this.canvas.style.top = (y) + 'px';
}

GLCanvas.prototype.remove = function() {
    Screen.containerElement.removeChild(this.canvas);
}


GLCanvas.prototype.getReady = function() {
    return this.ready;
}


})(global);
