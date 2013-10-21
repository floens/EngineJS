(function(global) {
'use strict';

global.World = function(width, height) {
    this.tickCount = 0;

    this.sessionIdCounter = 1;
    this.entities = [];
    this.systems = [];

    this.entitySessionIdMap = new Map();
    this.systemIdMap = new Map();
}

// Called from managers
World.prototype.tick = function() {
    this.tickSystems();
    
    this._removeEntities();

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
 * Add a system to this world
 * @param  {System} system
 */
World.prototype.addSystem = function(system) {
    if (!(system instanceof System)) throw new Error('Not a System.');
    this.systems.push(system);
    this.systemIdMap.set(system.id, system);
}

/**
 * Remove an system 
 * @param  {System} system The class of the system
 * @return {boolean}       True if system was removed, false otherwise
 */
World.prototype.removeSystem = function(system) {
    var wasRemoved = false;
    for (var i = 0; i < this.systems.length; i++) {
        if (this.systems[i].id == system.id) {
            this.systems[i].onRemove();
            this.systems.splice(i, 1);
            this.systemIdMap.remove(system.id);
            wasRemoved = true;
            break;
        }
    }

    return wasRemoved;
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

World.prototype._removeEntities = function() {
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

World.prototype.clearEntities = function() {
    for (var i = 0; i < this.entities.length; i++) {
        this.entities[i].remove();
    }
}

World.prototype.getEntityById = function(id) {
    if (id < 0) throw new Error('World: Id below zero.');
    return this.entitySessionIdMap.get(id);
}

})(global);