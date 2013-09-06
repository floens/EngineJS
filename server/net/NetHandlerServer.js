(function(global, undefined) {
'use strict';

// var BISON = require('bison.js');

global.NetHandler = function(connection) {
    this.connection = connection;
    this.messageQueue = [];
    this.maxBytesSendPerTick = 10000;
    this.bytesIn = 0;
    this.bytesOut = 0;

    this.tickCount = 0;
    this.disconnected = false;

    // If handshake has been done
    // this.didHandshake = false;
}

NetHandler.prototype.tick = function() {
    // Make sure this loop doesn't run when disconnected, if the event hasn't fired in NetManager yet
    if (this.disconnected) return;

    // Cut off connection for inbound data. Currently max 500 bytes/tick.
    this.bytesIn -= 500;
    this.bytesIn = Math.max(0, this.bytesIn);
    if (this.bytesIn > 10000) {
        this.disconnect('Network overflow error.');
        return;
    }
    this.bytesOut = 0;

    this.tickCount++;
}

NetHandler.prototype.onMessage = function(data) {
    this.bytesIn += data.length;

    var dataStream = new DataStream();

    var packet = null;
    try {
        dataStream.setData(data);
        packet = Packet.readStream(dataStream, true);
    } catch(err) {
        log(err, true);
    }

    return packet;
}


NetHandler.prototype.disconnect = function(reason) {
    // TODO reason

    this.disconnected = true;

    this.connection.close();
}

NetHandler.prototype.writeConnection = function(data) {
    this.bytesOut += data.length;

    this.connection.send(data);
}

})(global);
