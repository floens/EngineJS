(function(global, undefined) {
'use strict';

global.VoxelChunk = function(gl, renderer, program, world, x, y, z) {
    this.gl = gl;
    this.renderer = renderer;
    this.program = program;
    this.world = world;
    this.x = x;
    this.y = y;
    this.z = z;

    this.buffer = null;
    this.dirty = true;
}

VoxelChunk.prototype.render = function() {
    if (this.buffer == null) return;

    this.renderer.pushMatrix();
        this.renderer.translate(this.x * 32, this.y * 32, this.z * 32);

        if (!this.buffer.empty) {
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer.buffer);

            this.gl.vertexAttribPointer(this.program.aPosition, 3, this.gl.FLOAT, false, 8 * 4, 0 * 4);
            this.gl.vertexAttribPointer(this.program.aColor,    3, this.gl.FLOAT, false, 8 * 4, 3 * 4);
            this.gl.vertexAttribPointer(this.program.aTexture,  2, this.gl.FLOAT, false, 8 * 4, 6 * 4);

            this.buffer.render();
        }

    this.renderer.popMatrix();
}

VoxelChunk.prototype.makeBuffer = function() {
    if (this.buffer != null) {
        this.gl.deleteBuffer(this.buffer.buffer);
    }

    this.buffer = new Renderable(this.gl, 2000000);

    var world = this.world;

    var block = 0;
    var left = 0;
    var right = 0;
    var bottom = 0;
    var top = 0;
    var back = 0;
    var front = 0;

    for (var x = 0; x < 32; x++) {
        for (var y = 0; y < 32; y++) {
            for (var z = 0; z < 32; z++) {
                var tx = this.x * 32 + x;
                var ty = this.y * 32 + y;
                var tz = this.z * 32 + z;

                block = Block.get(world.getTile(tx, ty, tz));

                if (block != null && block.solid) {
                    left   = Block.get(world.getTile(tx - 1, ty, tz));
                    right  = Block.get(world.getTile(tx + 1, ty, tz));
                    bottom = Block.get(world.getTile(tx, ty - 1, tz));
                    top    = Block.get(world.getTile(tx, ty + 1, tz));
                    back   = Block.get(world.getTile(tx, ty, tz - 1));
                    front  = Block.get(world.getTile(tx, ty, tz + 1));

                    if (left == null || !left.solid) {
                        this.buildLeft(this.buffer, x, y, z, block.textureLeftX, block.textureLeftY);
                    }
                    if (right == null || !right.solid) {
                        this.buildRight(this.buffer, x, y, z, block.textureRightX, block.textureRightY);
                    }
                    if (bottom == null || !bottom.solid) {
                        this.buildBottom(this.buffer, x, y, z, block.textureBottomX, block.textureBottomY);
                    }
                    if (top == null || !top.solid) {
                        this.buildTop(this.buffer, x, y, z, block.textureTopX, block.textureTopY);
                    }
                    if (back == null || !back.solid) {
                        this.buildBack(this.buffer, x, y, z, block.textureBackX, block.textureBackY);
                    }
                    if (front == null || !front.solid) {
                        this.buildFront(this.buffer, x, y, z, block.textureFrontX, block.textureFrontY);
                    }
                }
            }
        }
    }

    this.buffer.finish();

    this.dirty = false;
}

VoxelChunk.prototype.buildTop = function(renderable, x, y, z, u, v) {
    renderable.addQuad(x + 0, y + 1, z + 1, 1, 1, 1, u + 0, v + 1);
    renderable.addQuad(x + 1, y + 1, z + 1, 1, 1, 1, u + 1, v + 1);
    renderable.addQuad(x + 1, y + 1, z + 0, 1, 1, 1, u + 1, v + 0);
    renderable.addQuad(x + 0, y + 1, z + 0, 1, 1, 1, u + 0, v + 0);
}

VoxelChunk.prototype.buildBottom = function(renderable, x, y, z, u, v) {
    renderable.addQuad(x + 0, y + 0, z + 0, 0.4, 0.4, 0.4, u + 0, v + 1);
    renderable.addQuad(x + 1, y + 0, z + 0, 0.4, 0.4, 0.4, u + 1, v + 1);
    renderable.addQuad(x + 1, y + 0, z + 1, 0.4, 0.4, 0.4, u + 1, v + 0);
    renderable.addQuad(x + 0, y + 0, z + 1, 0.4, 0.4, 0.4, u + 0, v + 0);
}

VoxelChunk.prototype.buildLeft = function(renderable, x, y, z, u, v) {
    renderable.addQuad(x + 0, y + 0, z + 0, 0.8, 0.8, 0.8, u + 0, v + 1);
    renderable.addQuad(x + 0, y + 0, z + 1, 0.8, 0.8, 0.8, u + 1, v + 1);
    renderable.addQuad(x + 0, y + 1, z + 1, 0.8, 0.8, 0.8, u + 1, v + 0);
    renderable.addQuad(x + 0, y + 1, z + 0, 0.8, 0.8, 0.8, u + 0, v + 0);
}

VoxelChunk.prototype.buildRight = function(renderable, x, y, z, u, v) {
    renderable.addQuad(x + 1, y + 0, z + 1, 0.8, 0.8, 0.8, u + 0, v + 1);
    renderable.addQuad(x + 1, y + 0, z + 0, 0.8, 0.8, 0.8, u + 1, v + 1);
    renderable.addQuad(x + 1, y + 1, z + 0, 0.8, 0.8, 0.8, u + 1, v + 0);
    renderable.addQuad(x + 1, y + 1, z + 1, 0.8, 0.8, 0.8, u + 0, v + 0);
}

VoxelChunk.prototype.buildFront = function(renderable, x, y, z, u, v) {
    renderable.addQuad(x + 0, y + 0, z + 1, 0.6, 0.6, 0.6, u + 0, v + 1);
    renderable.addQuad(x + 1, y + 0, z + 1, 0.6, 0.6, 0.6, u + 1, v + 1);
    renderable.addQuad(x + 1, y + 1, z + 1, 0.6, 0.6, 0.6, u + 1, v + 0);
    renderable.addQuad(x + 0, y + 1, z + 1, 0.6, 0.6, 0.6, u + 0, v + 0);
}

VoxelChunk.prototype.buildBack = function(renderable, x, y, z, u, v) {
    renderable.addQuad(x + 1, y + 0, z + 0, 0.6, 0.6, 0.6, u + 0, v + 1);
    renderable.addQuad(x + 0, y + 0, z + 0, 0.6, 0.6, 0.6, u + 1, v + 1);
    renderable.addQuad(x + 0, y + 1, z + 0, 0.6, 0.6, 0.6, u + 1, v + 0);
    renderable.addQuad(x + 1, y + 1, z + 0, 0.6, 0.6, 0.6, u + 0, v + 0);
}

})(global);
