(function(global, undefined) {
'use strict';

global.RemoteServerSystem = function(options) {
    System.call(this);

    this.addAspect(PositionComponent);
    this.addAspect(RemoteComponent);
}
RemoteServerSystem.extend(System);
System.registerSystem(RemoteServerSystem, 6);

RemoteServerSystem.prototype.tick = function() {
    this.parent.tick.call(this);

    for (var i = 0; i < this.entities.length; i++) {
        this.processEntity(this.entities[i]);
    }
}

RemoteServerSystem.prototype.processEntity = function(entity) {

}


})(global);
