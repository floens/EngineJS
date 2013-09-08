(function(global, undefined) {
'use strict';

global.Canvas = function(width, height, zIndex) {
    this.width = width;
    this.height = height;

    this.canvas = document.createElement('canvas');
    this.canvas.width = width;
    this.canvas.height = height;
    this.canvas.style.position = 'absolute';
    this.canvas.style.zIndex = zIndex;
    this.canvas.style.left = '0px';
    this.canvas.style.top = '0px';
    this.c = this.canvas.getContext('2d');

    Screen.containerElement.appendChild(this.canvas);
}

Canvas.prototype.setDimensions = function(w, h) {
    this.width = w;
    this.height = h;
    this.canvas.width = w;
    this.canvas.height = h;
}

Canvas.prototype.setPosition = function(x, y) {
    // Rounding causes a space between canvasses next to each other
    /*x = Math.floor(x);
    y = Math.floor(y);*/
    this.canvas.style.left = (x) + 'px';
    this.canvas.style.top = (y) + 'px';
}

Canvas.prototype.remove = function() {
    Screen.containerElement.removeChild(this.canvas);
}

Canvas.prototype.clear = function() {
    this.c.clearRect(0, 0, this.width, this.height);
}

Canvas.prototype.clearRect = function(x, y, w, h) {
    this.c.clearRect(x, y, w, h);
}

/**
 * Fill this canvas with an image
 * @param  {Renderable object} image  Image or Canvas object
 * @param  {number}  dx     X destination position
 * @param  {number}  dy     Y destination position
 * @param  {number}  sx     X source position
 * @param  {number}  sy     Y source position
 * @param  {number}  w      Width
 * @param  {number}  h      Height
 * @param  {boolean} flipX  Flip image horizontal
 * @param  {boolean} flipY  Flip image vertical
 * @param  {number}  rotate Radians to rotate
 */
Canvas.prototype.fillImage = function(image, dx, dy, sx, sy, w, h, flipX, flipY, rotate) {
    if (dx + w < 0 || dy + h < 0 || dx > this.width || dy > this.height) return false;
    dx = Math.floor(dx);
    dy = Math.floor(dy);
    var c = this.c;

    if (flipX) {
        c.save();
        c.translate(this.width, 0);
        c.scale(-1, 1);
        dx = this.width - dx - w;
    }
    if (flipY) {
        c.save();
        c.translate(0, this.height);
        c.scale(1, -1);
        dy = this.height - dy - h;
    }
    if (rotate != undefined) {
        c.save();
        c.translate(dx, dy);
        c.rotate(-rotate);
        c.translate(-w / 2, 0);
        dx = 0;
        dy = 0;
    }

    c.drawImage(image, sx, sy, w, h, dx, dy, w, h);

    if (flipX) {
        c.restore();
    }
    if (flipY) {
        c.restore();
    }
    if (rotate != undefined) {
        c.restore();
    }
}

Canvas.prototype.fillLine = function(sx, sy, dx, dy, color, width, secondColor) {
    var c = this.c;
    if (secondColor != undefined) {
        var gradient = c.createLinearGradient(sx, sy, dx, dy);
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, secondColor);
        c.strokeStyle = gradient;
    } else {
        c.strokeStyle = color;
    }

    c.lineWidth = width == undefined ? 1 : width;
    c.lineCap = 'round';
    c.beginPath();
    c.moveTo(sx, sy);
    c.lineTo(dx, dy);
    c.stroke();
}

Canvas.prototype.fillRect = function(x, y, w, h, color) {
    var c = this.c;
    if (color != undefined) c.fillStyle = color;
    c.fillRect(Math.floor(x), Math.floor(y), Math.floor(w), Math.floor(h));
}

Canvas.prototype.fillText = function(string, x, y, color, size, align, customFont) {
    if (color == undefined) color = '#000';
    if (size  == undefined) size = 14;
    if (align == undefined) align = 'left';
    var c = this.c;
    c.fillStyle = color;
    c.textAlign = align;
    c.textBaseline = 'top';
    c.font = customFont ? (customFont) : (size + 'px Helvetica, sans-serif');
    c.fillText(string, Math.floor(x), Math.floor(y));
}

Canvas.prototype.fillGradientCircle = function(x, y, radius, colorA, colorB) {
    var c = this.c;

    var gradient = c.createRadialGradient(x, y, 0, x, y, radius);
    // light blue
    gradient.addColorStop(0, colorA);
    // dark blue
    gradient.addColorStop(1, colorB);

    c.fillStyle = gradient;
    c.fillRect(x - radius, y - radius, radius * 2, radius * 2);
}

Canvas.prototype.fillCircle = function(x, y, radius, color) {
    var c = this.c;
    c.beginPath();
    c.arc(Math.floor(x), Math.floor(y), Math.floor(radius), 0, Math.PI * 2);
    c.fillStyle = color;
    c.fill();
    c.closePath();
}

Canvas.prototype.measureText = function(text, size) {
    if (size == undefined) size = 16;
    this.c.font = size + 'px Helvetica, sans-serif';
    return this.c.measureText(text).width;
}


// Static functions
var _measureTextCanvas = null;
Canvas.measureText = function(text, size) {
    if (_measureTextCanvas == null) {
        var canvas = document.createElement('canvas');
        _measureTextCanvas = canvas.getContext('2d');
    }

    if (size == undefined) size = 14;
    _measureTextCanvas.font = size + 'px Helvetica, sans-serif';
    return _measureTextCanvas.measureText(text).width;
}

})(global);
