(function(global) {
'use strict';

/**
 * Extend components from RemoteComponent if you want changed data to be 
 * automatically synced to all connected clients having your component.
 * Implement copy, set, compare, readStream and writeStream in your component.
 * It's server to client only for now.
 * @class RemoteComponent
 * @constructor
 */
global.RemoteComponent = function() {
    Component.call(this);

    this.isRemoteComponent = true;

    this.updateInterval = 0;
    this.updateIntervalCounter = 0;
}
RemoteComponent.extend(Component);
Component.registerComponent(RemoteComponent, 2);

/**
 * Provide an copy of this component. Used to compare later with compare().
 * @method copy
 * @abstract
 * @return {RemoteComponent} new instance
 */
RemoteComponent.prototype.copy = function() {
    throw new Error('RemoteComponent::copy() is abstract.');
}

/**
 * Set this component to the data of the other one
 * @method set
 * @abstract
 * @param {RemoteComponent} other
 */
RemoteComponent.prototype.set = function(other) {
    throw new Error('RemoteComponent::set(other) is abstract.');
}

/**
 * Compare the other component with this one. Used to resync to the client if changed.
 * @method compare
 * @abstract
 * @param  {RemoteComponent} other 
 * @return {boolean}         true if the same, false if not the same
 */
RemoteComponent.prototype.compare = function(other) {
    throw new Error('RemoteComponent::compare() is abstract.');
}

/**
 * Fill this component data from the dataStream
 * @method readStream
 * @abstract
 * @param  {DataStream} dataStream 
 */
RemoteComponent.prototype.readStream = function(dataStream) {
    throw new Error('RemoteComponent::readStream(dataStream) is abstract.');
}

/**
 * Write this component data to the dataStream
 * @method writeStream
 * @abstract
 * @param  {DataStream} dataStream
 */
RemoteComponent.prototype.writeStream = function(dataStream) {
    throw new Error('RemoteComponent::writeStream(dataStream) is abstract.');
}

/**
 * Set the amout of ticks to wait before sending another update.
 * This is useful if you have an component representing position data.
 * @param {Number} interval the interval in ticks
 */
RemoteComponent.prototype.setUpdateInterval = function(interval) {
    this.updateInterval = interval;
}

/**
 * Called when the TrackerSystem has send the updated data to all the clients.
 * Useful if you want to reset some variables.
 */
RemoteComponent.prototype.onBroadcast = function() {
}

})(global);
