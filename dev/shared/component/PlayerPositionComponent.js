(function(global) {
'use strict';

global.PlayerPositionComponent = function() {
    RemoteComponent.call(this);

    this.setUpdateInterval(5);

    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.xa = 0;
    this.ya = 0;
    this.za = 0;

    this.width = 0.8;
    this.height = 1.8;
    this.depth = 0.8;
    this.speed = 0;
    this.rotation = 0;
    this.jump = 0.124;
    this.maxSpeed = 0.3;
    this.acceleration = 0.01;
    this.deceleration = 0.85;

    this.yaw = 0;
    this.pitch = 0;
    this.collidedX = false;
    this.collidedY = false;
    this.collidedZ = false;
    this.onGround = false;

    this.interpolationCounter = 0;
    this.interpolationQueue = [];
}
PlayerPositionComponent.extend(RemoteComponent);
Component.registerComponent(PlayerPositionComponent, 102);

PlayerPositionComponent.prototype.getInterpolated = function() {
    this.interpolationCounter--;

    if (this.interpolationQueue.length < 2) {
        return new InterpPair(this.x, this.y, this.z, this.yaw, this.pitch);
    } else {
        var now = this.interpolationQueue[0];
        var next = this.interpolationQueue[1];
        var interval = this.updateInterval;

        if (this.interpolationQueue.length > 4) {
            interval -= this.interpolationQueue.length - 4;
        }

        if (this.interpolationCounter > interval) this.interpolationCounter = interval;

        var interpolated = new InterpPair(Utils.interpolateLinear(now.x, next.x, ((interval - this.interpolationCounter) / interval)),
            Utils.interpolateLinear(now.y, next.y, ((interval - this.interpolationCounter) / interval)),
            Utils.interpolateLinear(now.z, next.z, ((interval - this.interpolationCounter) / interval)),
            Utils.interpolateLinear(now.yaw, next.yaw, ((interval - this.interpolationCounter) / interval)),
            Utils.interpolateLinear(now.pitch, next.pitch, ((interval - this.interpolationCounter) / interval)));

        if (this.interpolationCounter == 0) {
            this.interpolationQueue.shift();
            if (this.interpolationQueue.length == 1) {
                this.interpolationQueue = [];
            } else {
                this.interpolationCounter = interval;
            }
        }

        return interpolated;
    }
}

PlayerPositionComponent.prototype.handleNewPosition = function(x, y, z, yaw, pitch) {
    if (this.interpolationQueue.length == 0) {
        this.interpolationQueue.push(new InterpPair(this.x, this.y, this.z, this.yaw, this.pitch));
        this.interpolationCounter = this.updateInterval;
    }

    this.interpolationQueue.push(new InterpPair(x, y, z, yaw, pitch));
}

PlayerPositionComponent.prototype.set = function(o) {
    this.handleNewPosition(o.x, o.y, o.z, o.yaw, o.pitch);
    
    this.x = o.x;
    this.y = o.y;
    this.z = o.z;
    this.yaw = o.yaw;
    this.pitch = o.pitch;
}

PlayerPositionComponent.prototype.copy = function() {
    var n = new PlayerPositionComponent();
    n.x = this.x;
    n.y = this.y;
    n.z = this.z;
    n.yaw = this.yaw;
    n.pitch = this.pitch;

    return n;
}

PlayerPositionComponent.prototype.compare = function(o) {
    if (o.x == this.x && o.y == this.y && o.z == this.z && o.yaw == this.yaw && o.pitch == this.pitch) return true;

    return false;
}

PlayerPositionComponent.prototype.readStream = function(dataStream) {
    this.x = dataStream.readNumber();
    this.y = dataStream.readNumber();
    this.z = dataStream.readNumber();
    this.yaw = dataStream.readNumber();
    this.pitch = dataStream.readNumber();
}

PlayerPositionComponent.prototype.writeStream = function(dataStream) {
    dataStream.writeNumber(this.x);
    dataStream.writeNumber(this.y);
    dataStream.writeNumber(this.z);
    dataStream.writeNumber(this.yaw);
    dataStream.writeNumber(this.pitch);
}


var InterpPair = function(x, y, z, yaw, pitch) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.yaw = yaw;
    this.pitch = pitch;
}


})(global);
