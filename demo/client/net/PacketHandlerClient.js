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
        case CreateEntityPacket.id:
            var entity = packet.process(this.world);
            entity.add();

            break;
        case UpdateComponentPacket.id:
            var entity = this.world.getEntityById(packet.sessionId);

            if (entity != null) {
                entity.getComponent(packet.component).set(packet.component);
            } 

            break;
        case DestroyEntityPacket.id:
            var entity = this.world.getEntityById(packet.sessionId);

            if (entity != null) {
                entity.remove();
            }

            break;
        case DisconnectPacket.id:
            log('Disconnected: ' + packet.reason);
            UIManager.set(new UILoad('Disconnected: ' + packet.reason, '#ffffff'));

            break;
    }
}

PacketHandlerClient.prototype.onError = function() {
    UIManager.set(new UILoad('Connection error', '#ffffff'));
}

PacketHandlerClient.prototype.onConnect = function() {
    log('Connected');

    UIManager.set(null);

    var handshake = new HandshakePacket('Version-1');

    this.sendPacket(handshake);
}

PacketHandlerClient.prototype.onDisconnect = function() {
    UIManager.set(new UILoad('Disconnected', '#ffffff'));
}

PacketHandlerClient.prototype.setWorld = function(world) {
    this.world = world;
}

})(global);
