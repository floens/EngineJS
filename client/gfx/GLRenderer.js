(function(global) {
'use strict';

global.GLRenderer = function(canvas) {
    this.canvas = canvas;
    this.gl = canvas.gl;

    this.viewMatrixId = -1;
    this.projectionMatrixId = -1;

    this.matrixStack = [];
    this.projectionMatrix = mat4.create();

    var newer = mat4.create();
    this.matrixStack.push(newer);
    this.viewMatrix = newer;
}

GLRenderer.prototype.setViewMatrix = function(id) {
    this.viewMatrixId = id;
    this.setMatrix(id, this.viewMatrix);
}

GLRenderer.prototype.setProjectionMatrix = function(id) {
    this.projectionMatrixId = id;
    this.setMatrix(id, this.projectionMatrix);
}

GLRenderer.prototype.clear = function(r, g, b, a) {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    this.gl.clearColor(r, g, b, a);
}

GLRenderer.prototype.setProjection = function(fov, near, far) {
    mat4.perspective(this.projectionMatrix, fov, this.canvas.width / this.canvas.height, near, far);
    this.gl.uniformMatrix4fv(this.projectionMatrixId, false, this.projectionMatrix);
}

GLRenderer.prototype.setMatrix = function(id, matrix) {
    this.gl.uniformMatrix4fv(id, false, matrix);
}

GLRenderer.prototype.pushMatrix = function() {
    var newer = mat4.create();
    mat4.copy(newer, this.viewMatrix);
    this.matrixStack.push(newer);
    this.viewMatrix = newer;
}

GLRenderer.prototype.popMatrix = function() {
    this.matrixStack.pop();
    this.viewMatrix = this.matrixStack[this.matrixStack.length - 1];
}

GLRenderer.prototype.rotateX = function(e) {
    mat4.rotateX(this.viewMatrix, this.viewMatrix, e);
    this.setMatrix(this.viewMatrixId, this.viewMatrix);
}

GLRenderer.prototype.rotateY = function(e) {
    mat4.rotateY(this.viewMatrix, this.viewMatrix, e);
    this.setMatrix(this.viewMatrixId, this.viewMatrix);
}

GLRenderer.prototype.rotateZ = function(e) {
    mat4.rotateZ(this.viewMatrix, this.viewMatrix, e);
    this.setMatrix(this.viewMatrixId, this.viewMatrix);
}

GLRenderer.prototype.translate = function(x, y, z) {
    mat4.translate(this.viewMatrix, this.viewMatrix, [x, y, z]);
    this.setMatrix(this.viewMatrixId, this.viewMatrix);
}

GLRenderer.prototype.createShader = function(source, type) {
    var shader = this.gl.createShader(type);
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);

    if (this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS) == false) {
        throw new Error('Shader failed to compile: ' + this.gl.getShaderInfoLog(shader));
    }

    return shader;
}

GLRenderer.prototype.createProgram = function(vertexShader, fragmentShader) {
    var program = this.gl.createProgram();
    this.gl.attachShader(program, vertexShader);
    this.gl.attachShader(program, fragmentShader);
    this.gl.linkProgram(program);

    return program;
}


})(global);
