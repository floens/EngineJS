(function(global, undefined) {
'use strict';

global.Circle = function(radius) {
    Collidable.call(this);

    this.x = 0;
    this.y = 0;
    this.r = radius;
}
Circle.extend(Collidable);

Circle.prototype.move = function(x, y) {
    this.x += x;
    this.y += y;
}

Circle.prototype.getPosition = function() {
    return new Vec2(this.x, this.y);
}

Circle.prototype.copy = function() {
    var e = new Circle(this.r);
    e.x = this.x;
    e.y = this.y;
    return e;
}

Circle.prototype.getRadius = function() {
    return this.r;
}

})(global);
