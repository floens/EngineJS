(function(global) {
'use strict';

global.ClientPositionPacket = function(x, y, z, yaw, pitch) {
    Packet.call(this);

    this.x = x == undefined ? 0 : x;
    this.y = y == undefined ? 0 : y;
    this.z = z == undefined ? 0 : z;
    this.yaw = yaw == undefined ? 0 : yaw;
    this.pitch = pitch == undefined ? 0 : pitch;
}
ClientPositionPacket.extend(Packet);
Packet.registerPacket(ClientPositionPacket, 100, true, false);

ClientPositionPacket.prototype.read = function(dataStream) {
    this.x = dataStream.readNumber();
    this.y = dataStream.readNumber();
    this.z = dataStream.readNumber();
    this.yaw = dataStream.readNumber();
    this.pitch = dataStream.readNumber();
}

ClientPositionPacket.prototype.write = function(dataStream) {
    dataStream.writeNumber(this.x);
    dataStream.writeNumber(this.y);
    dataStream.writeNumber(this.z);
    dataStream.writeNumber(this.yaw);
    dataStream.writeNumber(this.pitch);
}


global.BlockChangePacket = function(x, y, z, a) {
    Packet.call(this);

    this.x = x == undefined ? 0 : x;
    this.y = y == undefined ? 0 : y;
    this.z = z == undefined ? 0 : z;
    this.a = a == undefined ? 0 : a;
}
BlockChangePacket.extend(Packet);
Packet.registerPacket(BlockChangePacket, 101, true, true);

BlockChangePacket.prototype.read = function(dataStream) {
    this.x = dataStream.readNumber();
    this.y = dataStream.readNumber();
    this.z = dataStream.readNumber();
    this.a = dataStream.readNumber();
}

BlockChangePacket.prototype.write = function(dataStream) {
    dataStream.writeNumber(this.x);
    dataStream.writeNumber(this.y);
    dataStream.writeNumber(this.z);
    dataStream.writeNumber(this.a);
}


global.BlockDataPacket = function(voxelWorld) {
    Packet.call(this);

    this.voxelWorld = voxelWorld == undefined ? null : voxelWorld;

    this.width = -1;
    this.height = -1;
    this.depth = -1;
    this.voxelData = null;
}
BlockDataPacket.extend(Packet);
Packet.registerPacket(BlockDataPacket, 102, false, true);

BlockDataPacket.prototype.read = function(dataStream) {
    this.width = dataStream.readNumber();
    this.height = dataStream.readNumber();
    this.depth = dataStream.readNumber();

    var length = this.width * this.height * this.depth;

    this.voxelData = new Int8Array(length);

    for (var i = 0; i < length; i++) {
        this.voxelData[i] = dataStream.readNumber();
    }
}

BlockDataPacket.prototype.write = function(dataStream) {
    var w = this.voxelWorld;

    dataStream.writeNumber(w.width);
    dataStream.writeNumber(w.height);
    dataStream.writeNumber(w.depth);

    var tileArray = w.tileArray;
    for (var i = 0; i < tileArray.length; i++) {
        dataStream.writeNumber(tileArray[i]);
    }
}




})(global);
