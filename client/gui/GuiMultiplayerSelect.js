(function(global, undefined) {
'use strict';

global.GuiMultiplayerSelect = function() {
    Gui.call(this);

    this.serverUrl = '';

    this.doneButton = new GuiButton('Done', this.w / 2, this.h / 2 + 40, 60, 25);
    this.returnButton = new GuiButton('Return', this.w / 2, this.h / 2 + 70, 60, 25);

    Input.putTextForm(this.w / 2 - 100, this.h / 2 - 20, 200, 30, Main.defaultServerUrl);

    this.blinkTime = 0;
}
GuiMultiplayerSelect.prototype = Object.create(Gui.prototype);

GuiMultiplayerSelect.prototype.onResize = function() {
    Gui.prototype.onResize.call(this);

    this.returnButton.x = this.w / 2;
    this.returnButton.y = this.h / 2 + 70;

    this.doneButton.x = this.w / 2;
    this.doneButton.y = this.h / 2 + 40;

    Input.setTextFormPosition(this.w / 2 - 100, this.h / 2 - 20);
}

GuiMultiplayerSelect.prototype.render = function() {
    Gui.prototype.render.call(this);

    var c = this.canvas;
    c.clear();
    c.fillText('Server address:', this.w / 2, this.h / 2 - 60, '#000', 18, 'center');
    this.doneButton.render(c);
    this.returnButton.render(c);
}

GuiMultiplayerSelect.prototype.tick = function() {
    Gui.prototype.tick.call(this);

    this.blinkTime++;

    this.doneButton.update();
    if (this.doneButton.getClicked() || Input.getPressedKeyOnce('enter')) {
        var string = Utils.removeWhitespace(Input.getTextFormValue());

        if (string.length > 0) {
            this.serverUrl = string;

            Input.removeTextForm();
            GuiManager.set(new GuiNameSelect(string));
        }
    }

    this.returnButton.update();
    if (this.returnButton.getClicked()) {
        Input.removeTextForm();
        GuiManager.set(new GuiMain());
        return;
    }
}

})(global);
