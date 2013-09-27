(function(global, undefined) {
'use strict';

global.HandshakePacket = function(message) {
    Packet.call(this);

    this.message = message;
}
HandshakePacket.extend(Packet);
Packet.registerPacket(HandshakePacket, 1, true, true);

HandshakePacket.prototype.read = function(dataStream) {
    this.message = dataStream.readString();
}

HandshakePacket.prototype.write = function(dataStream) {
    dataStream.writeString(this.message);
}


global.CreateEntityPacket = function() {
    this.entity = null;
}
CreateEntityPacket.extend(Packet);
Packet.registerPacket(CreateEntityPacket, 2, false, true);

CreateEntityPacket.prototype.read = function(dataStream) {
    var entityId = dataStream.readNumber();

    this.entity = Entity.getEntityClass(entityId);
}

CreateEntityPacket.prototype.write = function(dataStream) {
    if (this.entity == null) throw new Error('Entity null.');

    dataStream.writeNumber(this.entity.id);
}

CreateEntityPacket.prototype.setEntity = function(e) {
    this.entity = e;
}

})(global);
