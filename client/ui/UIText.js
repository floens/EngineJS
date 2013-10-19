(function(global) {
'use strict';

/*****
* Displays a message
*/

global.UIText = function(text, color) {
    UI.call(this);

    this.displayText = text;
    this.color = color == undefined ? '#000' : color;
}
UIText.extend(UI);

UIText.prototype.render = function() {
    this.parent.render.call(this);

    this.canvas.clear();

    this.canvas.fillText(this.displayText, this.width / 2, this.height / 2 - 9, this.color, 18, 'center');
}

})(global);
