(function(global) {
'use strict';


global.Block = function(id) {
    if (Block[id] != null) {
        throw new Error('Block with id ' + id + ' already registered.');
    }

    Block[id] = this;

    this.id = id;
    this.textureLeftX = 0;
    this.textureLeftY = 0;
    this.textureRightX = 0;
    this.textureRightY = 0;
    this.textureBottomX = 0;
    this.textureBottomY = 0;
    this.textureTopX = 0;
    this.textureTopY = 0;
    this.textureBackX = 0;
    this.textureBackY = 0;
    this.textureFrontX = 0;
    this.textureFrontY = 0;
    this.solid = true;
}

for (var i = 0; i < 100; i++) Block[i] = null;

Block.prototype.setTexture = function(leftX, leftY, rightX, rightY, bottomX, bottomY, topX, topY, backX, backY, frontX, frontY) {
    this.textureLeftX = leftX;
    this.textureLeftY = leftY;
    this.textureRightX = rightX;
    this.textureRightY = rightY;
    this.textureBottomX = bottomX;
    this.textureBottomY = bottomY;
    this.textureTopX = topX;
    this.textureTopY = topY;
    this.textureBackX = backX;
    this.textureBackY = backY;
    this.textureFrontX = frontX;
    this.textureFrontY = frontY;
    return this;
}

Block.prototype.setSolid = function(e) {
    this.solid = e;
    return this;
}


// Static functions
Block.get = function(id) {
    if (id < 0 || id >= 100) return null;
    return Block[id];
}

// Static variables
Block.AIR = new Block(0).setSolid(false);
Block.STONE = new Block(1).setTexture(1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0);
Block.DIRT = new Block(2).setTexture(2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0);
Block.GRASS = new Block(3).setTexture(3, 0, 3, 0, 2, 0, 0, 0, 3, 0, 3, 0);
Block.COBBLESTONE = new Block(4).setTexture(4, 0, 4, 0, 4, 0, 4, 0, 4, 0, 4, 0);
Block.PLANKS = new Block(5).setTexture(5, 0, 5, 0, 5, 0, 5, 0, 5, 0, 5, 0);
Block.BRICK = new Block(6).setTexture(6, 0, 6, 0, 6, 0, 6, 0, 6, 0, 6, 0);
Block.SAND = new Block(7).setTexture(7, 0, 7, 0, 7, 0, 7, 0, 7, 0, 7, 0);
Block.GRAVEL = new Block(8).setTexture(8, 0, 8, 0, 8, 0, 8, 0, 8, 0, 8, 0);



})(global);
