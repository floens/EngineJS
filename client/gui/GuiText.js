(function(global, undefined) {
'use strict';

/*****
* Displays a message
*/

global.GuiText = function(text, color) {
    Gui.call(this);

    this.displayText = text;
    this.color = color == undefined ? '#000' : color;
}
GuiText.prototype = Object.create(Gui.prototype);

GuiText.prototype.render = function() {
    Gui.prototype.render.call(this);

    this.canvas.clear();

    this.canvas.fillText(this.displayText, this.w / 2, this.h / 2 - 20, this.color, 18, 'center');
}

})(global);
