(function(global, undefined) {
'use strict';

global.ImageRenderComponent = function(asset, sx, sy, w, h) {
    RenderComponent.call(this);

    this.asset = asset;

    this.sourceX = sx;
    this.sourceY = sy;
    this.width = w;
    this.height = h;
}
ImageRenderComponent.extend(RenderComponent);

ImageRenderComponent.prototype.render = function(system, entity) {
    var pos = entity.getComponent(PositionComponent);

    system.canvas.fillImage(this.asset.getImage(), pos.x, pos.y, this.sourceX, this.sourceY, this.width, this.height);
}


})(global);
