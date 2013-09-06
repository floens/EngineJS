(function(global, undefined) {
'use strict';

global.YourEntity = function(world) {
    EntityToExtend.call(this, world);

    this.addComponent(new YourComponent());
}
YourEntity.extend(EntityToExtend);
EntityToExtend.registerEntity(YourEntity, NUMBER_HERE);



})(global);
