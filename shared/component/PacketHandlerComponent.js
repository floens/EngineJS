(function(global, undefined) {
'use strict';

global.PacketHandlerComponent = function(packetHandler) {
    Component.call(this);

    this.packetHandler = packetHandler;

    this.pendingPackets = [];
    this.pendingBroadcasts = [];
    this.pendingExceptBroadcasts = [];
}
PacketHandlerComponent.extend(Component);
Component.registerComponent(PacketHandlerComponent, 3);

PacketHandlerComponent.prototype.addPacket = function(packet) {
    this.pendingPackets.push(packet);
}

PacketHandlerComponent.prototype.addBroadcast = function(packet) {
    this.pendingBroadcasts.push(packet);
}

PacketHandlerComponent.prototype.addExceptBroadcast = function(packet) {
    this.pendingExceptBroadcasts.push(packet);
}

})(global);
