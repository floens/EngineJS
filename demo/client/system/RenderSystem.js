(function(global, undefined) {
'use strict';

global.RenderSystem = function() {
    System.call(this);

    this.setLoopType(System.RENDER_LOOP);

    this.addAspect(RemotePositionComponent);

    this.canvas = new Canvas(Screen.width, Screen.height, 50);

    this.lw = Screen.width;
    this.lh = Screen.height;
}
RenderSystem.extend(System);
System.registerSystem(RenderSystem, 100);

RenderSystem.prototype.tick = function() {
    this.parent.tick.call(this);

    if (this.lw != Screen.width || this.lh != Screen.height) {
        this.lw = Screen.width;
        this.lh = Screen.height;

        this.canvas.setDimensions(Screen.width, Screen.height);
    }

    this.canvas.clear();

    for (var i = 0; i < this.entities.length; i++) {
        this.processEntity(this.entities[i]);
    }
}

RenderSystem.prototype.processEntity = function(entity) {
    var position = entity.getComponent(RemotePositionComponent).getPosition();

    this.canvas.fillCircle(position.x * Screen.width, position.y * Screen.height, 15, '#FC8365');
}

})(global);
