(function(global, undefined) {
'use strict';

global.HandshakePacket = function(message) {
    Packet.call(this);

    this.message = message == undefined ? '' : message;
}
HandshakePacket.extend(Packet);
Packet.registerPacket(HandshakePacket, 1, true, true);

HandshakePacket.prototype.read = function(dataStream) {
    this.message = dataStream.readString();
}

HandshakePacket.prototype.write = function(dataStream) {
    dataStream.writeString(this.message);
}


global.DisconnectPacket = function(reason) {
    this.reason = reason == undefined ? '' : reason;
}
DisconnectPacket.extend(Packet);
Packet.registerPacket(DisconnectPacket, 2, true, true);

DisconnectPacket.prototype.read = function(dataStream) {
    this.reason = dataStream.readString();
}

DisconnectPacket.prototype.write = function(dataStream) {
    dataStream.writeString(this.reason);
}


global.CreateEntityPacket = function(entity) {
    this.entity = entity == undefined ? null : entity;
    this.entityClass = null;
    this.sessionId = -1;
}
CreateEntityPacket.extend(Packet);
Packet.registerPacket(CreateEntityPacket, 3, false, true);

CreateEntityPacket.prototype.read = function(dataStream) {
    var entityId = dataStream.readNumber();

    this.entityClass = Entity.getEntityClass(entityId);

    this.sessionId = dataStream.readNumber();
}

CreateEntityPacket.prototype.process = function(world) {
    var e = new this.entityClass(world);
    e.setSessionId(this.sessionId);
    return e;
}

CreateEntityPacket.prototype.write = function(dataStream) {
    if (this.entity == null) throw new Error('Entity null.');

    dataStream.writeNumber(this.entity.id);
    dataStream.writeNumber(this.entity.sessionId);
}



global.UpdateComponentPacket = function() {
    this.sessionId = -1;
    this.componentId = -1;
    this.entity = null;
    this.component = null;
}
UpdateComponentPacket.extend(Packet);
Packet.registerPacket(UpdateComponentPacket, 5, false, true);

UpdateComponentPacket.prototype.setInfo = function(entity, component) {
    this.entity = entity;
    this.component = component;
    this.sessionId = entity.sessionId;
    this.componentId = component.id;
}

UpdateComponentPacket.prototype.read = function(dataStream) {
    this.sessionId = dataStream.readNumber();
    var componentId = dataStream.readNumber();
    var componentClass = Component.getComponentClass(componentId);
    var component = new componentClass();

    component.readStream(dataStream);

    this.componentId = componentId;
    this.component = component;
}

UpdateComponentPacket.prototype.write = function(dataStream) {
    dataStream.writeNumber(this.sessionId);
    dataStream.writeNumber(this.componentId);

    this.component.writeStream(dataStream);
}



global.DestroyEntityPacket = function(entity) {
    this.sessionId = entity == undefined ? -1 : entity.sessionId;
}
DestroyEntityPacket.extend(Packet);
Packet.registerPacket(DestroyEntityPacket, 6, false, true);

DestroyEntityPacket.prototype.read = function(dataStream) {
    this.sessionId = dataStream.readNumber();
}

DestroyEntityPacket.prototype.write = function(dataStream) {
    dataStream.writeNumber(this.sessionId);
}



})(global);
