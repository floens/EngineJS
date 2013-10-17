(function(global, undefined) {
'use strict';

global.Component = function() {

}

Component.prototype.toString = function() {
    return '[object Component]';
}

// Static functions
var _registeredComponents = new Map();
Component.registerComponent = function(component, id) {
    if (!Utils.isNumber(id)) throw new Error('Id not a number.');
    if (id <= 0) throw new Error('Invalid argument: Id below 1 reserved.');
    if (_registeredComponents.has(id)) {
        throw new Error('Component with id already registered (' + id + ')');
    }
    _registeredComponents.set(id, component);
    try {
        component.prototype.id = id;
        component.id = id;
    } catch(err) {
    }
}

Component.getComponentClass = function(id) {
    if (_registeredComponents.has(id)) {
        return _registeredComponents.get(id);
    } else {
        throw new Error('Component with id (' + id + ') not registered.');
    }
}

})(global);
