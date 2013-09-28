(function(global, undefined) {
'use strict';

/**
 * Displays a message like UIText, but with a back button that calls the callback
 * @param {string}   Text to display
 * @param {Function} callback to execute on button click
 */
global.UIBack = function(text, callback) {
    UI.call(this);

    this.displayText = text;
    this.callback = callback;

    this.returnButton = new UIButton('Return', this.w / 2, this.h / 2 + 20, 50, 25);
}
UIBack.extend(UI);
UIBack.prototype.onResize = function() {
    this.parent.onResize.call(this);

    this.returnButton.x = this.w / 2;
    this.returnButton.y = this.h / 2 + 20;
}

UIBack.prototype.render = function() {
    this.parent.render.call(this);

    this.canvas.clear();

    this.canvas.fillText(this.displayText, this.w / 2, this.h / 2 - 20, '#000', 18, 'center');

    this.returnButton.render(this.canvas);
}

UIBack.prototype.tick = function() {
    this.parent.tick.call(this);

    this.returnButton.update();
    if (this.returnButton.getClicked()) {
        this.callback();
    }
}

})(global);
