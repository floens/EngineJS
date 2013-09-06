(function(global, undefined) {
'use strict';

/**
 * Displays a message like GuiText, but with a back button that calls the callback
 * @param {string}   Text to display
 * @param {Function} callback to execute on button click
 */
global.GuiBack = function(text, callback) {
    Gui.call(this);

    this.displayText = text;
    this.callback = callback;

    this.returnButton = new GuiButton('Return', this.w / 2, this.h / 2 + 20, 50, 25);
}
GuiBack.prototype = Object.create(Gui.prototype);
GuiBack.prototype.onResize = function() {
    Gui.prototype.onResize.call(this);

    this.returnButton.x = this.w / 2;
    this.returnButton.y = this.h / 2 + 20;
}

GuiBack.prototype.render = function() {
    Gui.prototype.render.call(this);

    this.canvas.clear();

    this.canvas.fillText(this.displayText, this.w / 2, this.h / 2 - 20, '#000', 18, 'center');

    this.returnButton.render(this.canvas);
}

GuiBack.prototype.tick = function() {
    Gui.prototype.tick.call(this);

    this.returnButton.update();
    if (this.returnButton.getClicked()) {
        this.callback();
    }
}

})(global);
