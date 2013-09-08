(function(global, undefined) {
'use strict';

global.PacketHandlerClient = function() {

}
PacketHandlerClient.extend(PacketHandler);

PacketHandlerClient.prototype.handlePacket = function(packet) {
    if (packet instanceof HandshakePacket) {
        log(packet, true);
    }
}

})(global);
