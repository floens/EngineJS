(function(global) {
'use strict';

global.PacketHandlerClient = function() {
    PacketHandler.call(this);

    this.world = null;

    this.entity = null;

    this.disconnectReason = '';
}
PacketHandlerClient.extend(PacketHandler);

PacketHandlerClient.prototype.handlePacket = function(packet) {
    switch(packet.id) {
        case HandshakePacket.id:
            break;
        case CreateEntityPacket.id:
            var entity = packet.process(this.world);

            if (entity instanceof EntityPlayer) {
                entity.addComponent(new PlayerModel());
            }

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
            this.disconnectReason = packet.reason;

            break;
        case BlockDataPacket.id:
            this.onLogin(packet.width, packet.height, packet.depth, packet.voxelData);

            break;
        case BlockChangePacket.id:
            var change = this.entity.getComponent(BlockChangeComponent);

            change.addChange(packet.x, packet.y, packet.z, packet.a);

            break;
    }
}

PacketHandlerClient.prototype.onLogin = function(width, height, depth, tileArray) {
    this.setEntity(WebCraft.startGame(width, height, depth, tileArray));

    this.entity.addComponent(new PacketHandlerComponent(this));
    this.entity.setSessionId(0);
    this.entity.add();
}

PacketHandlerClient.prototype.onConnect = function() {
    log('Connected');

    UIManager.set(null);

    this.sendPacket(new HandshakePacket('Version-1'));
}

PacketHandlerClient.prototype.onDisconnect = function() {
    log('Disconnected');

    WebCraft.stopGame();

    UIManager.set(new UIText('Disconnected' + 
        (this.disconnectReason.length > 0 ? ': ' + this.disconnectReason : ''), '#ffffff'));
}

PacketHandlerClient.prototype.onError = function() {
    // onDisconnect called after this
}

PacketHandlerClient.prototype.setWorld = function(world) {
    this.world = world;
}

PacketHandlerClient.prototype.setEntity = function(entity) {
    this.entity = entity;
}

})(global);
