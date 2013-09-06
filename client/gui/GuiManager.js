(function(global, undefined) {
'use strict';

global.GuiManager = {};

var _current = null;
GuiManager.set = function(e) {
    if (_current != null) _current.onRemove();
    _current = e;
}

GuiManager.get = function() {
    return _current;
}

GuiManager.clear = function() {
    this.set(null);
}

GuiManager.onResize = function() {
    if (_current == null) return;

    _current.onResize();
}

GuiManager.render = function() {
    if (_current == null) return;

    _current.render();
}

GuiManager.tick = function() {
    if (_current == null) return;

    _current.tick();
}

/**********
* GuiButton
*/
global.GuiButton = function(text, x, y, w, h) {
    this.text = text;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;

    this.normalColor = '#000';
    this.overlayColor = 'rgb(17, 169, 207)';

    this.align = 'center';
    this.size = 18;

    this.pressed = false;
    this.wasDown = false;
    this.wasDownHere = false;
}

GuiButton.prototype.render = function(c) {
    var x = this.align == 'center' ? this.x - c.measureText(this.text, this.size) / 2 : this.x;

    if (this.getMouseOver()) {
        c.fillText(this.text, x, this.y, this.overlayColor, this.size);
    } else {
        c.fillText(this.text, x, this.y, this.normalColor, this.size);
    }
}

GuiButton.prototype.getMouseOver = function() {
    var mx = Input.getMousePosition()[0],
        my = Input.getMousePosition()[1],
        ml = Input.getMousePressed(Input.BUTTON_LEFT),
        mr = Input.getMousePressed(Input.BUTTON_RIGHT);

    var x = this.align == 'center' ? this.x - Canvas.measureText(this.text, this.size) / 2 : this.x;
    if (mx < x || mx > x + this.w || my < this.y || my > this.y + this.h) return false;
    return true;
}

GuiButton.prototype.getMousePressed = function() {
    return Input.getMousePressed(Input.BUTTON_LEFT);
}

GuiButton.prototype.getClicked = function() {
    return this.pressed;
}

GuiButton.prototype.update = function() {
    this.mouseover = this.getMouseOver();

    var down = this.getMousePressed();
    if (!this.wasDown && down) {
        this.wasDown = true;
        if (this.getMouseOver()) {
            this.wasDownHere = true;
        }
    } else if (this.wasDown && !down) {
        if (this.wasDownHere && this.getMouseOver()) {
            this.pressed = true;
        }
        this.wasDown = false;
        this.wasDownHere = false;
    }
}

/**********
* Gui
*/
global.Gui = function() {
    this.w = Screen.width;
    this.h = Screen.height;
    this.canvas = new Canvas(this.w, this.h, 80);
}

Gui.prototype.onRemove = function() {
    this.canvas.remove();
}

Gui.prototype.onReinitialize = function() {

}

Gui.prototype.onResize = function() {
    this.w = Screen.width;
    this.h = Screen.height;
    this.canvas.setDimensions(this.w, this.h);
}

Gui.prototype.render = function() {

}

Gui.prototype.tick = function() {
    
}


})(global);
