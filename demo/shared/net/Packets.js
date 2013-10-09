(function(global, undefined) {
'use strict';

global.CreatePointerPacket = function(sessionId) {
    Packet.call(this);

    this.sessionId = sessionId;
}
CreatePointerPacket.extend(Packet);
Packet.registerPacket(CreatePointerPacket, 100, false, true);

CreatePointerPacket.prototype.read = function(dataStream) {
    this.sessionId = dataStream.readNumber();
}

CreatePointerPacket.prototype.write = function(dataStream) {
    dataStream.writeNumber(this.sessionId);
}




global.PointerPositionPacket = function() {
    Packet.call(this);

    this.sessionId = 0;
    this.x = 0;
    this.y = 0;
}
PointerPositionPacket.extend(Packet);
Packet.registerPacket(PointerPositionPacket, 101, true, true);

PointerPositionPacket.prototype.read = function(dataStream) {
    this.sessionId = dataStream.readNumber();
    this.x = dataStream.readNumber();
    this.y = dataStream.readNumber();
}

PointerPositionPacket.prototype.write = function(dataStream) {
    dataStream.writeNumber(this.sessionId);
    dataStream.writeNumber(this.x);
    dataStream.writeNumber(this.y);
}

PointerPositionPacket.prototype.setInfo = function(sessionId, x, y) {
    this.sessionId = sessionId;
    this.x = x;
    this.y = y;
}



global.DestroyPointerPacket = function(sessionId) {
    Packet.call(this);

    this.sessionId = sessionId;
}
DestroyPointerPacket.extend(Packet);
Packet.registerPacket(DestroyPointerPacket, 102, false, true);

DestroyPointerPacket.prototype.read = function(dataStream) {
    this.sessionId = dataStream.readNumber();
}

DestroyPointerPacket.prototype.write = function(dataStream) {
    dataStream.writeNumber(this.sessionId);
}


})(global);
