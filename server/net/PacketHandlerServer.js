(function(global, undefined) {
'use strict';

global.PacketHandlerServer = function() {
    PacketHandler.call(this);

    this.world = null;
}
PacketHandlerServer.extend(PacketHandler);

PacketHandlerServer.prototype.setWorld = function(world) {
    this.world = world;
}

PacketHandlerServer.prototype.handlePacket = function(packet) {
    switch(packet.id) {
        case HandshakePacket.id:
            log(packet.message);

            this.sendPacket(new HandshakePacket('hello'));

            break;
    }
}

PacketHandlerServer.prototype.onConnect = function() {
}

PacketHandlerServer.prototype.onDisconnect = function() {
}

})(global);
