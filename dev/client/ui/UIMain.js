(function(global) {
'use strict';

global.UIMain = function() {
    UI.call(this);

    this.singlePlayer = new UIButton('Single player').setTextColor('#eee');
    this.multiPlayer = new UIButton('Multiplayer').setTextColor('#eee');
}
UIMain.extend(UI);

UIMain.prototype.onResize = function() {
    this.parent.onResize.call(this);

    this.singlePlayer.setPosition(this.width / 2 - 100, this.height / 2 - 60, 200, 50);
    this.multiPlayer.setPosition(this.width / 2 - 100, this.height / 2 + 10, 200, 50);
}

UIMain.prototype.tick = function() {
    this.singlePlayer.tick();
    this.multiPlayer.tick();

    if (this.singlePlayer.getClicked()) {
        WebCraft.startSinglePlayer();
    }

    if (this.multiPlayer.getClicked()) {
        UIManager.set(new MultiPlayerSelect('localhost:8080'));
    }
}

UIMain.prototype.render = function() {
    this.canvas.clear();

    this.canvas.fillRect(this.singlePlayer.x, this.singlePlayer.y, this.singlePlayer.width, this.singlePlayer.height, 
        this.singlePlayer.getHovered() ? '#aaa' : '#777');

    this.singlePlayer.render(this.canvas);

    this.canvas.fillRect(this.multiPlayer.x, this.multiPlayer.y, this.multiPlayer.width, this.multiPlayer.height, 
        this.multiPlayer.getHovered() ? '#aaa' : '#777');

    this.multiPlayer.render(this.canvas);
}


global.MultiPlayerSelect = function(defaultUrl) {
    UI.call(this);

    this.back = new UIButton('Back').setTextColor('#eee');
    this.ok = new UIButton('Ok').setTextColor('#eee');

    this.form = new InputTextform(0, 0, 0, 0, defaultUrl, 'left');
    this.form.inputElement.style.color = '#fff';
}
MultiPlayerSelect.extend(UI);

MultiPlayerSelect.prototype.onResize = function() {
    this.parent.onResize.call(this);

    var width = Math.min(this.width * 0.8, 400);

    this.form.setPosition(this.width / 2 - width / 2 + 5, this.height / 2 - 35, width - 10, 30);

    this.back.setPosition(this.width / 2 - width / 2, this.height / 2 + 40, width / 2 - 5, 40);
    this.ok.setPosition(this.width / 2 + 5, this.height / 2 + 40, width / 2 - 5, 40);
}

MultiPlayerSelect.prototype.tick = function() {
    this.back.tick();
    this.ok.tick();
    if (this.back.getClicked()) {
        this.form.remove();

        UIManager.set(new UIMain());
    }

    if (this.ok.getClicked() || Input.getKeyPressed('enter')) {
        WebCraft.startMultiPlayer(this.form.getValue());

        this.form.remove();
    }
}

MultiPlayerSelect.prototype.render = function() {
    this.canvas.clear();

    this.canvas.fillRect(this.form.x - 5, this.form.y - 5, this.form.width + 10, this.form.height + 10, '#555');

    this.canvas.fillRect(this.back.x, this.back.y, this.back.width, this.back.height, 
        this.back.getHovered() ? '#aaa' : '#777');

    this.back.render(this.canvas);

    this.canvas.fillRect(this.ok.x, this.ok.y, this.ok.width, this.ok.height, 
        this.ok.getHovered() ? '#aaa' : '#777');

    this.ok.render(this.canvas);
}


/*global.UIGame = function() {
    UI.call(this);

    this.visible = false;
    this.lockTime = 60;

    this.resume = new UIButton('Resume').setTextColor('#eee');
    this.stop = new UIButton('Stop').setTextColor('#eee');
}
UIGame.extend(UI);

UIGame.prototype.onResize = function() {
    this.parent.onResize.call(this);

    var width = Math.min(this.width * 0.8, 400);

    this.resume.setPosition(this.width / 2 - width / 2, this.height / 2 - 20, width / 2 - 5, 40);
    this.stop.setPosition(this.width / 2 + 5, this.height / 2 - 20, width / 2 - 5, 40);
}

UIGame.prototype.tick = function() {
    this.lockTime--;

    if (this.lockTime > 0) return;

    this.visible = !Input.getPointerLocked();

    if (this.visible) {
        Input.setPointerLocked(false);
    }

    this.resume.tick();
    if (this.visible && this.resume.getClicked()) {
        Input.setPointerLocked(true);
        this.visible = false;
        this.lockTime = 60;
    }

    this.stop.tick();
    if (this.visible && this.stop.getClicked()) {
        WebCraft.stopGame();
    }
}

UIGame.prototype.render = function() {
    this.canvas.clear();

    if (this.visible) {
        this.canvas.fillRect(this.stop.x, this.stop.y, this.stop.width, this.stop.height, 
            this.stop.getHovered() ? '#aaa' : '#777');

        this.stop.render(this.canvas);

        this.canvas.fillRect(this.resume.x, this.resume.y, this.resume.width, this.resume.height, 
            this.resume.getHovered() ? '#aaa' : '#777');

        this.resume.render(this.canvas);
    }
}
*/

})(global);
