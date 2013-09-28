(function(global, undefined) {
'use strict';

global.NetHandler = function(connection, system) {
    this.connection = connection;
    this.system = system;

    this.maxOutboundBytesPerTick = 500;
    this.maxInboundBytesPerTick = 250;

    this.tickCount = 0;
    this.bytesIn = 0;
    this.bytesOut = 0;
    this.connected = true;
}

NetHandler.prototype.tick = function() {
    if (!this.connected) return;

    this.bytesIn -= this.maxInboundBytesPerTick;
    this.bytesIn = Math.max(0, this.bytesIn);
    if (this.bytesIn > this.maxInboundBytesPerTick * 60) {
        this.disconnect('Network inbound overflow error.');
        return;
    }

    this.bytesOut -= this.maxOutboundBytesPerTick;
    this.bytesOut = Math.max(0, this.bytesOut);
    if (this.bytesOut > this.maxOutboundBytesPerTick * 60) {
        this.disconnect('Network outbound overflow error.');
        return;
    }

    this.tickCount++;
}

NetHandler.prototype.disconnect = function(reason) {
    this.connected = false;

    try {
        this.writeConnection(new DisconnectPacket(reason == undefined ? '' : reason))
        this.connection.close();
    } catch(err) {
        log('Error closing connection.');
    }
}

NetHandler.prototype.getConnected = function() {
    return this.connected;
}

/**
 * Read from the network
 * Catches errors
 * @param  {string} data raw data
 * @return {Packet OR null} Parsed packet
 */
NetHandler.prototype.readConnection = function(data) {
    this.bytesIn += data.length;

    var dataStream = new DataStream();

    var packet = null;
    try {
        dataStream.setData(data);
        packet = Packet.readStream(dataStream, true);
    } catch(err) {
        log(err, true);
        return null;
    }

    return packet;
}

/**
 * Write to the network
 * Catches errors
 * @param  {Packet} packet the packet to write
 */
NetHandler.prototype.writeConnection = function(packet) {
    var stream = null;
    try {
        stream = Packet.writeStream(packet);
    } catch(err) {
        log(err, true);
        return;
    }

    var data = null;
    try {
        data = stream.getData();
    } catch(err) {
        log(err, true);
        return;
    }

    try {
        this.connection.send(data);
    } catch(err) {
        log(err, true);
        return;
    }

    this.bytesOut += data.length;
}

})(global);
