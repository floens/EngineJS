(function(global) {
'use strict';

global.BlockChangeComponent = function() {
    Component.call(this);

    this.pendingChanges = [];
}
BlockChangeComponent.extend(Component);
Component.registerComponent(BlockChangeComponent, 107);

BlockChangeComponent.prototype.addChange = function(x, y, z, id) {
    var from = this.getWorld().getSystem(VoxelWorld).getTile(x, y, z);

    this.pendingChanges.push(new BlockChange(x, y, z, from, id));
}

BlockChangeComponent.prototype.clearChanges = function() {
    this.pendingChanges = [];
}


BlockChangeComponent.prototype.getChanges = function() {
    return this.pendingChanges;
}


var BlockChange = function(x, y, z, from, to) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.from = from;
    this.a = to;
}

})(global);
