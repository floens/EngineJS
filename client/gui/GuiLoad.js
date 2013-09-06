(function(global, undefined) {
'use strict';

/*****
* Displays a message
*/

global.GuiLoad = function(callback) {
    Gui.call(this);

    this.callback = callback;
    this.done = false;
}
GuiLoad.prototype = Object.create(Gui.prototype);

GuiLoad.prototype.tick = function() {
    Gui.prototype.tick.call(this);

    this.done = AssetManager.progress.isDone();

    if (this.done && this.callback != null) {
        this.callback();
    }
}

GuiLoad.prototype.render = function() {
    Gui.prototype.render.call(this);

    this.canvas.clear();

    var progress = AssetManager.progress;

    var number = Math.round(progress.getPercentage() * 100);

    this.canvas.fillText('Loading ' + number + '%', this.w / 2, this.h / 2, this.color, 18, 'center');
}

})(global);
