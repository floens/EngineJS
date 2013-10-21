(function(global) {
'use strict';

global.ModelRenderer = function(canvas) {
    System.call(this);

    this.setLoopType(System.RENDER_LOOP);
    this.addOrAspect(CameraComponent);
    this.addOrAspect(PlayerModel);

    this.renderer = new GLRenderer(canvas);
    this.gl = canvas.gl;

    this.camera = null;
    this.program = null;

    this.lw = 0;
    this.lh = 0;

    this.setup();
}
ModelRenderer.extend(System);
System.registerSystem(ModelRenderer, 105);

ModelRenderer.prototype.setProjection = function() {
    this.renderer.setProjection(70 * (Math.PI / 180), 0.001, 1000);
}

ModelRenderer.prototype.setup = function() {
    var vertexShader = this.renderer.createShader(AssetManager.getAsset('modelVertex').getText(), this.gl.VERTEX_SHADER);
    var fragmentShader = this.renderer.createShader(AssetManager.getAsset('modelFragment').getText(), this.gl.FRAGMENT_SHADER);

    this.program = this.renderer.createProgram(vertexShader, fragmentShader);

    this.gl.useProgram(this.program);

    this.gl.enable(this.gl.DEPTH_TEST);
    // this.gl.cullFace(this.gl.BACK);

    this.program.aPosition = this.gl.getAttribLocation(this.program, 'aPosition');
    this.gl.enableVertexAttribArray(this.program.aPosition);

    this.program.aColor = this.gl.getAttribLocation(this.program, 'aColor');
    this.gl.enableVertexAttribArray(this.program.aColor);

    this.program.aTexture = this.gl.getAttribLocation(this.program, 'aTexture');
    this.gl.enableVertexAttribArray(this.program.aTexture);

    this.program.uSampler = this.gl.getUniformLocation(this.program, 'uSampler');
    this.renderer.setProjectionMatrix(this.gl.getUniformLocation(this.program, 'mProj'));
    this.renderer.setViewMatrix(this.gl.getUniformLocation(this.program, 'mView'));
}

ModelRenderer.prototype.tick = function() {
    this.parent.tick.call(this);

    this.gl.useProgram(this.program);

    if (this.lw != Screen.width || this.lh != Screen.height) {
        this.lw = Screen.width;
        this.lh = Screen.height;
        this.setProjection();
    }

    for (var i = 0; i < this.entities.length; i++) {
        if (this.entities[i].hasComponent(CameraComponent)) {
            this.camera = this.entities[i].getComponent(CameraComponent);
        }
    }
    
    if (this.camera == null) return;

    this.renderer.pushMatrix();
        this.renderer.rotateX(this.camera.rotateX);
        this.renderer.rotateY(this.camera.rotateY);
        this.renderer.translate(-this.camera.x, -this.camera.y, -this.camera.z);

        for (var i = 0; i < this.entities.length; i++) {
            var e = this.entities[i];
            
            if (e.hasComponent(PlayerModel) && e.hasComponent(PlayerPositionComponent)) {
                var playerModel = e.getComponent(PlayerModel);
                var pos = e.getComponent(PlayerPositionComponent);
                playerModel.render(this.gl, this.renderer, this.program, pos);
            }
        }

    this.renderer.popMatrix();
}


})(global);
