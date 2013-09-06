(function(global, undefined) {
'use strict';

global.CircleRenderComponent = function(color) {
    RenderComponent.call(this);

    this.color = color;
}
CircleRenderComponent.extend(RenderComponent);

CircleRenderComponent.prototype.render = function(system, entity) {
    var position = entity.getComponent(PositionComponent),
        coll = entity.getComponent(CollidableComponent);

    if (!(coll instanceof CircleCollidableComponent)) {
        throw new Error('CircleRenderComponent: Collidable not a circle!');
    }

    system.canvas.fillCircle(position.x, position.y, coll.bb.getRadius(), this.color);
}

CircleRenderComponent.prototype.setColor = function(color) {
    this.color = color;
}


})(global);
