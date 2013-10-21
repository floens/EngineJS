(function(global) {
'use strict';

global.MovementSystem = function(voxelWorld) {
    System.call(this);

    this.addAspect(PlayerPositionComponent);

    this.voxelWorld = voxelWorld;
}
MovementSystem.extend(System);
System.registerSystem(MovementSystem, 102);

MovementSystem.prototype.tick = function() {
    for (var i = 0; i < this.entities.length; i++) {
        this.processEntity(this.entities[i]);
    }
}

MovementSystem.prototype.processEntity = function(entity) {
    var pos = entity.getComponent(PlayerPositionComponent);

    // TODO
    if (!(entity instanceof EntityPlayer)) {
        pos.ya -= pos.gravity;
        pos.xa *= pos.deceleration;
        pos.za *= pos.deceleration;
    }
    
    var xa = pos.xa;
    var ya = pos.ya;
    var za = pos.za;

    var lxa = xa;
    var lya = ya;
    var lza = za;

    var bb = new AABB(pos.x, pos.y, pos.z, pos.x + pos.width, pos.y + pos.height, pos.z + pos.depth);
    var extended = bb.expand(xa, ya, za);

    var list = [];
    for (var x = Math.floor(extended.minX); x < Math.ceil(extended.maxX); x++) {
        for (var y = Math.floor(extended.minY); y < Math.ceil(extended.maxY); y++) {
            for (var z = Math.floor(extended.minZ); z < Math.ceil(extended.maxZ); z++) {
                var tile = this.voxelWorld.getTile(x, y, z);
                if (tile < 0 || Block[tile] == null || Block[tile].solid) {
                    list.push(new AABB(x, y, z, x + 1, y + 1, z + 1));
                }
            }
        }
    }

    for (var i = 0; i < list.length; i++) {
        za = list[i].solveZ(za, bb);
    }
    bb.offset(0, 0, za);

    for (var i = 0; i < list.length; i++) {
        xa = list[i].solveX(xa, bb);
    }
    bb.offset(xa, 0, 0);

    for (var i = 0; i < list.length; i++) {
        ya = list[i].solveY(ya, bb);
    }
    bb.offset(0, ya, 0);

    pos.x = bb.minX;
    pos.y = bb.minY;
    pos.z = bb.minZ;

    pos.collidedX = lxa != xa;
    pos.collidedY = lya != ya;
    pos.collidedZ = lza != za;

    if (pos.collidedX) pos.xa = 0;
    if (pos.collidedY) pos.ya = 0;
    if (pos.collidedZ) pos.za = 0;

    pos.onGround = pos.collidedY && lya < 0;

    if (Math.abs(pos.xa) < 1e-3) pos.xa = 0;
    if (Math.abs(pos.ya) < 1e-3) pos.ya = 0;
    if (Math.abs(pos.za) < 1e-3) pos.za = 0;
}


})(global);
