(function(global, undefined) {
'use strict';

global.UIMain = function() {
    UI.call(this);

    this.singleplayerButton = new UIButton('Singleplayer', this.w / 2 - 60, this.h - 100, 100, 30);
    this.spOffset = 0;

    this.multiplayerButton = new UIButton('Multiplayer', this.w / 2 + 60, this.h - 100, 100, 30);
    this.mpOffset = 0;
}
UIMain.extend(UI);

UIMain.prototype.tick = function() {
    this.parent.tick.call(this);

    // Singleplayer button
    this.singleplayerButton.update();
    if (this.singleplayerButton.getClicked()) {
    }

    if (this.singleplayerButton.getMouseOver()) {
        this.spOffset++;
        if (this.spOffset > 6) this.spOffset = 6;
    } else {
        this.spOffset--;
        if (this.spOffset < 0) this.spOffset = 0;
    }
    this.singleplayerButton.y = this.h - 100 - this.spOffset;

    // Multiplayer button
    this.multiplayerButton.update();
    if (this.multiplayerButton.getClicked()) {
    }

    if (this.multiplayerButton.getMouseOver()) {
        this.mpOffset++;
        if (this.mpOffset > 6) this.mpOffset = 6;
    } else {
        this.mpOffset--;
        if (this.mpOffset < 0) this.mpOffset = 0;
    }
    this.multiplayerButton.y = this.h - 100 - this.mpOffset;
}

UIMain.prototype.onResize = function() {
    this.parent.onResize.call(this);

    this.singleplayerButton.x = this.w / 2 - 60;
    this.multiplayerButton.x = this.w / 2 + 60;
}

UIMain.prototype.render = function() {
    this.parent.render.call(this);

    var c = this.canvas;
    c.clear();

    this.singleplayerButton.render(c);
    this.multiplayerButton.render(c);
}

})(global);
