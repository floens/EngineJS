(function(global, undefined) {
'use strict';

global.PacketHandler = function() {
    this._netHandler = null;
}

PacketHandler.prototype.setNetHandler = function(netHandler) {
    this._netHandler = netHandler;
}

PacketHandler.prototype.getNetHandler = function() {
    return this._netHandler;
}

PacketHandler.prototype.tick = function() {
    
}

PacketHandler.prototype.handlePacket = function(packet) {
    throw new Error('PacketHandler::handlePacket(packet) should be implemented.');
}

PacketHandler.prototype.sendPacket = function(packet) {
    if (this._netHandler != null) {
        this._netHandler.writeConnection(packet);
    }
}

PacketHandler.prototype.onConnect = function() {
}

PacketHandler.prototype.onDisconnect = function() {
}

PacketHandler.prototype.onError = function() {
}

})(global);
