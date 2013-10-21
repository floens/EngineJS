(function(global) {
'use strict';

global.Model = function(gl, program, size) {
    this.gl = gl;
    this.program = program;

    this.buffer = new Renderable(gl, size);
    this.texture = null;
}

Model.prototype.addFace = function(side, dx, dy, dz, dw, dh, sx, sy, sw, sh) {
    switch(side) {
        case 0:
            this.buffer.addQuad(dx     , dy + dh, dz + dw, 1, 1, 1, sx + sw, sy     );
            this.buffer.addQuad(dx     , dy + dh, dz     , 1, 1, 1, sx     , sy     );
            this.buffer.addQuad(dx     , dy     , dz     , 1, 1, 1, sx     , sy + sh);
            this.buffer.addQuad(dx     , dy     , dz + dw, 1, 1, 1, sx + sw, sy + sh);
            break;
        case 1:
            this.buffer.addQuad(dx     , dy + dh, dz     , 1, 1, 1, sx + sw, sy     );
            this.buffer.addQuad(dx     , dy + dh, dz + dw, 1, 1, 1, sx     , sy     );
            this.buffer.addQuad(dx     , dy     , dz + dw, 1, 1, 1, sx     , sy + sh);
            this.buffer.addQuad(dx     , dy     , dz     , 1, 1, 1, sx + sw, sy + sh);
            break;
        case 2:
            this.buffer.addQuad(dx + dh, dy     , dz     , 1, 1, 1, sx     , sy + sh);
            this.buffer.addQuad(dx + dh, dy     , dz + dw, 1, 1, 1, sx + sw, sy + sh);
            this.buffer.addQuad(dx     , dy     , dz + dw, 1, 1, 1, sx + sw, sy     );
            this.buffer.addQuad(dx     , dy     , dz     , 1, 1, 1, sx     , sy     );
            break;
        case 3:
            this.buffer.addQuad(dx     , dy     , dz     , 1, 1, 1, sx     , sy + sh);
            this.buffer.addQuad(dx     , dy     , dz + dw, 1, 1, 1, sx + sw, sy + sh);
            this.buffer.addQuad(dx + dh, dy     , dz + dw, 1, 1, 1, sx + sw, sy     );
            this.buffer.addQuad(dx + dh, dy     , dz     , 1, 1, 1, sx     , sy     );
            break;
        case 4:
            this.buffer.addQuad(dx     , dy + dh, dz     , 1, 1, 1, sx + sw, sy     );
            this.buffer.addQuad(dx + dw, dy + dh, dz     , 1, 1, 1, sx     , sy     );
            this.buffer.addQuad(dx + dw, dy     , dz     , 1, 1, 1, sx     , sy + sh);
            this.buffer.addQuad(dx     , dy     , dz     , 1, 1, 1, sx + sw, sy + sh);
            break;
        case 5:
            this.buffer.addQuad(dx + dw, dy + dh, dz     , 1, 1, 1, sx + sw, sy     );
            this.buffer.addQuad(dx     , dy + dh, dz     , 1, 1, 1, sx     , sy     );
            this.buffer.addQuad(dx     , dy     , dz     , 1, 1, 1, sx     , sy + sh);
            this.buffer.addQuad(dx + dw, dy     , dz     , 1, 1, 1, sx + sw, sy + sh);
            break;
    }
    
}

Model.prototype.render = function() {
    if (!this.buffer.empty) {
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer.buffer);

        this.gl.vertexAttribPointer(this.program.aPosition, 3, this.gl.FLOAT, false, 8 * 4, 0 * 4);
        this.gl.vertexAttribPointer(this.program.aColor,    3, this.gl.FLOAT, false, 8 * 4, 3 * 4);
        this.gl.vertexAttribPointer(this.program.aTexture,  2, this.gl.FLOAT, false, 8 * 4, 6 * 4);

        this.buffer.render();
    }
}

Model.prototype.createTexture = function(image) {
    this.gl.activeTexture(this.gl.TEXTURE0);
    
    this.texture = this.gl.createTexture();

    this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
    this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGB, this.gl.RGB, this.gl.UNSIGNED_BYTE, image);

    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);

    this.gl.uniform1i(this.program.uSampler, 0);
}

Model.prototype.finish = function() {
    this.buffer.finish();
}

})(global);
