(function(global, undefined) {
'use strict';

global.EntityTracker = function(map) {
    this.map = map;
    this.entries = [];

    this.tickCount = 0;

    this.tileSets = {};
    this.cachedTileSets = {};
    this.cachedBytes = 0;
    this.sendTimeout = 0;
}

EntityTracker.prototype.tick = function() {
    var players = this.map.getPlayers();

    var list = this.entries;
    for (var i = 0; i < list.length; i++) {
        list[i].updatePlayers(players);
    }

    for (i = 0; i < list.length; i++) {
        list[i].updateToPlayers();
    }

    this.doTileSets();

    this.cachedBytes += NetManager.getTotalOutBytes();
    if (this.tickCount % 60 == 0) {
        this.sendTimeout = 1;
        if (this.cachedBytes >  20000) this.sendTimeout = 2;
        if (this.cachedBytes >  40000) this.sendTimeout = 4;
        if (this.cachedBytes >  80000) this.sendTimeout = 8;
        if (this.cachedBytes > 100000) this.sendTimeout = 10;
        if (this.cachedBytes > 120000) this.sendTimeout = 20;
        if (this.cachedBytes > 200000) {
            // log('EntityTracker: A lot of outbound data! (more than 200000 bytes/s)', log.WARN);
            this.sendTimeout = 30;
        }
        this.cachedBytes = 0;
    }

    if (this.tickCount % this.sendTimeout == 0) this.doCachedTileSets();

    this.tickCount++;
}

EntityTracker.prototype.sendTileSet = function(x, y, id) {
    if (Tile.WATER.isIdWater(id) && Tile.WATER.isWater(this.map, x, y)) {
        this.cachedTileSets[x + ',' + y] = new Vec3(x, y, id);  
    } else {
        delete this.cachedTileSets[x + ',' + y];
        this.tileSets[x + ',' + y] = new Vec3(x, y, id);        
    }
}

EntityTracker.prototype.doTileSets = function() {
    for (var i in this.tileSets) {
        var j = this.tileSets[i];

        this.broadcast(Protocol.encode(Protocol.SET_TILE, {
            x: j.x,
            y: j.y,
            id: j.z
        }));

        delete this.tileSets[i];
    }
}

EntityTracker.prototype.doCachedTileSets = function() {
    for (var i in this.cachedTileSets) {
        var j = this.cachedTileSets[i];

        this.broadcast(Protocol.encode(Protocol.SET_TILE, {
            x: j.x,
            y: j.y,
            id: j.z
        }));

        delete this.cachedTileSets[i];
    }
}

EntityTracker.prototype.addEntity = function(entity) {
    var entry = new EntityTrackerEntry(entity);
    this.entries.push(entry);
}

EntityTracker.prototype.removeEntity = function(entity) {
    var list = this.entries;
    for (var i = 0; i < list.length; i++) {
        if (list[i].entity.id == entity.id) {
            list[i].onRemove();
            list.splice(i, 1);
            return true;
        }
    }

    log('EntityTracker: Entry to remove not found.');
    return false;
}

EntityTracker.prototype.broadcast = function(message) {
    var players = this.map.getPlayers();
    for (var i = 0; i < players.length; i++) {
        players[i].netHandler.sendMessage(message);
    }
}

})(global);
