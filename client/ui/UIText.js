(function(global, undefined) {
'use strict';

/*****
* Displays a message
*/

global.UIText = function(text, color) {
    UI.call(this);

    this.displayText = text;
    this.color = color == undefined ? '#000' : color;
}
UIText.prototype = Object.create(UI.prototype);

UIText.prototype.render = function() {
    UI.prototype.render.call(this);

    this.canvas.clear();

    this.canvas.fillText(this.displayText, this.w / 2, this.h / 2 - 20, this.color, 18, 'center');
}

})(global);
