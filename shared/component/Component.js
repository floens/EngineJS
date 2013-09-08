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
    _registeredComponents.set(id, true);
    component.prototype.id = id;
    component.id = id;
}

})(global);
