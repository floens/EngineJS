(function(global) {
'use strict';

global.ParticleComponent = function() {
    Component.call(this);

    this.lifeTime = 0;
}
ParticleComponent.extend(Component);
Component.registerComponent(ParticleComponent, 109);


})(global);
