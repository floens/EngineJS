(function(global) {
'use strict';

/**
 * Base class for all entities.
 * @param {World} world the world this entity is bound to
 * @class Entity
 * @constructor
 */
global.Entity = function(world) {
    if (!(world instanceof World)) throw new Error('Entity: No world given.');

    this.sessionId = -1; // UID for this entity

    this.removed = false;

    this.components = new Map();

    this.world = world;
}

/**
 * Set the entity session id. If -1 (the default value) the world will asign a value.
 * If 0, the world will *not* assign a value.
 * Set the sessionId to 0 if this entity is in a remote world, but client only.
 * @param {[type]} e
 * @method setSessionId
 */
Entity.prototype.setSessionId = function(e) {
    if (!Utils.isNumber(e)) throw new Error('Entity: SessionId not a number.');
    this.sessionId = e;
}

/**
 * Add the entity to the world.
 * @method add
 */
Entity.prototype.add = function() {
    this.world.addEntity(this);
}

/**
 * Remote the entity from the world.
 * @method remove
 */
Entity.prototype.remove = function() {
    this.removed = true;
}

/**
 * Returns true if this entity has an instance of the component.
 * @param  {Component} Component class
 * @return {Boolean}
 * @method hasComponent
 */
Entity.prototype.hasComponent = function(component) {
    return this.components.has(component.id);
}

/**
 * Add an instance of a component to this entity.
 * @param {Component} Component instance
 * @method addComponent
 */
Entity.prototype.addComponent = function(component) {
    if (this.components.has(component.id)) throw new Error('Entity: Component already added.');
    this.components.set(component.id, component);
    component._world = this.world;
}

/**
 * Get a component from this entity. 
 * @param  {component} Component class
 * @return {component} Component instance
 * @method getComponent
 */
Entity.prototype.getComponent = function(component) {
    var value = this.components.get(component.id);
    if (value == null) throw new Error('Entity: Component not found on this entity.');
    return value;
}

/**
 * Called when the entity is removed from the world.
 */
Entity.prototype.onRemove = function() {
}

Entity.prototype.toString = function() {
    return '[object Entity]';
}

// Static functions
var _registeredEntities = new Map();

/**
 * Register a entity class.
 * @param  {Entity} Entity class
 * @param  {number} Unique number above 0
 * @method registerEntity
 * @static
 */
Entity.registerEntity = function(entityClass, id) {
    if (!Utils.isNumber(id)) throw new Error('Id not a number.');
    if (id <= 0) throw new Error('Invalid argument: Id below 1 reserved.');
    if (_registeredEntities.has(id)) {
        throw new Error('Entity with id already registered (' + id + ')');
    }
    _registeredEntities.set(id, entityClass);
    try {
        entityClass.prototype.id = id;
        entityClass.id = id;
    } catch(err) {
    }
}

/**
 * Get an entity class by id.
 * @param  {number} id
 * @return {Entity} Entity class
 * @method getEntityClass
 * @static
 */
Entity.getEntityClass = function(id) {
    if (_registeredEntities.has(id)) {
        return _registeredEntities.get(id);
    } else {
        throw new Error('Entity with id (' + id + ') not registered.');
    }
}

})(global);
