(function(global, undefined) {
'use strict';

global.EntityBox = function(world, width, height) {
    Entity.call(this, world);

    this.addComponent(new PositionComponent());
    this.addComponent(new CollidableComponent(width, height));

    this.addComponent(new BoxRenderComponent('blue'));

    this.getComponent(CollidableComponent).bb.move(100, 100);
}
EntityBox.extend(Entity);
Entity.registerEntity(EntityBox, 2);



})(global);
