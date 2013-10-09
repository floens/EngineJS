(function(global, undefined) {
'use strict';

global.PacketHandlerServer = function() {
    PacketHandler.call(this);

    this.world = null;

    this.handshakeTimeout = 60;
    this.handshaken = false;

    this.entity = null;
}
PacketHandlerServer.extend(PacketHandler);

PacketHandlerServer.prototype.tick = function() {
    this.handshakeTimeout--;
    if (!this.handshaken && this.handshakeTimeout < 0) {
        this.getNetHandler().disconnect('No handshake received.');
    }
}

PacketHandlerServer.prototype.setWorld = function(world) {
    this.world = world;
}

PacketHandlerServer.prototype.handlePacket = function(packet) {
    if (!this.handshaken && packet.id == HandshakePacket.id) {
        var message = packet.message;

        if (message != 'Version-1') {
            this.getNetHandler().disconnect('Outdated version');
        } else {
            this.handshaken = true;

            this.login();
        }
    } else if (!this.handshaken) {
        this.getNetHandler().disconnect();
    } else {
        switch(packet.id) {
            case PointerPositionPacket.id:
                var position = this.entity.getComponent(RemotePositionComponent);
                
                position.x = packet.x;
                position.y = packet.y;

                break;
        }
    }
}

PacketHandlerServer.prototype.login = function() {
    this.entity = new EntityPointer(this.world);
    this.entity.addComponent(new PacketHandlerComponent(this));
    this.entity.add();
}

PacketHandlerServer.prototype.onConnect = function() {
}

PacketHandlerServer.prototype.onDisconnect = function() {
    this.entity.remove();
}

})(global);
