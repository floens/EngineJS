(function(global, undefined) {
'use strict';

global.CircleCollidableComponent = function(radius) {
    CollidableComponent.call(this);

    this.bb = new Circle(radius);
}
CircleCollidableComponent.extend(CollidableComponent);


})(global);
