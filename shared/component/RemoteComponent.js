(function(global, undefined) {
'use strict';

global.RemoteComponent = function() {
    Component.call(this);

    this.isRemoteComponent = true;

    this.updateInterval = 0;
    this.updateIntervalCounter = 0;
}
RemoteComponent.extend(Component);
Component.registerComponent(RemoteComponent, 2);

/**
 * Provide an copy of this component. Used to compare later with compare()
 * @return {RemoteComponent} new instance
 */
RemoteComponent.prototype.copy = function() {
    throw new Error('RemoteComponent::copy() is abstract.');
}

/**
 * Set this component to the data of the other one
 * @param {RemoteComponent} other
 */
RemoteComponent.prototype.set = function(other) {
    throw new Error('RemoteComponent::set(other) is abstract.');
}

/**
 * Compare the other component with this one. Used to resync to the client if changed.
 * @param  {RemoteComponent} other 
 * @return {boolean}         true if the same, false if not the same
 */
RemoteComponent.prototype.compare = function(other) {
    throw new Error('RemoteComponent::compare() is abstract.');
}

/**
 * Fill this component data from the dataStream
 * @param  {DataStream} dataStream 
 */
RemoteComponent.prototype.readStream = function(dataStream) {
    throw new Error('RemoteComponent::readStream(dataStream) is abstract.');
}

/**
 * Write this component data to the dataStream
 * @param  {DataStream} dataStream
 */
RemoteComponent.prototype.writeStream = function(dataStream) {
    throw new Error('RemoteComponent::writeStream(dataStream) is abstract.');
}

RemoteComponent.prototype.setUpdateInterval = function(e) {
    this.updateInterval = e;
}

})(global);
