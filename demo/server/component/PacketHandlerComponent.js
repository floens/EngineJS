(function(global, undefined) {
'use strict';

global.PacketHandlerComponent = function(packetHandler) {
    Component.call(this);

    this.packetHandler = packetHandler;
}
PacketHandlerComponent.extend(Component);
Component.registerComponent(PacketHandlerComponent, 100);

})(global);
