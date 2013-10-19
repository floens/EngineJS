(function(global) {
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
            case ClientPositionPacket.id:
                var position = this.entity.getComponent(PlayerPositionComponent);

                /*var dx = position.x - packet.x;
                var dy = position.y - packet.y;
                var dz = position.z - packet.z;
                var d = Math.sqrt(dx * dx + dy * dy + dz * dz);

                if (d > 1) {
                    return;
                }*/

                var w = this.world.getSystem(VoxelWorld);
                packet.x = Math.max(0, Math.min(w.width, packet.x));
                packet.y = Math.max(0, Math.min(w.height, packet.y));
                packet.z = Math.max(0, Math.min(w.depth, packet.z));

                position.x = packet.x;
                position.y = packet.y;
                position.z = packet.z;
                position.yaw = packet.yaw;
                position.pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, packet.pitch));

                break;
            case BlockChangePacket.id:
                var change = this.entity.getComponent(BlockChangeComponent);

                var id = Math.max(0, Math.min(100, packet.a));
                if (Block[id] == null) return;

                change.addChange(packet.x, packet.y, packet.z, id);

                this.entity.getComponent(PacketHandlerComponent).addBroadcast(new BlockChangePacket(packet.x, packet.y, packet.z, id));

                break;
        }
    }
}

PacketHandlerServer.prototype.login = function() {
    this.entity = new EntityPlayer(this.world);
    this.entity.addComponent(new PacketHandlerComponent(this));
    this.entity.add();

    this.sendPacket(new HandshakePacket('Ok'));
    this.sendPacket(new BlockDataPacket(this.world.getSystem(VoxelWorld)));
}

PacketHandlerServer.prototype.onConnect = function() {
}

PacketHandlerServer.prototype.onDisconnect = function() {
    if (this.entity != null) {
        this.entity.remove();
    }
}

})(global);
