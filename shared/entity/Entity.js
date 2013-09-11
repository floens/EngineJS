(function(global, undefined) {
'use strict';

global.Entity = function(world) {
    if (!(world instanceof World)) throw new Error('Entity: No world given.');

    this.sessionId = -1; // UID for this entity

    this.removed = false;

    this.components = new Map();

    this.world = world;
}

// Set sessionId for this entity
Entity.prototype.setSessionId = function(e) {
    if (!Utils.isNumber(e)) throw new Error('Entity: SessionId not a number.');
    this.sessionId = e;
}

// Add this entity to the world
Entity.prototype.add = function() {
    this.world.addEntity(this);
}

// Remove this entity from the world
Entity.prototype.remove = function() {
    this.removed = true;
}

Entity.prototype.addComponent = function(component) {
    if (this.components.has(component.id)) throw new Error('Entity: Component already added.');
	this.components.set(component.id, component);
}

Entity.prototype.getComponent = function(component) {
    var value = this.components.get(component.id);
    if (value == null) throw new Error('Entity: Component not found on this entity.');
    return value;
}

Entity.prototype.toString = function() {
    return '[object Entity]';
}

// Static functions
var _registeredEntities = new Map();
Entity.registerEntity = function(entity, id) {
    if (!Utils.isNumber(id)) throw new Error('Id not a number.');
    if (id <= 0) throw new Error('Invalid argument: Id below 1 reserved.');
    if (_registeredEntities.has(id)) {
        throw new Error('Entity with id already registered (' + id + ')');
    }
    _registeredEntities.set(id, true);
    entity.prototype.id = id;
    entity.id = id;
}

Entity.getEntityClass = function(id) {
    if (_registeredEntities.has(id)) {
        return _registeredEntities.get(id);
    } else {
        throw new Error('Entity with id (' + id + ') not registered.');
    }
}

})(global);
