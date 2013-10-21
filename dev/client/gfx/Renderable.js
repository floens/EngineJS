(function(global) {
'use strict';

global.Renderable = function(gl, size) {
    this.gl = gl;
    this.array = new Float32Array(size);
    this.size = size;

    this.quadArray = [];
    this.quadCount = 0;

    this.index = 0;
    this.length = 0;
    this.buffer = null;
    this.empty = false;
    this.overloaded = false;
}

Renderable.prototype.addVertex = function(x, y, z, r, g, b, u, v) {
    if (this.length * 8 >= this.size) {
        this.overloaded = true;
        return;
    }

    this.array[this.index++] = x;
    this.array[this.index++] = y;
    this.array[this.index++] = z;
    this.array[this.index++] = r;
    this.array[this.index++] = g;
    this.array[this.index++] = b;
    this.array[this.index++] = u;
    this.array[this.index++] = v;

    this.length++;
}

Renderable.prototype.addQuad = function(x, y, z, r, g, b, u, v) {
    this.quadArray.push([x, y, z, r, g, b, u, v]);
    this.quadCount++;

    if (this.quadCount == 4) {
        this.quadCount = 0;
        this.addVertex(this.quadArray[0][0], this.quadArray[0][1], this.quadArray[0][2], this.quadArray[0][3], this.quadArray[0][4], this.quadArray[0][5], this.quadArray[0][6], this.quadArray[0][7]);
        this.addVertex(this.quadArray[1][0], this.quadArray[1][1], this.quadArray[1][2], this.quadArray[1][3], this.quadArray[1][4], this.quadArray[1][5], this.quadArray[1][6], this.quadArray[1][7]);
        this.addVertex(this.quadArray[2][0], this.quadArray[2][1], this.quadArray[2][2], this.quadArray[2][3], this.quadArray[2][4], this.quadArray[2][5], this.quadArray[2][6], this.quadArray[2][7]);
        this.addVertex(this.quadArray[0][0], this.quadArray[0][1], this.quadArray[0][2], this.quadArray[0][3], this.quadArray[0][4], this.quadArray[0][5], this.quadArray[0][6], this.quadArray[0][7]);
        this.addVertex(this.quadArray[2][0], this.quadArray[2][1], this.quadArray[2][2], this.quadArray[2][3], this.quadArray[2][4], this.quadArray[2][5], this.quadArray[2][6], this.quadArray[2][7]);
        this.addVertex(this.quadArray[3][0], this.quadArray[3][1], this.quadArray[3][2], this.quadArray[3][3], this.quadArray[3][4], this.quadArray[3][5], this.quadArray[3][6], this.quadArray[3][7]);
        this.quadArray = [];
    }
}

Renderable.prototype.finish = function() {
    if (this.length > 0) {
        this.buffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.array.subarray(0, this.length * 8), this.gl.STATIC_DRAW);
    } else {
        this.empty = true;
    }

    this.array = null;

    if (this.overloaded) {
        log('Renderable: too many vertices', log.WARN);
    }
}

Renderable.prototype.destroy = function() {
    if (this.buffer != null) {
        this.gl.deleteBuffer(this.buffer);
    }
}

Renderable.prototype.render = function(position) {
    if (this.buffer != null) {
        this.gl.drawArrays(this.gl.TRIANGLES, 0, this.length);
    }
}

})(global);
