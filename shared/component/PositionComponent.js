(function(global) {
'use strict';

/**
 * A simple component with x, y, z, xa, ya, za, width, height and depth values.
 * @class PositionComponent
 * @constructor
 * @extends {Component}
 */
global.PositionComponent = function() {
    Component.call(this);

    /**
     * X value
     * @type {Number}
     */
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.xa = 0;
    this.ya = 0;
    this.za = 0;
    this.width = 0;
    this.height = 0;
    this.depth = 0;
}
PositionComponent.extend(Component);
Component.registerComponent(PositionComponent, 1);

/**
 * Create a new PositionComponent instance with the same values
 * @method copy
 * @return {PositionComponent} the created instance
 */
PositionComponent.prototype.copy = function() {
    var n = new PositionComponent();
    n.x = this.x;
    n.y = this.y;
    n.z = this.z;
    n.xa = this.xa;
    n.ya = this.ya;
    n.za = this.za;
    n.width = this.width;
    n.height = this.height;
    n.depth = this.depth;

    return n;
}


})(global);
