(function(global, undefined) {
'use strict';

global.RenderComponent = function() {
    Component.call(this);
}
RenderComponent.extend(Component);
Component.registerComponent(RenderComponent, 2);

RenderComponent.prototype.render = function(system, entity) {
    throw new Error('RenderComponent::render(system, entity) should be implemented.');
}


})(global);
