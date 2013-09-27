(function(global, undefined) {
'use strict';

global.PacketHandlerClient = function(world) {
    this.world = world;
}
PacketHandlerClient.extend(PacketHandler);

PacketHandlerClient.prototype.handlePacket = function(packet) {
    switch(packet.id) {
        case CreateEntityPacket.id:
            var entity = new packet.entity(this.world);

            entity.add();
            log(entity, true);

            break;
    }
}

})(global);
