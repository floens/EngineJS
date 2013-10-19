(function(global) {
'use strict';

global.ControlComponent = function() {
    Component.call(this);

    this.barCount = 9;
    this.barBlocks = [1, 2, 3, 4, 5, 6, 7, 8, 1];
    this.barIndex = 0;
}
ControlComponent.extend(Component);
Component.registerComponent(ControlComponent, 106);

})(global);
