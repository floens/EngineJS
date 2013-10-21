(function(global) {
'use strict';

global.EntityParticle = function(world) {
    Entity.call(this, world);

    var pos = new PlayerPositionComponent();
    this.addComponent(pos);
    this.addComponent(new ParticleModel());
    this.addComponent(new ParticleComponent());
}
EntityParticle.extend(Entity);
Entity.registerEntity(EntityParticle, 101);

    
})(global);
