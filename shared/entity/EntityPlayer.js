(function(global, undefined) {
'use strict';

global.EntityPlayer = function(world) {
    Entity.call(this, world);

    this.addComponent(new PositionComponent());
    this.addComponent(new CollidableComponent(64, 96));
}
EntityPlayer.extend(Entity);
Entity.registerEntity(EntityPlayer, 1);



})(global);
