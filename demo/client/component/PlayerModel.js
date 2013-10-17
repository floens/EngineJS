(function(global, undefined) {
'use strict';

var _model = null;
var _head = null;
var _arm = null;
var _leg = null;

global.PlayerModel = function() {
    Component.call(this);

    this.x = 0;
    this.y = 0;
    this.z = 0;

    this.headYaw = 0;
    this.headPitch = 0;
    this.rotateSpeed = 0;

    this.armRotateZ = 0;
    this.armRotateX = 0;
    this.legRotateZ = 0;

    this.lastX = 0;
    this.lastY = 0;
    this.lastZ = 0;
}
PlayerModel.extend(Component);
Component.registerComponent(PlayerModel, 105);

PlayerModel.prototype.render = function(gl, renderer, program, pos) {
    if (_model == null) {
        this.createPlayerModel(gl, program);
    }

    var interp = pos.getInterpolated();
    this.x = interp.x;
    this.y = interp.y;
    this.z = interp.z;
    this.headYaw = interp.yaw;
    this.headPitch = interp.pitch;

    var dx = this.x - this.lastX;
    var dz = this.z - this.lastZ;
    this.lastX = this.x;
    this.lastZ = this.z;

    this.rotateSpeed += Math.sqrt(dx * dx + dz * dz) * 0.04;
    this.rotateSpeed *= 0.8;

    this.armRotateX += 0.05;

    renderer.pushMatrix();
        renderer.translate(this.x + 0.15, this.y, this.z - 0.1);
        renderer.translate(1 / 4, 0, 1 / 2);
        renderer.rotateY(-this.headYaw - Math.PI / 2);
        renderer.translate(-1 / 4, 0, -1 / 2);

        _model.render();

        this.armRotateZ += this.rotateSpeed * 25;
        this.legRotateZ += this.rotateSpeed * 25;

        // Head
        renderer.pushMatrix();
            renderer.translate(0 / 4, 0 / 4, 1 / 4);

            renderer.translate(1 / 4, 6 / 4, 1 / 4);

            // renderer.rotateY(-this.headYaw - Math.PI / 2);
            // renderer.rotateX(0.5);
            renderer.rotateZ(this.headPitch);
            
            renderer.translate(-1 / 4, -6 / 4, -1 / 4);

            // renderer.rotateY(this.headYaw);
            // renderer.translate(-2 / 4, -2 / 4, -1 / 4);

            _head.render();
        renderer.popMatrix();

        // Arm
        renderer.pushMatrix();
            renderer.pushMatrix();
                renderer.translate(1 / 4, 3 / 2, 2 / 8);
                renderer.rotateZ(Math.sin(this.armRotateZ) * this.rotateSpeed * 50);
                renderer.rotateX((Math.sin(this.armRotateX) + 1) * 0.02);
                renderer.translate(-1 / 8, -3 / 4, -2 / 8);

                _arm.render();
            renderer.popMatrix();

            renderer.translate(1 / 2, 0, 1);
            renderer.rotateY(Math.PI);

            renderer.pushMatrix();
                renderer.translate(1 / 4, 3 / 2, 2 / 8);
                renderer.rotateZ(Math.sin(this.armRotateZ) * this.rotateSpeed * 50);
                renderer.rotateX((Math.sin(this.armRotateX) + 1) * 0.021);
                // renderer.rotateY(Math.PI);
                renderer.translate(-1 / 8, -3 / 4, -2 / 8);

                _arm.render();
            renderer.popMatrix();

        renderer.popMatrix();

        // Leg
        renderer.pushMatrix();
            renderer.translate(1 / 4, 3 / 4, 1 / 4);

            renderer.pushMatrix();
                renderer.rotateZ(-Math.sin(this.legRotateZ) * this.rotateSpeed * 50);
                renderer.translate(-1 / 8, -3 / 4, 0);

                _leg.render();

            renderer.popMatrix();

            renderer.pushMatrix();
                renderer.rotateZ(Math.sin(this.legRotateZ) * this.rotateSpeed * 50);
                renderer.translate(-1 / 8, -3 / 4, 1 / 4);

                _leg.render();

            renderer.popMatrix();
        renderer.popMatrix();

    renderer.popMatrix();
}

PlayerModel.prototype.createPlayerModel = function(gl, program) {
    var image = AssetManager.getAsset('player').getImage();

    var model = new Model(gl, program, 300);

    model.createTexture(image);
    
    // Torso
    //            s  x       y       z       w       h        sx      sy       sw      sh
    model.addFace(0, 2 / 16, 12/ 16, 4 / 16, 8 / 16, 12 / 16, 20/ 64, 20 / 64, 8 / 64, 12 / 64);
    model.addFace(4, 2 / 16, 12/ 16, 4 / 16, 4 / 16, 12 / 16, 16/ 64, 20 / 64, 4 / 64, 12 / 64);
    model.addFace(5, 2 / 16, 12/ 16, 12/ 16, 4 / 16, 12 / 16, 28/ 64, 20 / 64, 4 / 64, 12 / 64);
    model.addFace(1, 6 / 16, 12/ 16, 4 / 16, 8 / 16, 12 / 16, 32/ 64, 20 / 64, 4 / 64, 12 / 64);
    model.addFace(2, 2 / 16, 12/ 16, 4 / 16, 8 / 16, 4  / 16, 28/ 64, 16 / 64, 8 / 64, 4  / 64);
    model.addFace(3, 2 / 16, 24/ 16, 4 / 16, 8 / 16, 4  / 16, 20/ 64, 16 / 64, 8 / 64, 4  / 64);


    model.finish();
    _model = model;


    var head = new Model(gl, program, 300);
    head.createTexture(image);

    // Head
    //           s  x       y       z       w       h        sx      sy       sw      sh
    head.addFace(0, 0     , 24/ 16, 0     , 8 / 16, 8  / 16, 8 / 64, 8  / 64, 8 / 64, 8 / 64);
    head.addFace(4, 0     , 24/ 16, 0     , 8 / 16, 8  / 16, 0 / 64, 8  / 64, 8 / 64, 8 / 64);
    head.addFace(5, 0     , 24/ 16, 8 / 16, 8 / 16, 8  / 16, 16/ 64, 8  / 64, 8 / 64, 8 / 64);
    head.addFace(1, 8 / 16, 24/ 16, 0     , 8 / 16, 8  / 16, 8 / 64, 0  / 64, 8 / 64, 8 / 64);
    head.addFace(2, 0     , 24/ 16, 0     , 8 / 16, 8  / 16, 16/ 64, 0  / 64, 8 / 64, 8 / 64);
    head.addFace(3, 0     , 32/ 16, 0     , 8 / 16, 8  / 16, 8 / 64, 0  / 64, 8 / 64, 8 / 64);

    head.finish();
    _head = head;

    var arm = new Model(gl, program, 300);
    arm.createTexture(image);

    // Left arm
    //          s  x       y       z       w       h        sx      sy       sw      sh
    arm.addFace(0, 0     , 0     , 0     , 4 / 16, 12 / 16, 44/ 64, 20 / 64, 4 / 64, 12/ 64);
    arm.addFace(4, 0     , 0     , 0     , 4 / 16, 12 / 16, 40/ 64, 20 / 64, 4 / 64, 12/ 64);
    arm.addFace(5, 0     , 0     , 4 / 16, 4 / 16, 12 / 16, 48/ 64, 20 / 64, 4 / 64, 12/ 64);
    arm.addFace(1, 4 / 16, 0     , 0     , 4 / 16, 12 / 16, 52/ 64, 20 / 64, 4 / 64, 12/ 64);
    arm.addFace(2, 0     , 0     , 0     , 4 / 16, 4  / 16, 48/ 64, 16 / 64, 4 / 64, 4 / 64);
    arm.addFace(3, 0     , 12/ 16, 0     , 4 / 16, 4  / 16, 44/ 64, 16 / 64, 4 / 64, 4 / 64);

    arm.finish();
    _arm = arm;

    var leg = new Model(gl, program, 300);
    leg.createTexture(image);

    // Left leg
    //          s  x       y       z       w       h        sx      sy       sw      sh
    leg.addFace(0, 0     , 0     , 0     , 4 / 16, 12 / 16, 4 / 64, 20 / 64, 4 / 64, 12 / 64);
    leg.addFace(4, 0     , 0     , 0     , 4 / 16, 12 / 16, 0 / 64, 20 / 64, 4 / 64, 12 / 64);
    leg.addFace(5, 0     , 0     , 4 / 16, 4 / 16, 12 / 16, 8 / 64, 20 / 64, 4 / 64, 12 / 64);
    leg.addFace(1, 4 / 16, 0     , 0     , 4 / 16, 12 / 16, 12/ 64, 20 / 64, 4 / 64, 12 / 64);
    leg.addFace(2, 0     , 0     , 0     , 4 / 16, 4  / 16, 8 / 64, 16 / 64, 4 / 64, 4  / 64);
    leg.addFace(3, 0     , 12/ 16, 0     , 4 / 16, 4  / 16, 4 / 64, 16 / 64, 4 / 64, 4  / 64);

    leg.finish();
    _leg = leg;
}



})(global);
