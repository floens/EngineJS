(function(global, undefined) {
'use strict';

global.PacketHandlerClient = function() {
    PacketHandler.call(this);

    this.world = null;
}
PacketHandlerClient.extend(PacketHandler);

PacketHandlerClient.prototype.handlePacket = function(packet) {
    switch(packet.id) {
        case HandshakePacket.id:
            log(packet.message);

            break;
    }
}

PacketHandlerClient.prototype.onConnect = function() {
    var handshake = new HandshakePacket('Hey guis');

    this.sendPacket(handshake);
}

PacketHandlerClient.prototype.setWorld = function(world) {
    this.world = world;
}

})(global);
