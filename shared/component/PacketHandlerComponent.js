(function(global) {
'use strict';

/**
 * PacketHandlerComponent takes a PacketHandler as first argument. 
 * It allows you to send packets to clients without having a reference to the packethandler.
 * TrackerSystem listens to this component.
 * 
 * @param {PacketHandler} packetHandler
 * @class PacketHandlerComponent
 * @constructor
 * @extends {Component}
 */
global.PacketHandlerComponent = function(packetHandler) {
    Component.call(this);

    this.packetHandler = packetHandler;

    this.pendingPackets = [];
    this.pendingBroadcasts = [];
    this.pendingExceptBroadcasts = [];
}
PacketHandlerComponent.extend(Component);
Component.registerComponent(PacketHandlerComponent, 3);

/**
 * Add a packet to be send to the client
 * @method addPacket
 * @param {Packet} packet
 */
PacketHandlerComponent.prototype.addPacket = function(packet) {
    this.pendingPackets.push(packet);
}

/**
 * Add a packet to be broadcasted to all clients
 * @method addBroadcast
 * @param {Packet} packet
 */
PacketHandlerComponent.prototype.addBroadcast = function(packet) {
    this.pendingBroadcasts.push(packet);
}

/**
 * Add a packet to be broadcasted to all clients, except the own client
 * @method addExceptBroadcast
 * @param {Packet} packet
 */
PacketHandlerComponent.prototype.addExceptBroadcast = function(packet) {
    this.pendingExceptBroadcasts.push(packet);
}

})(global);
