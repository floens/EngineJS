(function(global, undefined) {
'use strict';

global.UIMain = function() {
    UI.call(this);

    this.singleplayerButton = new UIButton('Singleplayer', this.w / 2 - 60, this.h - 100, 100, 30);
    this.spOffset = 0;

    this.multiplayerButton = new UIButton('Multiplayer', this.w / 2 + 60, this.h - 100, 100, 30);
    this.mpOffset = 0;
}
UIMain.prototype = Object.create(UI.prototype);

UIMain.prototype.tick = function() {
    UI.prototype.tick.call(this);

    // Singleplayer button
    this.singleplayerButton.update();
    if (this.singleplayerButton.getClicked()) {
        Main.startSingleplayer();
        return;
    }

    if (this.singleplayerButton.isMouseOver()) {
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
        UIManager.set(new UIMultiplayerSelect());
        return;
    }

    if (this.multiplayerButton.isMouseOver()) {
        this.mpOffset++;
        if (this.mpOffset > 6) this.mpOffset = 6;
    } else {
        this.mpOffset--;
        if (this.mpOffset < 0) this.mpOffset = 0;
    }
    this.multiplayerButton.y = this.h - 100 - this.mpOffset;
}

UIMain.prototype.onResize = function() {
    UI.prototype.onResize.call(this);

    this.singleplayerButton.x = this.w / 2 - 60;
    this.multiplayerButton.x = this.w / 2 + 60;
}

UIMain.prototype.render = function() {
    UI.prototype.render.call(this);

    var c = this.canvas;
    c.clear();

    this.singleplayerButton.render(c);
    this.multiplayerButton.render(c);
}

})(global);
