(function(global, undefined) {
'use strict';

global.PositionComponent = function() {
    Component.call(this);

    this.x = 0;
    this.y = 0;
    this.xa = 0;
    this.ya = 0;
    this.width = 0;
    this.height = 0;
}
PositionComponent.extend(Component);
Component.registerComponent(PositionComponent, 1);

})(global);
