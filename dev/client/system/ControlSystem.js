(function(global) {
'use strict';

global.ControlSystem = function(world) {
    System.call(this);

    this.addOrAspect(BlockChangeComponent);
    this.addOrAspect(PacketHandlerComponent);
    this.addAspect(ControlComponent);
    this.addAspect(PlayerPositionComponent);

    this.world = world;

    this.rotateSpeed = 0.005;

    this.lastMouseX = 0;
    this.lastMouseY = 0;

    this.jumpTimeLimit = 20; // If a touch was down less time than this, it is recognized as a jump

    this.controlTouchId = -1;
    this.controlDownTime = 0;
    this.moveTouchId = -1;

    this.tileChangeTimeout = 10;
    this.tileChangeCounter = 0;
}
ControlSystem.extend(System);
System.registerSystem(ControlSystem, 104);

ControlSystem.prototype.tick = function() {
    this.parent.tick.call(this);

    for (var i = 0; i < this.entities.length; i++) {
        this.processEntity(this.entities[i]);
    }
}

ControlSystem.prototype.processEntity = function(entity) {
    var pos = entity.getComponent(PlayerPositionComponent);
    var packetHandler = entity.hasComponent(PacketHandlerComponent) ? entity.getComponent(PacketHandlerComponent) : null;
    var control = entity.getComponent(ControlComponent);

    this.processLook(pos);
    this.processMove(pos);
    this.processSelector(control);

    if (entity.hasComponent(BlockChangeComponent)) {
        this.processDigging(pos, entity.getComponent(BlockChangeComponent), packetHandler, control);
    }
}

ControlSystem.prototype.processSelector = function(control) {
    var scroll = -Input.getMouseScroll();

    while (scroll < 0) scroll += control.barCount;

    control.barIndex = scroll % control.barCount;
}

ControlSystem.prototype.processDigging = function(pos, change, packetHandler, control) {
    var destroy = Input.getMousePressed(Input.BUTTON_LEFT);
    var place = Input.getMousePressed(Input.BUTTON_RIGHT);

    if ((destroy || place) && this.tileChangeCounter <= 0) {
        var reach = 4;

        var x = pos.x + 0.4;
        var y = pos.y + 1.7;
        var z = pos.z + 0.4;
        var y1 = -Math.cos(-pos.pitch);
        var xr = x + ((Math.sin(-pos.yaw) * reach) * y1);
        var yr = y + (Math.sin(-pos.pitch) * reach);
        var zr = z + ((Math.cos(-pos.yaw) * reach) * y1);

        var result = this.rayTrace(x, y, z, xr, yr, zr);
        if (result != null) {
            this.tileChangeCounter = this.tileChangeTimeout;

            if (destroy) {
                change.addChange(result.x, result.y, result.z, Block.AIR.id);

                if (packetHandler != null) {
                    packetHandler.packetHandler.sendPacket(new BlockChangePacket(result.x, result.y, result.z, Block.AIR.id));
                }
            } else if (place) {
                var tx = result.x;
                var ty = result.y;
                var tz = result.z;

                switch (result.a) {
                    case 0: tx--; break;
                    case 1: tx++; break;
                    case 2: ty--; break;
                    case 3: ty++; break;
                    case 4: tz--; break;
                    case 5: tz++; break;
                }

                if (this.world.getTile(tx, ty, tz) == Block.AIR.id) {
                    var blockId = control.barBlocks[control.barIndex];
                    change.addChange(tx, ty, tz, blockId);
                    change.addChange(x, y, z, -1);

                    if (packetHandler != null) {
                        packetHandler.packetHandler.sendPacket(new BlockChangePacket(tx, ty, tz, blockId));
                    }
                }
            }
        }
    }

    this.tileChangeCounter--;
}

ControlSystem.prototype.processMove = function(pos) {
    var jump = false;
    var moveX = 0;
    var moveZ = 0;
    if (Input.getHadTouchOnce()) {
        var touchList = Input.getTouches();

        if (this.controlTouchId == -1) {
            // Register a finger as control
            for (var i = 0; i < touchList.length; i++) {
                if (touchList[i].id != this.moveTouchId && this.touchInControls(touchList[i])) {
                    // Found unused finger, register it
                    this.controlTouchId = touchList[i].id;
                    break;
                }
            }
        } else {
            var touch = null;
            for (var i = 0; i < touchList.length; i++) {
                if (touchList[i].id == this.controlTouchId) {
                    touch = touchList[i];
                }
            }

            if (touch == null) {
                this.controlTouchId = -1;

                if (this.controlDownTime < this.jumpTimeLimit) {
                    jump = true;
                }

                this.controlDownTime = 0;
            } else {
                var size = Math.floor(Screen.width * 0.25);
                var sx = 0;
                var sy = Screen.height - size;

                moveX =  Math.max(-1, Math.min(1, (touch.x - (sx + size * 0.5)) / (size * 0.35) ));
                moveZ = -Math.max(-1, Math.min(1, (touch.y - (sy + size * 0.5)) / (size * 0.35) ));

                this.controlDownTime++;
            }
        }
    } else {
        var left = Input.getKeyPressed('a');
        var right = Input.getKeyPressed('d');
        var forward = Input.getKeyPressed('w');
        var back = Input.getKeyPressed('s');

        if (left && !right) moveX = -1;
        if (right && !left) moveX =  1;
        if (forward && !back) moveZ =  1;
        if (back && !forward) moveZ = -1;
        jump = Input.getKeyPressed('space');
    }

    pos.rotation = pos.yaw;

    pos.speed = Math.sqrt(pos.xa * pos.xa + pos.za * pos.za);

    if (pos.speed < pos.maxSpeed) {
        pos.xa += ( Math.sin(pos.rotation) * moveZ + Math.cos(pos.rotation) * moveX) * pos.acceleration;
        pos.za += (-Math.cos(pos.rotation) * moveZ + Math.sin(pos.rotation) * moveX) * pos.acceleration;
    }

    pos.xa *= pos.deceleration;
    pos.za *= pos.deceleration;

    pos.speed = Math.sqrt(pos.xa * pos.xa + pos.za * pos.za);

    // Engine.setDebugText((Math.round((pos.xa * pos.xa + pos.za * pos.za) * 1000000) / 1000000) + ', ' + (Math.round((pos.speed) * 1000000) / 1000000));

    if (pos.onGround && jump) {
        pos.ya += pos.jump;
    }

    pos.ya -= pos.gravity;
}

ControlSystem.prototype.processLook = function(pos) {
    if (Input.getHadTouchOnce()) {
        var touchList = Input.getTouches();

        if (this.moveTouchId == -1) {
            // Register a finger as movement
            for (var i = 0; i < touchList.length; i++) {
                if (touchList[i].id != this.controlTouchId && !this.touchInControls(touchList[i])) {
                    // Found unused finger, register it
                    this.moveTouchId = touchList[i].id;

                    this.lastMouseX = touchList[i].x;
                    this.lastMouseY = touchList[i].y;
                    break;
                }
            }
        } else {
            var touch = null;
            for (var i = 0; i < touchList.length; i++) {
                if (touchList[i].id == this.moveTouchId) {
                    touch = touchList[i];
                }
            }

            if (touch == null) {
                this.moveTouchId = -1;
            } else {
                var dx = touch.x - this.lastMouseX;
                var dy = touch.y - this.lastMouseY;

                pos.pitch += dy * this.rotateSpeed;
                pos.yaw += dx * this.rotateSpeed;

                this.lastMouseX = touch.x;
                this.lastMouseY = touch.y;
            }
        }
    } else {
        var mousePos = Input.getMousePosition();
        if (Input.getPointerLocked()) {

            var dx = mousePos.x - this.lastMouseX;
            var dy = mousePos.y - this.lastMouseY;

            pos.yaw += dx * this.rotateSpeed;
            pos.pitch += dy * this.rotateSpeed;

            this.lastMouseX = mousePos.x;
            this.lastMouseY = mousePos.y;
        } else {
            this.lastMouseX = mousePos.x;
            this.lastMouseY = mousePos.y;
        }
    }

    if (pos.pitch < -Math.PI * 0.5) pos.pitch = -Math.PI * 0.5;
    if (pos.pitch > Math.PI * 0.5) pos.pitch = Math.PI * 0.5;
}

ControlSystem.prototype.touchInControls = function(touch) {
    var size = Math.floor(Screen.width * 0.25);
    var sx = 0;
    var sy = Screen.height - size;

    return (touch.x > sx && touch.x < sx + size && touch.y > sy && touch.y < sy + size);
}

ControlSystem.prototype.touchIn = function(touch, x, y, w, h) {
    return (touch.x > x && touch.x < x + w && touch.y > y && touch.y < y + h);
}

ControlSystem.prototype.rayTrace = function(x0, y0, z0, x1, y1, z1) {
    var detail = 255;
    for (var i = 0; i < detail; i++) {
        var x = Utils.interpolateLinear(x0, x1, (i / detail)),
            y = Utils.interpolateLinear(y0, y1, (i / detail)),
            z = Utils.interpolateLinear(z0, z1, (i / detail));

        var tile = this.world.getTile(Math.floor(x), Math.floor(y), Math.floor(z));
        if (tile >= 0 && Block[tile] != null && Block[tile].solid) {
            var side = 0;
            var distance = 0.5;
            if (Math.ceil(x) - x < distance) {
                distance = Math.ceil(x) - x;
                side = 1;
            }

            if (x - Math.floor(x) < distance) {
                distance = x - Math.floor(x);
                side = 0;
            }

            if (Math.ceil(y) - y < distance) {
                distance = Math.ceil(y) - y;
                side = 3;
            }

            if (y - Math.floor(y) < distance) {
                distance = y - Math.floor(y);
                side = 2;
            }

            if (Math.ceil(z) - z < distance) {
                distance = Math.ceil(z) - z;
                side = 5;
            }

            if (z - Math.floor(z) < distance) {
                distance = z - Math.floor(z);
                side = 4;
            }

            return new Vec4(Math.floor(x), Math.floor(y), Math.floor(z), side);
        }
    }

    return null;
}

})(global);
