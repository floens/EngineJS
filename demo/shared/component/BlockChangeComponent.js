(function(global) {
'use strict';

global.BlockChangeComponent = function() {
    Component.call(this);

    this.pendingChanges = [];
}
BlockChangeComponent.extend(Component);
Component.registerComponent(BlockChangeComponent, 107);

BlockChangeComponent.prototype.addChange = function(x, y, z, id) {
    this.pendingChanges.push(new Vec4(x, y, z, id));
}

BlockChangeComponent.prototype.clearChanges = function() {
    this.pendingChanges = [];
}


BlockChangeComponent.prototype.getChanges = function() {
    return this.pendingChanges;
}

})(global);
