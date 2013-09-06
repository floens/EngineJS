(function(global, undefined) {
'use strict';

global.InputSystem = function() {
    System.call(this);

    this.tickSystem = true;
    this.addAspect(PositionComponent);
    this.addAspect(ControllableComponent);
}
InputSystem.extend(System);
System.registerSystem(InputSystem, 3);

InputSystem.prototype.tick = function() {
    this.parent.tick.call(this);

    for (var i = 0; i < this.entities.length; i++) {
        this.processEntity(this.entities[i]);
    }
}

InputSystem.prototype.processEntity = function(entity) {
    var pos = entity.getComponent(PositionComponent),
        control = entity.getComponent(ControllableComponent);

    if (Input.getMousePressed(Input.BUTTON_LEFT)) {
        var mousePos = Input.getMousePosition();

        var x = mousePos[0];
        var y = mousePos[1];

        pos.xa = (x - pos.x);
        pos.ya = (y - pos.y);
    }

    pos.xa *= control.deceleration;
    pos.ya *= control.deceleration;

    /*var up = Input.isKeyPressed('w'),
        down = Input.isKeyPressed('s'),
        left = Input.isKeyPressed('a'),
        right = Input.isKeyPressed('d');

    if (left && !right) {
        pos.xa -= control.acceleration;
        if (pos.xa < -control.maxSpeed) {
            pos.xa = -control.maxSpeed;
        }
    }

    if (right && !left) {
        pos.xa += control.acceleration;
        if (pos.xa > control.maxSpeed) {
            pos.xa = control.maxSpeed;
        }
    }

    if ((left && right) || (!left && !right)) {
        pos.xa *= control.deceleration;
    }


    if (up && !down) {
        pos.ya -= control.acceleration;
        if (pos.ya < -control.maxSpeed) {
            pos.ya = -control.maxSpeed;
        }
    }

    if (down && !up) {
        pos.ya += control.acceleration;
        if (pos.ya > control.maxSpeed) {
            pos.ya = control.maxSpeed;
        }
    }

    if ((up && down) || (!up && !down)) {
        pos.ya *= control.deceleration;
    }*/

    if (Math.abs(pos.xa) < 1e-5) pos.xa = 0;
    if (Math.abs(pos.ya) < 1e-5) pos.ya = 0;
}

})(global);
