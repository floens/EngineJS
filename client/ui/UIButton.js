(function(global) {
'use strict';

global.UIButton = function(text) {
    this.text = text == undefined ? null : text;
    this.x = 0;
    this.y = 0;
    this.width = 0;
    this.height = 0;

    this.textColor = '#000';
    this.backgroundColor = null;

    this.textAlign = 'center';
    this.textVerticalAlign = 'middle';
    this.textSize = 18;

    this.clicked = false;
    this.wasDown = false;
    this.wasDownHere = false;
    this.touch = null;
}

UIButton.prototype.setPosition = function(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
}

UIButton.prototype.setTextColor = function(color) {
    this.color = color;
    return this;
}

UIButton.prototype.setBackgroundColor = function(color) {
    this.backgroundColor = color;
    return this;
}

UIButton.prototype.setTextAlign = function(align) {
    this.textAlign = align;
    return this;
}

UIButton.prototype.setTextVerticalAlign = function(align) {
    this.textVerticalAlign = align;
    return this;
}

UIButton.prototype.setTextSize = function(textSize) {
    this.textSize = textSize;
    return this;
}

UIButton.prototype.render = function(c) {
    if (this.backgroundColor != null) {
        c.fillRect(this.x, this.y, this.width, this.height, this.backgroundColor);
    }

    if (this.text != null) {
        c.fillText(this.text, this.x + this.width / 2, this.y + this.height / 2, this.color, this.textSize, this.textAlign, this.textVerticalAlign);
    }
}

UIButton.prototype.getHovered = function() {
    return (this.touch != null && this.getTouchOver(this.touch)) || this.getCursorOver();
}

UIButton.prototype.getCursorOver = function() {
    var pos = Input.getMousePosition();
    return (pos.x > this.x && pos.x < this.x + this.width && pos.y > this.y && pos.y < this.y + this.height);
}

UIButton.prototype.getTouchOver = function(touch) {
    return (touch.x > this.x && touch.x < this.x + this.width && touch.y > this.y && touch.y < this.y + this.height);
}

UIButton.prototype.getClicked = function() {
    return this.clicked;
}

UIButton.prototype.tick = function() {
    if (Input.getHadTouchOnce()) {
        var touchList = Input.getTouches();

        if (touchList.length > 0 && this.touch == null) {
            for (var i = 0; i < touchList.length; i++) {
                var e = touchList[i];
                if (this.getTouchOver(e)) {
                    this.touch = e;
                }
            }
        } else if (touchList.length == 0 && this.touch != null) {
            if (this.getTouchOver(this.touch)) {
                this.clicked = true;
            }

            this.touch = null;
        } else {
            this.clicked = false;
        }
    } else {
        this.mouseover = this.getCursorOver();

        var down = Input.getMousePressed(Input.BUTTON_LEFT);
        if (down != this.wasDown) {
            if (down) {
                this.wasDownHere = this.getCursorOver();
            } else {
                if (this.wasDownHere && this.getCursorOver()) {
                    this.clicked = true;
                }
            }
            this.wasDown = down;
        } else {
            this.clicked = false;
        }
    }
}



})(global);
