(function(global, undefined) {
'use strict';

global.EntityPointer = function(world) {
    Entity.call(this, world);

    this.addComponent(new RemotePositionComponent());
}
EntityPointer.extend(Entity);
Entity.registerEntity(EntityPointer, 100);

    
})(global);
