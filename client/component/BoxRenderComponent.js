(function(global, undefined) {
'use strict';

global.BoxRenderComponent = function(color) {
    RenderComponent.call(this);

    this.color = color;
}
BoxRenderComponent.extend(RenderComponent);

BoxRenderComponent.prototype.render = function(system, entity) {
    var position = entity.getComponent(PositionComponent),
        coll = entity.getComponent(CollidableComponent);

    system.canvas.fillRect(position.x, position.y, coll.bb.getWidth(), coll.bb.getHeight(), this.color);
}


})(global);
