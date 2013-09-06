(function(global, undefined) {
'use strict';

global.MovementSystem = function() {
    System.call(this);

    this.tickSystem = true;

    this.addAspect(PositionComponent);
    this.addAspect(CollidableComponent);

    this.tickCount = 0;
}
MovementSystem.extend(System);
System.registerSystem(MovementSystem, 1);



MovementSystem.prototype.tick = function() {
    this.parent.tick.call(this);

    for (var i = 0; i < this.entities.length; i++) {
        this.processEntity(this.entities[i]);
    }

    this.tickCount++;
}

MovementSystem.prototype.processEntity = function(entity) {
    var position = entity.getComponent(PositionComponent),
        collidable = entity.getComponent(CollidableComponent),
        selfBB = collidable.getBB();

    position.xa *= 0.97;
    position.ya *= 0.97;

    // position.ya += 0.2;

    collidable.x = position.x;
    collidable.y = position.y;
    collidable.xa = position.xa;
    collidable.ya = position.ya;
    selfBB.setPosition(position.x, position.y);

    for (var i = 0; i < this.entities.length; i++) {
        var other = this.entities[i];
        if (other.sessionId == entity.sessionId) continue;

        var otherCollidable = other.getComponent(CollidableComponent),
            otherBB = otherCollidable.getBB(),
            otherPos = other.getComponent(PositionComponent);

        if (selfBB.collidesWith(otherBB, collidable.xa, collidable.ya)) {
            this.resolveCollision(collidable, otherCollidable);

            selfBB.setPosition(collidable.x, collidable.y);
            otherBB.setPosition(otherCollidable.x, otherCollidable.y);
        }
    }

    collidable.x += collidable.xa;
    collidable.y += collidable.ya;

    position.x = collidable.x;
    position.y = collidable.y;
    position.xa = collidable.xa;
    position.ya = collidable.ya;
}

MovementSystem.prototype.resolveCollision = function(oneCol, twoCol) {
    var relativeVelocityX = twoCol.xa - oneCol.xa,
        relativeVelocityY = twoCol.ya - oneCol.ya;

    var normal = _normalize(twoCol.x - oneCol.x, twoCol.y - oneCol.y),
        normalX = normal[0],
        normalY = normal[1];
        
    var velocityAlongNormal = _dotProduct(relativeVelocityX, relativeVelocityY, normalX, normalY);

    if (velocityAlongNormal > 0) return;

    var e = Math.min(oneCol.elasticity, twoCol.elasticity);

    var j = (-(1 + e) * velocityAlongNormal) / (oneCol.invertedMass + twoCol.invertedMass);

    var impulseX = j * normalX,
        impulseY = j * normalY;

    oneCol.xa -= oneCol.invertedMass * impulseX;
    oneCol.ya -= oneCol.invertedMass * impulseY;

    twoCol.xa += twoCol.invertedMass * impulseX;
    twoCol.ya += twoCol.invertedMass * impulseY;

    oneCol.x += oneCol.xa;
    oneCol.y += oneCol.ya;

    twoCol.x += twoCol.xa;
    twoCol.y += twoCol.ya;
}

var _normalize = function(x, y) {
    var length = Math.sqrt(x * x + y * y);
    x = x / length;
    y = y / length;
    return [x, y];
}

var _dotProduct = function(x0, y0, x1, y1) {
    return x0 * x1 + y0 * y1;
}


})(global);
