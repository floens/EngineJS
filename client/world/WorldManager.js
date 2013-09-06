(function(global, undefined) {
'use strict';

var _currentWorld = null;

global.WorldManager = function() {
    this.currentWorld = null;
}

WorldManager.prototype.tick = function() {
    if (this.currentWorld == null) return;

    this.currentWorld.tick();
}

WorldManager.prototype.render = function() {
    if (this.currentWorld == null) return;

    this.currentWorld.render();
}

WorldManager.prototype.setWorld = function(world) {
    this.currentWorld = world;
}

WorldManager.prototype.stop = function() {
    this.currentWorld = null;
}

WorldManager.prototype.getWorld = function() {
    return this.currentWorld;
}




})(global);