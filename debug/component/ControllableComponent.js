(function(global, undefined) {
'use strict';

global.ControllableComponent = function() {
    Component.call(this);

    this.acceleration = 3;
    // this.deceleration = 0.95;
    this.deceleration = 1;
    this.maxSpeed = 6;
}
ControllableComponent.extend(Component);
Component.registerComponent(ControllableComponent, 3);


})(global);
