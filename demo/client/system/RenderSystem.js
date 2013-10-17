(function(global, undefined) {
'use strict';

global.RenderSystem = function() {
    System.call(this);

    this.setLoopType(System.RENDER_LOOP);
    this.addAspect(CameraComponent);

    this.lw = 0;
    this.lh = 0;

    this.canvas = new GLCanvas(Screen.width, Screen.height, 50, {
        antialias: false,
        alpha: false
    });

    if (!this.canvas.getReady()) {
        UIManager.set(new UIText('WebGL not supported.', '#ffffff'));
        return;
    }

    this.uiCanvas = new Canvas(Screen.width, Screen.height, 60);
    this.gl = this.canvas.gl;

    this.shownControls = false;
    this.shownControlsAsTouch = false;

    this.setup();
}
RenderSystem.extend(System);
System.registerSystem(RenderSystem, 100);

RenderSystem.prototype.setup = function() {
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.enable(this.gl.CULL_FACE);
    this.gl.cullFace(this.gl.BACK);
}

RenderSystem.prototype.tick = function() {
    this.parent.tick.call(this);

    if (this.lw != Screen.width || this.lh != Screen.height) {
        this.lw = Screen.width;
        this.lh = Screen.height;

        this.canvas.setDimensions(Screen.width, Screen.height);
        this.uiCanvas.setDimensions(Screen.width, Screen.height);

        if (this.voxelRenderer != null) {
            this.voxelRenderer.setProjection();
        }

        this.shownControls = false;
    }

    if (!this.shownControls || (!this.shownControlsAsTouch && Input.getHadTouchOnce())) {
        this.uiCanvas.clear();
        this.renderControls();
        this.shownControls = true;
    }

    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    this.gl.clearColor(0.7, 0.8, 1.0, 1.0);
}

RenderSystem.prototype.renderControls = function() {
    var image = AssetManager.getAsset('controls').getImage();
    
    if (Input.getHadTouchOnce()) {
        var size = Math.floor(Screen.width * 0.25);
        this.uiCanvas.fillImageStretch(image, 0, Screen.height - size, size, size, 0, 0, 200, 200);
    }

    this.uiCanvas.fillImage(image, Screen.width / 2 - 15, Screen.height / 2 - 15, 200, 0, 30, 30);
}


})(global);
