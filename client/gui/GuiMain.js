(function(global, undefined) {
'use strict';

global.GuiMain = function() {
    Gui.call(this);

    this.singleplayerButton = new GuiButton('Singleplayer', this.w / 2 - 60, this.h - 100, 100, 30);
    this.spOffset = 0;

    this.multiplayerButton = new GuiButton('Multiplayer', this.w / 2 + 60, this.h - 100, 100, 30);
    this.mpOffset = 0;
}
GuiMain.prototype = Object.create(Gui.prototype);

GuiMain.prototype.tick = function() {
    Gui.prototype.tick.call(this);

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
        GuiManager.set(new GuiMultiplayerSelect());
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

GuiMain.prototype.onResize = function() {
    Gui.prototype.onResize.call(this);

    this.singleplayerButton.x = this.w / 2 - 60;
    this.multiplayerButton.x = this.w / 2 + 60;
}

GuiMain.prototype.render = function() {
    Gui.prototype.render.call(this);

    var c = this.canvas;
    c.clear();

    this.singleplayerButton.render(c);
    this.multiplayerButton.render(c);
}

})(global);
