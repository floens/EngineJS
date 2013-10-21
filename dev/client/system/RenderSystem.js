(function(global) {
'use strict';

global.RenderSystem = function() {
    System.call(this);

    this.setLoopType(System.RENDER_LOOP);
    this.addOrAspect(ControlComponent);
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
    }

    this.uiCanvas.clear();

    for (var i = 0; i < this.entities.length; i++) {
        if (this.entities[i].hasComponent(ControlComponent)) {
            this.renderBlocks(this.entities[i].getComponent(ControlComponent));
        }
    }

    this.renderControls();

    this.gl.clearColor(0.7, 0.8, 1.0, 1.0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
}

RenderSystem.prototype.clear = function() {
    this.gl.clearColor(0, 0, 0, 1);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    this.uiCanvas.clear();
}

RenderSystem.prototype.renderControls = function() {
    var image = AssetManager.getAsset('controls').getImage();
    
    if (Input.getHadTouchOnce()) {
        var size = Math.floor(Screen.width * 0.25);
        this.uiCanvas.fillImageStretch(image, 0, Screen.height - size, size, size, 0, 0, 200, 200);
    }

    this.uiCanvas.fillImage(image, Screen.width / 2 - 15, Screen.height / 2 - 15, 200, 0, 30, 30);
}

RenderSystem.prototype.renderBlocks = function(control) {
    var terrain = AssetManager.getAsset('terrainScaled').getImage();

    var count = control.barCount;
    var size = 3 * 16;
    var spacing = 8;
    var selectedSpacing = 4;
    var x = Screen.width / 2 - (size * count + spacing * count - spacing) / 2;
    var y = Screen.height - size;
    for (var i = 0; i < count; i++) {
        var block = Block[control.barBlocks[i]];
        var tx = block.textureFrontX * 3 * 16;
        var ty = block.textureFrontY * 3 * 16;

        if (i == control.barIndex) {
            this.uiCanvas.fillRect(x + i * size + i * spacing - selectedSpacing, y - spacing - selectedSpacing, 
                size + selectedSpacing * 2, size + selectedSpacing * 2, 'rgba(20, 20, 20, 0.7)');
        }

        this.uiCanvas.fillImage(terrain, x + i * size + i * spacing, y - spacing, tx, ty, size, size);
    }
}


})(global);
