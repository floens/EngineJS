(function(global) {
'use strict';

global.EntityPlayer = function(world) {
    Entity.call(this, world);

    this.addComponent(new PlayerPositionComponent());
    this.addComponent(new BlockChangeComponent());
}
EntityPlayer.extend(Entity);
Entity.registerEntity(EntityPlayer, 100);

    
})(global);
