(function(global) {
'use strict';

global.System = function() {
    this._loopType = System.TICK_LOOP;

    this._world = null;

    this.aspects = [];
    this.orAspects = [];

    this.entities = [];
}

System.prototype.getWorld = function() {
    return this._world;
}

System.prototype._tryAddEntity = function(entity) {
    if (this.interested(entity)) {
        this.entities.push(entity);
        
        this.addEntity(entity);
    }
}

System.prototype._tryRemoveEntity = function(entity) {
    for (var i = 0; i < this.entities.length; i++) {
        if (this.entities[i] == entity) {
            this.entities.splice(i, 1);

            this.removeEntity(entity);

            return true;
        }
    }
    return false;
}

/**
 * Called if a system is about to be removed from the world.
 * To be overridden.
 */
System.prototype.onRemove = function() {
    
}

/**
 * To be overridden.
 * @param {Entity} entity
 */
System.prototype.addEntity = function(entity) {
}

/**
 * To be overridden.
 * @param  {Entity} entity 
 */
System.prototype.removeEntity = function(entity) {
}

System.prototype.addAspect = function(aspect) {
    this.aspects.push(aspect);
}

System.prototype.addOrAspect = function(aspect) {
    this.orAspects.push(aspect);
}

System.prototype.process = function() {
    this.tick();
}

System.prototype.interested = function(entity) {
    for (var i = 0; i < this.aspects.length; i++) {
        if (!entity.components.has(this.aspects[i].id)) return false;
    }

    for (var i = 0; i < this.orAspects.length; i++) {
        if (entity.components.has(this.orAspects[i].id)) return true;
    }

    return true;
}

System.prototype.tick = function() {

}

System.prototype.setLoopType = function(type) {
    this._loopType = type;
}

System.prototype.getLoopType = function() {
    return this._loopType;
}

System.prototype.toString = function() {
    return '[object System]';
}

// Static functions
var _registeredSystems = new Map();
System.registerSystem = function(system, id) {
    if (!Utils.isNumber(id)) throw new Error('Id not a number.');
    if (id <= 0) throw new Error('Invalid argument: Id below 1 reserved.');
    if (_registeredSystems.has(id)) {
        throw new Error('System with id already registered (' + id + ')');
    }
    _registeredSystems.set(id, true);
    try {
        system.prototype.id = id;
        system.id = id;
    } catch(err) {
    }
}

System.TICK_LOOP = 0;
System.RENDER_LOOP = 1;

})(global);
