(function(global, undefined) {
'use strict';

global.System = function() {
    /**
     * Is this system on the tick or render loop
     * True if on tick loop
     * False if on render loop
     * @type {Boolean}
     */
    this._loopType = System.TICK_LOOP;

    this.aspects = [];

    this.entities = [];
}

System.prototype.addEntity = function(entity) {
    if (this.interested(entity)) {
        this.entities.push(entity);
    }
}

System.prototype.removeEntity = function(entity) {
    for (var i = 0; i < this.entities.length; i++) {
        if (this.entities[i].id == entity.id) {
            this.entities.splice(i, 1);
            return true;
        }
    }
    return false;
}

System.prototype.addAspect = function(aspect) {
    this.aspects.push(aspect);
}

System.prototype.process = function() {
    this.tick();
}

System.prototype.interested = function(entity) {
    for (var i = 0; i < this.aspects.length; i++) {
        var component = this.aspects[i];

        if (!entity.components.has(component.id)) return false;
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
    system.prototype.id = id;
    system.id = id;
}

System.TICK_LOOP = 0;
System.RENDER_LOOP = 1;

})(global);
