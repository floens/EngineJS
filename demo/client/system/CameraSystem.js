(function(global) {
'use strict';

global.CameraSystem = function() {
    System.call(this);

    this.addAspect(CameraComponent);
    this.addAspect(PlayerPositionComponent);
}
CameraSystem.extend(System);
System.registerSystem(CameraSystem, 103);

CameraSystem.prototype.tick = function() {
    for (var i = 0; i < this.entities.length; i++) {
        this.processEntity(this.entities[i]);
    }
}

CameraSystem.prototype.processEntity = function(entity) {
    var pos = entity.getComponent(PlayerPositionComponent);
    var camera = entity.getComponent(CameraComponent);

    camera.x = pos.x + 0.4;
    camera.y = pos.y + 1.7;
    camera.z = pos.z + 0.4;
    camera.rotateX = pos.pitch;
    camera.rotateY = pos.yaw;

    // Engine.setDebugText((Math.round(camera.x * 100) / 100) + ', ' + (Math.round(camera.y * 100) / 100) + ', ' + (Math.round(camera.z * 100) / 100));
}


})(global);
