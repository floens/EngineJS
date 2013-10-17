(function(global, undefined) {
'use strict';

/*****
* Displays a message
*/

global.UIAssetLoad = function(callback, color) {
    UI.call(this);

    this.color = color;
    this.callback = callback;
    this.executedCallback = false;
    this.done = false;
}
UIAssetLoad.extend(UI);

UIAssetLoad.prototype.tick = function() {
    this.parent.tick.call(this);

    this.done = AssetManager.progress.isDone();

    if (this.done && this.callback != null && !this.executedCallback) {
        this.executedCallback = true;
        this.callback();
    }
}

UIAssetLoad.prototype.render = function() {
    this.parent.render.call(this);

    this.canvas.clear();

    var progress = AssetManager.progress;

    var number = Math.round(progress.getPercentage() * 100);

    this.canvas.fillText('Loading ' + number + '%', this.w / 2, this.h / 2, this.color, 18, 'center');
}

})(global);
