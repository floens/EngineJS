(function(global) {
'use strict';

global.ParticleSystem = function() {
    System.call(this);

    this.addOrAspect(BlockChangeComponent);
    this.addOrAspect(ParticleComponent);
}
ParticleSystem.extend(System);
System.registerSystem(ParticleSystem, 108);

ParticleSystem.prototype.tick = function() {
    for (var i = 0; i < this.entities.length; i++) {
        if (this.entities[i].hasComponent(BlockChangeComponent)) {
            this.processChangeEntity(this.entities[i]);
        }
        if (this.entities[i].hasComponent(ParticleComponent)) {
            this.processParticle(this.entities[i]);
        }
    }
}

ParticleSystem.prototype.processParticle = function(entity) {
    var comp = entity.getComponent(ParticleComponent);

    if (comp.lifeTime-- < 0) {
        entity.remove();
    }
}

ParticleSystem.prototype.createParticle = function(x, y, z, id) {
    for (var i = 0, j = 10 + Random.int(30); i < j; i++) {

        var size = 0.05 + Random.float() * 0.1;

        var particle = new EntityParticle(this.getWorld());
        particle.setSessionId(0);
        particle.getComponent(ParticleComponent).lifeTime = 30 + Random.int(60);

        var model = particle.getComponent(ParticleModel);
        model.setInfo(Block[id].textureFrontX + (Random.float() * 0.8), 
            Block[id].textureFrontY + (Random.float() * 0.8), size, size);

        var pos = particle.getComponent(PlayerPositionComponent);
        pos.xa = Random.evenFloat() * 0.2;
        pos.ya = Random.float() * 0.1;
        pos.za = Random.evenFloat() * 0.2;
        pos.x = x + Random.float();
        pos.y = y + Random.float();
        pos.z = z + Random.float();
        pos.deceleration = 0.85;
        pos.width = size;
        pos.height = size;
        pos.depth = size;

        particle.add();
    }
}

ParticleSystem.prototype.processChangeEntity = function(entity) {
    var change = entity.getComponent(BlockChangeComponent);
    var changes = change.getChanges();

    for (var i = 0; i < changes.length; i++) {
        var e = changes[i];

        if (e.a == 0) {
            if (e.from >= 0) {
                this.createParticle(e.x, e.y, e.z, e.from);
            }
        }
    }
}


})(global);
