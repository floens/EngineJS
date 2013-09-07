(function(global, undefined) {
'use strict';

global.RenderSystem = function() {
    System.call(this);

    // Not on tick, but on render
    this.setLoopType(System.RENDER_LOOP);
    this.addAspect(PositionComponent);
    this.addAspect(RenderComponent);

    this.canvas = new Canvas(Screen.width, Screen.height, 100);

    this.lastScreenWidth = Screen.width;
    this.lastScreenHeight = Screen.height;
}
RenderSystem.extend(System);
System.registerSystem(RenderSystem, 2);

RenderSystem.prototype.tick = function() {
    this.parent.tick.call(this);

    if (this.lastScreenWidth != Screen.width || this.lastScreenHeight != Screen.height) {
        this.lastScreenWidth = Screen.width;
        this.lastScreenHeight = Screen.height;
        this.canvas.setDimensions(Screen.width, Screen.height);
    }

    this.canvas.clear();

    for (var i = 0; i < this.entities.length; i++) {
        this.processEntity(this.entities[i]);
    }
}

RenderSystem.prototype.processEntity = function(entity) {
    var render = entity.getComponent(RenderComponent);

    render.render(this, entity);
}

})(global);
