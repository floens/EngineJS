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


})(global);
