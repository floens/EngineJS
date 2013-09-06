(function(global, undefined) {
'use strict';

global.NetHandler = function(connection, system) {
    this.connection = connection;
    this.system = system;
    this.messageQueue = [];
    this.maxBytesSendPerTick = 1000;

    this.bytesIn = 0;
    this.bytesOut = 0;

    this.tickCount = 0;
}

NetHandler.prototype.tick = function() {
    if (this.messageQueue.length > 0) {
        var newList = [],
            charactersSend = 0;

        while (this.messageQueue.length > 0) {
            var i = this.messageQueue.shift();
            newList.push(i);

            charactersSend += i.length;
            if (charactersSend > this.maxBytesSendPerTick) {
                log('NetHandler: High network out load.', log.WARN);
                break;
            }
        }

        this.writeConnection(newList);
    }

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

NetHandler.prototype.writeConnection = function(data) {
    this.connection.send(data);
    this.bytesOut += data.length;
}

})(global);
