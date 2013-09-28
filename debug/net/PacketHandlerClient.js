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

            break;
        case DisconnectPacket.id:
            UIManager.set(new UIText('Disconnected: ' + packet.reason));

            break;
    }
}

PacketHandlerClient.prototype.onError = function() {
    UIManager.set(new UIText('Connection error'));
}

PacketHandlerClient.prototype.onConnect = function() {
    var handshake = new HandshakePacket('Hey guis');

    this.sendPacket(handshake);
}

PacketHandlerClient.prototype.onDisconnect = function() {
    UIManager.set(new UIText('Disconnected'));
}

PacketHandlerClient.prototype.setWorld = function(world) {
    this.world = world;
}

})(global);
