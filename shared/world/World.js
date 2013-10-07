(function(global, undefined) {
'use strict';

global.World = function(width, height) {
    this.remote = true;

    this.tickCount = 0;

    this.sessionIdCounter = 0;
    this.entities = [];
    this.systems = [];

    this.entitySessionIdMap = new Map();
    this.systemIdMap = new Map();
}

// Called from managers
World.prototype.tick = function() {
    this.tickSystems();
    
    this.removeEntities();

    this.tickCount++;
}

// Process all systems on the render loop
World.prototype.render = function() {
    var list = this.systems;
    for (var i = 0, j = list.length; i < j; i++) {
        if (list[i].getLoopType() == System.RENDER_LOOP) {
            list[i].process();
        }
    }
}

// Process all systems on the tick loop
World.prototype.tickSystems = function() {
    var list = this.systems;
    for (var i = 0, j = list.length; i < j; i++) {
        if (list[i].getLoopType() == System.TICK_LOOP) {
            list[i].process();
        }
    }
}

/**
 * A world is remote when it was created by a server, e.g. multiplayer.
 * A remote world behaves differently wrom a non-remote world in that the systems don't get called.
 * Entities in a remote world should change position and animation from the server.
 * @param  {boolean} remote
 */
World.prototype.setRemote = function(remote) {
    this.remote = remote;
}

/**
 * Add a system to this world
 * @param  {System} system
 */
World.prototype.addSystem = function(system) {
    if (!(system instanceof System)) throw new Error('Not a System.');
    this.systems.push(system);
    this.systemIdMap.set(system.id, system);
}

/**
 * Return system or throw error
 * @param  {System} System class
 * @return {System} System instance
 */
World.prototype.getSystem = function(system) {
    var value = this.systemIdMap.get(system.id);
    if (value == null) throw new Error('System not found on this world.');
    return value;
}

/**
 * Add an entity to this world
 * @param  {Entity} entity 
 */
World.prototype.addEntity = function(entity) {
    if (!(entity instanceof Entity)) throw new Error('Not an Entity.');
    this.entities.push(entity);

    if (entity.sessionId < 0) {
        entity.setSessionId(++this.sessionIdCounter);
    }

    this.entitySessionIdMap.set(entity.sessionId, entity);

    for (var i = 0; i < this.systems.length; i++) {
        this.systems[i]._tryAddEntity(entity);
    }
}

World.prototype.removeEntities = function() {
    for (var i = 0; i < this.entities.length; i++) {
        if (this.entities[i].removed) {
            var entity = this.entities[i];

            if (entity.sessionId >= 0) {
                this.entitySessionIdMap.remove(entity.sessionId);
            }

            this.entities.splice(i, 1);
            i--;

            for (var j = 0; j < this.systems.length; j++) {
                this.systems[j]._tryRemoveEntity(entity);
            }
        }
    }
}

World.prototype.getEntityById = function(id) {
    if (id < 0) throw new Error('World: Id below zero.');
    return this.entitySessionIdMap.get(id);
}

})(global);