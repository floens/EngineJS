(function(global, undefined) {
'use strict';

global.RemotePositionComponent = function() {
    RemoteComponent.call(this);

    this.setUpdateInterval(15);

    this.x = 0;
    this.y = 0;
    this.xa = 0;
    this.ya = 0;

    this.lastX = null;
    this.lastY = null;

    this.interpCounter = 0;
}
RemotePositionComponent.extend(RemoteComponent);
Component.registerComponent(RemotePositionComponent, 3);

RemotePositionComponent.prototype.getPosition = function() {
    if (this.interpCounter > 0) {
        this.interpCounter--;

        return new Vec2(
            Utils.interpolateLinear(this.lastX, this.x, ((this.updateInterval - this.interpCounter) / this.updateInterval)),
            Utils.interpolateLinear(this.lastY, this.y, ((this.updateInterval - this.interpCounter) / this.updateInterval))
        );
    } else {
        return new Vec2(this.x, this.y);
    }
}

RemotePositionComponent.prototype.set = function(o) {
    var dontInterp = this.lastX == null;

    this.lastX = this.x;
    this.lastY = this.y;

    this.x = o.x;
    this.y = o.y;
    this.xa = o.xa;
    this.ya = o.ya;

    if (!dontInterp) this.interpCounter = this.updateInterval;
}

RemotePositionComponent.prototype.copy = function() {
    var n = new RemotePositionComponent();
    n.x = this.x;
    n.y = this.y;
    n.xa = this.xa;
    n.ya = this.ya;

    return n;
}

RemotePositionComponent.prototype.compare = function(o) {
    if (o.x == this.x && o.y == this.y && o.xa == this.xa && o.ya == this.ya) return true;

    return false;
}

RemotePositionComponent.prototype.readStream = function(dataStream) {
    this.x = dataStream.readNumber();
    this.y = dataStream.readNumber();
    this.xa = dataStream.readNumber();
    this.ya = dataStream.readNumber();
}

RemotePositionComponent.prototype.writeStream = function(dataStream) {
    dataStream.writeNumber(this.x);
    dataStream.writeNumber(this.y);
    dataStream.writeNumber(this.xa);
    dataStream.writeNumber(this.ya);
}


})(global);
