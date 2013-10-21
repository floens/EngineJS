(function(global) {
'use strict';

global.VoxelRenderer = function(canvas) {
    System.call(this);

    this.setLoopType(System.RENDER_LOOP);
    this.addAspect(CameraComponent);

    this.renderer = new GLRenderer(canvas);
    this.gl = this.renderer.gl;

    this.camera = null;
    this.voxelWorld = null;
    this.program = null;

    this.lw = 0;
    this.lh = 0;

    this.frameCount = 0;
    this.chunksX = 0;
    this.chunksY = 0;
    this.chunksZ = 0;
    this.chunkList = [];

    this.setup();
}
VoxelRenderer.extend(System);
System.registerSystem(VoxelRenderer, 106);

VoxelRenderer.prototype.setVoxelWorld = function(voxelWorld) {
    this.voxelWorld = voxelWorld;

    if (voxelWorld == null) {
        this.chunksX = -1;
        this.chunksY = -1;
        this.chunksZ = -1;
        this.chunkList = [];
    } else {
        if (this.voxelWorld.width % 32 != 0 || this.voxelWorld.height % 32 != 0 || this.voxelWorld.depth % 32 != 0) {
            throw new Error('VoxelWorld width, height and depth must be divisible by 32.');
        }

        this.chunksX = this.voxelWorld.width / 32;
        this.chunksY = this.voxelWorld.height / 32;
        this.chunksZ = this.voxelWorld.depth / 32;

        this.createChunks();
    }
}

VoxelRenderer.prototype.onRemove = function() {
    for (var i = 0; i < this.chunkList.length; i++) {
        this.chunkList[i].destroy();
    }
}

VoxelRenderer.prototype.setProjection = function() {
    this.renderer.setProjection(70 * (Math.PI / 180), 0.001, 1000);
}

VoxelRenderer.prototype.setup = function() {
    var vertexShader = this.renderer.createShader(AssetManager.getAsset('worldVertex').getText(), this.gl.VERTEX_SHADER);
    var fragmentShader = this.renderer.createShader(AssetManager.getAsset('worldFragment').getText(), this.gl.FRAGMENT_SHADER);

    this.program = this.renderer.createProgram(vertexShader, fragmentShader);

    this.gl.useProgram(this.program);

    this.program.aPosition = this.gl.getAttribLocation(this.program, 'aPosition');
    this.gl.enableVertexAttribArray(this.program.aPosition);

    this.program.aColor = this.gl.getAttribLocation(this.program, 'aColor');
    this.gl.enableVertexAttribArray(this.program.aColor);

    this.program.aTexture = this.gl.getAttribLocation(this.program, 'aTexture');
    this.gl.enableVertexAttribArray(this.program.aTexture);

    this.program.uSampler = this.gl.getUniformLocation(this.program, 'uSampler');
    this.renderer.setProjectionMatrix(this.gl.getUniformLocation(this.program, 'mProj'));
    this.renderer.setViewMatrix(this.gl.getUniformLocation(this.program, 'mView'));

    this.texture = this.makeTexture(AssetManager.getAsset('terrain').getImage());
}

VoxelRenderer.prototype.makeTexture = function(image) {
    this.gl.activeTexture(this.gl.TEXTURE0);
    
    var texture = this.gl.createTexture();

    this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
    this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGB, this.gl.RGB, this.gl.UNSIGNED_BYTE, image);

    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);

    this.gl.uniform1i(this.program.uSampler, 0);

    return texture;
}

/**
 * Update, sort, build and render chunks.
 */
VoxelRenderer.prototype.tick = function() {
    this.parent.tick.call(this);

    if (this.voxelWorld == null) return;

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

    this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);

    if (this.frameCount % 5 == 0) {
        this.updateChunks();
        this.sortChunks();
        this.buildChunks(2);
    }

    this.renderer.pushMatrix();
        this.renderer.rotateX(this.camera.rotateX);
        this.renderer.rotateY(this.camera.rotateY);
        this.renderer.translate(-this.camera.x, -this.camera.y, -this.camera.z);

        var cameraX = this.camera.x;
        var cameraY = this.camera.y;
        var cameraZ = this.camera.z;

        for (var i = 0; i < this.chunkList.length; i++) {
            this.chunkList[i].render();
        }

    this.renderer.popMatrix();

    this.frameCount++;
}

/**
 * Look for dirty chunks and build the buffer, in order created by sortChunks
 */
VoxelRenderer.prototype.buildChunks = function(amount) {
    for (var i = 0; i < this.chunkList.length; i++) {
        if (this.chunkList[i].dirty) {
            this.chunkList[i].makeBuffer();
            amount--;
            if (amount == 0) return;
        }
    }
}

/**
 * Look for dirty tiles in VoxelWorld, and flag the corresponding chunks dirty
 */
VoxelRenderer.prototype.updateChunks = function() {
    var dirtyTiles = this.voxelWorld.getDirtyTiles();
    this.voxelWorld.clearDirtyTiles();

    for (var i = 0; i < this.chunkList.length; i++) {
        var c = this.chunkList[i];
        for (var j = 0; j < dirtyTiles.length; j++) {
            var t = dirtyTiles[j];

            if (t.x < c.x * 32 - 1 || t.y < c.y * 32 - 1 || t.z < c.z * 32 - 1 || 
                t.x > c.x * 32 + 32 || t.y > c.y * 32 + 32 || t.z > c.z * 32 + 32) continue;

            c.dirty = true;
        }
    }
}

/**
 * Make new VoxelChunk objects. They are not directly build.
 */
VoxelRenderer.prototype.createChunks = function() {
    for (var x = 0; x < this.chunksX; x++) {
        for (var y = 0; y < this.chunksY; y++) {
            for (var z = 0; z < this.chunksZ; z++) {
                var chunk = new VoxelChunk(this.gl, this.renderer, this.program, this.voxelWorld, x, y, z);
                this.chunkList.push(chunk);
            }
        }
    }
}

/**
 * Sort the chunkList in distance from the camera
 */
VoxelRenderer.prototype.sortChunks = function() {
    var cameraX = this.camera.x;
    var cameraY = this.camera.y;
    var cameraZ = this.camera.z;

    this.chunkList.sort(function(a, b) {
        var ax = a.x * 32 - cameraX;
        var ay = a.y * 32 - cameraY;
        var az = a.z * 32 - cameraZ;
        var bx = b.x * 32 - cameraX;
        var by = b.y * 32 - cameraY;
        var bz = b.z * 32 - cameraZ;

        var ad = ax * ax + ay * ay + az * az;
        var bd = bx * bx + by * by + bz * bz;

        if (ad < bd) {
            return -1;
        } else if (ad == bd) {
            return 0;
        } else {
            return 1;
        }
    });
}


})(global);
