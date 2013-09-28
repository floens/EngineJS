(function(global, undefined) {
'use strict';

global.PacketHandler = function() {
    this._netHandler = null;
}

PacketHandler.prototype.setNetHandler = function(netHandler) {
    this._netHandler = netHandler;
}

PacketHandler.prototype.handlePacket = function(packet) {
    throw new Error('PacketHandler::handlePacket(packet) should be implemented.');
}

PacketHandler.prototype.sendPacket = function(packet) {
    this._netHandler.writeConnection(packet);
}

PacketHandler.prototype.onConnect = function() {
}

PacketHandler.prototype.onDisconnect = function() {
}

})(global);
