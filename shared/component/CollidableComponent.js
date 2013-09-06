(function(global, undefined) {
'use strict';

/**
 * Make your entity collidable
 * An optional width and height can be supplied to make this collidable an AABB
 * @param  {number} width  Width of the AABB (optional)
 * @param  {number} height Height of the AABB (optional)
 */
global.CollidableComponent = function(width, height) {
    Component.call(this);

    this.elasticity = 0.4;
    this.mass = 0.4;
    this.invertedMass = 0;

    this.setMass(this.mass);

    this.x = 0;
    this.y = 0;
    this.xa = 0;
    this.ya = 0;

    this.bb = null;

    if (width != undefined && height != undefined) {
        this.bb = new AABB(0, 0, width, height);
    }
}
CollidableComponent.extend(Component);
Component.registerComponent(CollidableComponent, 4);

CollidableComponent.prototype.getBB = function() {
    return this.bb;
}

CollidableComponent.prototype.setMass = function(e) {
    this.mass = e;
    this.invertedMass = this.mass == 0 ? 0 : 1 / this.mass;
    return this;
}

CollidableComponent.prototype.setElasticity = function(e) {
    this.elasticity = e;
    return this;
}

})(global);
