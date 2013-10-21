(function(global) {
'use strict';

global.ParticleModel = function() {
    Component.call(this);

    this.x = 0;
    this.y = 0;
    this.z = 0;

    this.textureX = 0;
    this.textureY = 0;
    this.width = 0;
    this.height = 0;

    this.model = null;
}
ParticleModel.extend(Component);
Component.registerComponent(ParticleModel, 108);

ParticleModel.prototype.setInfo = function(textureX, textureY, width, height) {
    this.textureX = textureX;
    this.textureY = textureY;
    this.width = width;
    this.height = height;
}

ParticleModel.prototype.onRemove = function() {
    if (this.model != null) {
        this.model.remove();
    }
}

ParticleModel.prototype.render = function(gl, renderer, program, camera, pos) {
    if (this.model == null) {
        this.model = this.createModel(gl, program);
    }

    this.x = pos.x;
    this.y = pos.y;
    this.z = pos.z;

    renderer.pushMatrix();
        // renderer.translate(this.x + this.width / 2, this.y + 0.01, this.z + this.width / 2);
        renderer.translate(this.x, this.y + 0.01, this.z);

        renderer.rotateY(-camera.rotateY + Math.PI / 2);
        renderer.rotateZ(-camera.rotateX);

        renderer.translate(-this.width / 2, -this.height / 2, -this.width / 2);

        this.model.render();
    renderer.popMatrix();
}

ParticleModel.prototype.createModel = function(gl, program) {
    var image = AssetManager.getAsset('terrain').getImage();

    var model = new Model(gl, program, 100);

    model.createTexture(image);
    
    model.addFace(0, 0, 0, 0, this.width, this.height, 
        this.textureX / 16, this.textureY / 16, 0.2 / 16, 0.2 / 16);

    model.finish();

    return model;
}



})(global);
