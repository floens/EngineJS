(function(global, undefined) {
'use strict';

global.EntityCircle = function(world, radius) {
    Entity.call(this, world);

    this.addComponent(new PositionComponent());
    this.addComponent(new CircleCollidableComponent(radius));

    this.addComponent(new CircleRenderComponent('red'));

    this.getComponent(PositionComponent).x = 200;
    this.getComponent(PositionComponent).y = 200;
}
EntityCircle.extend(Entity);
Entity.registerEntity(EntityCircle, 3);


})(global);
