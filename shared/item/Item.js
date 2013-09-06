(function(global, undefined) {
'use strict';

global.Item = function(map) {
    this.map = map;

    this.remoteType = -1;
}

Item.prototype.tick = function() {
}

Item.prototype.onUse = function(player, mouseButton, direction, x, y) {
}

Item.prototype.render = function(canvas, x, y, player) {
}

})(global);