(function(global) {
'use strict';

global.TrackerSystem = function() {
    System.call(this);

    this.addAspect(PacketHandlerComponent);

    this.trackedComponents = new Map();
}
TrackerSystem.extend(System);
System.registerSystem(TrackerSystem, 3);

TrackerSystem.prototype.tick = function() {
    this.parent.tick.call(this);

    for (var i = 0; i < this.entities.length; i++) {
        this.processEntity(this.entities[i]);
    }
}

TrackerSystem.prototype.processEntity = function(entity) {
    var sessionId = entity.sessionId;

    var list = this.trackedComponents.get(sessionId);
    if (list != null) {
        for (var i = 0; i < list.length; i++) {
            var component = entity.getComponent(list[i]); // Same id

            if (!component.compare(list[i])) {
                // Component changed

                if (component.updateIntervalCounter > 0) {
                    component.updateIntervalCounter--;
                } else {
                    component.updateIntervalCounter = component.updateInterval;

                    // Reset ours
                    this.trackedComponents.get(sessionId)[i] = component.copy();

                    // Resync
                    var packet = new UpdateComponentPacket();
                    packet.setInfo(entity, component);
                    this.broadcast(packet, sessionId);
                    component.onBroadcast();
                }
            }
        }
    }

    var handler = entity.getComponent(PacketHandlerComponent)
    var pendingBroadcasts = handler.pendingBroadcasts;
    for (var i = 0; i < pendingBroadcasts.length; i++) {
        this.broadcast(pendingBroadcasts[i], -1);
    }
    handler.pendingBroadcasts = [];

    var pendingPackets = handler.pendingPackets;
    for (var i = 0; i < pendingPackets.length; i++) {
        handler.packetHandler.sendPacket(pendingPackets[i]);
    }
    handler.pendingPackets = [];

    var pendingExceptBroadcasts = handler.pendingExceptBroadcasts;
    for (var i = 0; i < pendingExceptBroadcasts.length; i++) {
        handler.packetHandler.sendBroadcast(pendingExceptBroadcasts[i], entity.sessionId);
    }
    handler.pendingExceptBroadcasts = [];
}

TrackerSystem.prototype.sendPacket = function(entity, packet) {
    entity.getComponent(PacketHandlerComponent).packetHandler.sendPacket(packet);
}

TrackerSystem.prototype.broadcast = function(packet, exceptSessionId) {
    for (var i = 0; i < this.entities.length; i++) {
        var other = this.entities[i];
        if (other.sessionId != exceptSessionId) {
            this.sendPacket(other, packet);
        }
    }
}

TrackerSystem.prototype.addEntity = function(entity) {
    var sessionId = entity.sessionId;

    // Add remote components to track
    var remoteComponents = [];
    var list = entity.components.keys();
    for (var i = 0; i < list.length; i++) {
        var component = entity.components.get(list[i]);

        if (component.isRemoteComponent) {
            if (this.trackedComponents.get(sessionId) == null) this.trackedComponents.set(sessionId, []);
            var trackedList = this.trackedComponents.get(sessionId);

            trackedList.push(component.copy());
        }
    }

    // Send others to newly joined
    for (var i = 0; i < this.entities.length; i++) {
        var otherEntity = this.entities[i];

        if (otherEntity.sessionId != entity.sessionId) {
            // Create entity on newly joined
            this.sendPacket(entity, new CreateEntityPacket(otherEntity));

            // Sync components on newly joined
            var list = this.trackedComponents.get(otherEntity.sessionId);
            if (list != null) {
                for (var j = 0; j < list.length; j++) {
                    var packet = new UpdateComponentPacket();
                    packet.setInfo(otherEntity, list[j]);
                    this.sendPacket(entity, packet);
                }
            }
        }
    }

    // Notify others of newly joined
    for (var i = 0; i < this.entities.length; i++) {
        var otherEntity = this.entities[i];

        if (otherEntity.sessionId != entity.sessionId) {
            this.sendPacket(otherEntity, new CreateEntityPacket(entity));
        }
    }
}

TrackerSystem.prototype.removeEntity = function(entity) {
    // Notify others of removed entity
    for (var i = 0; i < this.entities.length; i++) {
        var otherEntity = this.entities[i];

        if (otherEntity.sessionId != entity.sessionId) {
            this.sendPacket(otherEntity, new DestroyEntityPacket(entity));
        }
    }
}

})(global);
