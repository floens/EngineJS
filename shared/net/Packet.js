(function(global, undefined) {
'use strict';

global.Packet = function() {
}

Packet.prototype.read = function(dataStream) {
    throw new Error('Packet::read(dataStream) should be implemented.');
}

Packet.prototype.write = function(dataStream) {
    throw new Error('Packet::write(dataStream) should be implemented');
}





// Static functions
var _registeredPackets = new Map();
/**
 * Register the packet class, so that it can be used. 
 * @param  {Packet}  packet         The class which extended Packet
 * @param  {number}  id             Unique identifier to differentiate between packets
 * @param  {boolean} clientToServer True if the server can accept this packet
 * @param  {boolean} serverToClient True if the client can accept this packet
 */
Packet.registerPacket = function(packet, id, clientToServer, serverToClient) {
    if (!Number.isFinite(id)) throw new Error('Id not a number.');
    if (id <= 0) throw new Error('Invalid argument: Id below 1 reserved.');
    if (_registeredPackets.has(id)) {
        throw new Error('Packet with id already registered (' + id + ')');
    }

    _registeredPackets.set(id, new RegisteredPacket(id, packet, clientToServer, serverToClient));

    packet.prototype.id = id;
    packet.id = id;
}

/**
 * Process this dataStream, pass it to the registered packet classes, and return the fully read packet
 * @param  {DataStream} dataStream
 * @param  {boolean}    isClient Is this game a client or server instance, set this accordingly
 * @return {Packet}     The read packet
 * @throws {Error}      Throws error if packet is malformed
 */
Packet.readStream = function(dataStream, isClient) {
    if (!dataStream.hasNext()) throw new Error('Malformed packet.');

    var id = dataStream.readNumber();
    if (id <= 0) throw new Error('Malformed packet.');

    if (_registeredPackets.has(id)) {
        var registered = _registeredPackets.get(id);
        
        if ((isClient && !registered.serverToClient) || (!isClient && !registered.clientToServer)) {
            throw new Error('Invalid packet.');
        }

        var clazz = registered.clazz;
        var packet = new clazz();

        packet.read(dataStream);

        return packet;
    } else {
        throw new Error('Unknown packet (' + id + ')');
    } 
}

/**
 * Writes packet to a DataStream
 * @param  {Packet}     packet   The packet to write
 * @param  {Boolean}    isClient Is this a server or client
 * @return {DataStream}          Written DataStream
 * @throws {Error}               If packet is invalid
 */
Packet.writeStream = function(packet, isClient) {
    var id = packet.id;
    var registered = _registeredPackets.get(id);

    if ((isClient && !registered.clientToServer) || (!isClient && !registered.serverToClient)) {
        throw new Error('Invalid packet.');
    }

    var stream = new DataStream();
    stream.writeNumber(id);

    packet.write(stream);

    return stream;
}

// Private classes
var RegisteredPacket = function(id, clazz, clientToServer, serverToClient) {
    this.id = id;
    this.clazz = clazz;
    this.clientToServer = clientToServer;
    this.serverToClient = serverToClient;
}


})(global);
