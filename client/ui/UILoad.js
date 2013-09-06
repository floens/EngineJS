(function(global, undefined) {
'use strict';

/*****
* Displays a message
*/

global.UILoad = function(callback) {
    UI.call(this);

    this.callback = callback;
    this.done = false;
}
UILoad.prototype = Object.create(UI.prototype);

UILoad.prototype.tick = function() {
    UI.prototype.tick.call(this);

    this.done = AssetManager.progress.isDone();

    if (this.done && this.callback != null) {
        this.callback();
    }
}

UILoad.prototype.render = function() {
    UI.prototype.render.call(this);

    this.canvas.clear();

    var progress = AssetManager.progress;

    var number = Math.round(progress.getPercentage() * 100);

    this.canvas.fillText('Loading ' + number + '%', this.w / 2, this.h / 2, this.color, 18, 'center');
}

})(global);