(function(global, undefined) {
'use strict';

global.PacketHandler = function() {

}

PacketHandler.prototype.handlePacket = function(packet) {
    throw new Error('PacketHandler::handlePacket(packet) should be implemented.');
}

})(global);
