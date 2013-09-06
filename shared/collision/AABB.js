(function(global, undefined) {
'use strict';

global.AABB = function(x0, y0, x1, y1) {
    Collidable.call(this);

    this.x0 = x0;
    this.y0 = y0;
    this.x1 = x1;
    this.y1 = y1;
}
AABB.extend(Collidable);

AABB.prototype.move = function(x, y) {
    this.x0 += x;
    this.x1 += x;
    this.y0 += y;
    this.y1 += y;
}

AABB.prototype.getPosition = function() {
    return new Vec2(this.x0, this.y0);
}

AABB.prototype.copy = function() {
    return new AABB(this.x0, this.y0, this.x1, this.y1);
}

AABB.prototype.getWidth = function() {
    return this.x1 - this.x0;
}

AABB.prototype.getHeight = function() {
    return this.y1 - this.y0;
}


})(global);
