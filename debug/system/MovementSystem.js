(function(global, undefined) {
'use strict';

global.MovementSystem = function() {
    System.call(this);

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
    var position = entity.getComponent(PositionComponent);

    position.xa *= 0.97;
    position.ya *= 0.97;

    position.x += position.xa;
    position.y += position.ya;
}


})(global);
