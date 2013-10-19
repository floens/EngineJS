(function(global) {
'use strict';

global.CameraComponent = function() {
    Component.call(this);

    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.rotateX = 0;
    this.rotateY = 2;
    this.rotateZ = 0;
}
CameraComponent.extend(Component);
Component.registerComponent(CameraComponent, 103);



})(global);
