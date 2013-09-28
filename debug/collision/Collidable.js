(function(global, undefined) {
'use strict';

global.Collidable = function() {

}

Collidable.prototype.collidesWith = function(other, x, y) {
    var copy = this.copy();
    copy.move(x, y);
    
    if (this instanceof AABB && other instanceof AABB) return collideAABBvsAABB(copy, other);
    if (this instanceof Circle && other instanceof Circle) return collideCirclevsCircle(copy, other);

    if (this instanceof Circle && other instanceof AABB) return collideCirclevsAABB(copy, other);
    if (this instanceof AABB && other instanceof Circle) return collideCirclevsAABB(other, copy);

    log('Collidable: No algorithm for these collidables.', log.WARN);
    return false;
}

var collideCirclevsAABB = function(circle, aabb) {
    return true;
}

var collideCirclevsCircle = function(one, two, xa, ya) {
    var onePos = one.getPosition(),
        twoPos = two.getPosition();

    return Math.pow(one.getRadius() + two.getRadius(), 2) >= 
        Math.pow(twoPos.x - onePos.x, 2) + Math.pow(twoPos.y - onePos.y, 2);
}

var collideAABBvsAABB = function(one, two) {
    if (one.x1 < two.x0 || one.y1 < two.y0) return false;
    if (one.x0 > two.x1 || one.y0 > two.y1) return false;
    return true;
}

Collidable.prototype.move = function(x, y) {
    throw new Error('Collidable::move(x, y) should be implemented.');
}

Collidable.prototype.setPosition = function(x, y) {
    var pos = this.getPosition();
    this.move(x - pos.x, y - pos.y);
}

Collidable.prototype.getPosition = function() {
    throw new Error('Collidable::getPosition() should be implemented.');
}

Collidable.prototype.copy = function() {
    throw new Error('Collidable::copy() should be implemented.');
}



})(global);
