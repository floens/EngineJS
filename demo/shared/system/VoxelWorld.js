(function(global, undefined) {
'use strict';

global.VoxelWorld = function(width, height, depth) {
    System.call(this);
    this.addAspect(BlockChangeComponent);

    this.width = width;
    this.height = height;
    this.depth = depth;

    this.tileArray = new Int8Array(width * height * depth);
    this.dirtyTiles = [];
}
VoxelWorld.extend(System);
System.registerSystem(VoxelWorld, 107);

VoxelWorld.prototype.tick = function() {
    for (var i = 0; i < this.entities.length; i++) {
        this.processEntity(this.entities[i]);
    }
}

VoxelWorld.prototype.processEntity = function(entity) {
    var change = entity.getComponent(BlockChangeComponent);
    var changes = change.getChanges();

    for (var i = 0; i < changes.length; i++) {
        var e = changes[i];
        if (e.a >= 0) {
            this.setTile(e.x, e.y, e.z, e.a);
        }
        
        this.setTileDirty(e.x, e.y, e.z);
    }

    change.clearChanges();
}

VoxelWorld.prototype.generate = function() {
    for (var x = 0; x < this.width; x++) {
        for (var y = 0; y < this.height; y++) {
            for (var z = 0; z < this.depth; z++) {
                if (y < 10) {
                    this.setTile(x, y, z, Block.STONE.id);
                } else if (y < 20) {
                    this.setTile(x, y, z, Block.DIRT.id);
                } else if (y == 20) {
                    this.setTile(x, y, z, Block.GRASS.id);
                }
            }
        }
    }

    for (var x = 0; x < this.width; x++) {
        for (var z = 0; z < this.depth; z++) {
            this.setTile(x, 0, z, Block.STONE.id);
        }
    }

    for (var i = 0; i < 10000; i++) {
        // this.setTile(Random.int(this.width), Random.int(this.height), Random.int(this.depth), Block.GRASS.id);
    }
}

VoxelWorld.prototype.getTile = function(x, y, z) {
    if (x < 0 || y < 0 || z < 0 || x >= this.width || y >= this.height || z >= this.depth) return -1;

    var id = x + (z * this.width) + (y * this.width * this.depth);

    return this.tileArray[id];
}

VoxelWorld.prototype.setTile = function(x, y, z, what) {
    if (x < 0 || y < 0 || z < 0 || x >= this.width || y >= this.height || z >= this.depth) return false;

    var id = x + (z * this.width) + (y * this.width * this.depth);

    this.tileArray[id] = what;
    return true;
}

VoxelWorld.prototype.setTileDirty = function(x, y, z) {
    for (var i = 0; i < this.dirtyTiles.length; i++) {
        var e = this.dirtyTiles[i];
        if (e.x == x && e.y == y && e.z == z) return false;
    }

    this.dirtyTiles.push(new Vec3(x, y, z));
    return true;
}

VoxelWorld.prototype.getDirtyTiles = function() {
    return this.dirtyTiles;
}

VoxelWorld.prototype.clearDirtyTiles = function() {
    this.dirtyTiles = [];
}


})(global);
