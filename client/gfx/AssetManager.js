(function(global, undefined) {
'use strict';

var AssetLoadProgress = function() {
    this._loaded = 0;
    this._total = 0;
}

AssetLoadProgress.prototype.getPercentage = function() {
    if (this._total == 0) return 1;
    return this._loaded / this._total;
}

AssetLoadProgress.prototype.isDone = function() {
    return this._total == 0;
}

AssetLoadProgress.prototype.upLoaded = function() {
    this._loaded++;

    if (this._loaded == this._total) {
        this._loaded = 0;
        this._total = 0;
    }
}

AssetLoadProgress.prototype.upTotal = function() {
    this._total++;
}


var AssetManager = {
    assetMap: {},
    progress: new AssetLoadProgress()
}
AssetManager.load = function(src, name, options) {
    if (this.assetMap[name] != undefined) {
        log('AssetManager: Asset with that name already requested.', log.ERROR);
        return;
    }

    this.assetMap[name] = new Asset(src, options);

    this.progress.upTotal();
}

AssetManager.getAsset = function(name) {
    var asset = this.assetMap[name];
    if (asset == undefined) throw new Error('Asset "' + name + '" is unknown.');
    if (!asset.loaded) {
        // log('AssetManager: Asset exists, but not fully loaded.', log.WARN);
        return null;
    }
    return asset;
}

AssetManager.exists = function(name) {
    return this.assetMap[name] != undefined;
}

AssetManager.getProgress = function() {
    return this.progress;
}


var Asset = function(src, options) {
    this.src = src;
    this.scale = options && options.scale ? options.scale : 1;

    this.image = null;
    this.loaded = false;

    this.load();
}

Asset.prototype.getImage = function() {
    if (!this.loaded) {
        log('AssetManager: Asset not loaded', log.ERROR);
        return null;
    }
    return this.image;
}

Asset.prototype.load = function() {
    var self = this;

    this.image = new Image();
    this.image.onload = function() {
        self.image = this;
        self.onLoad();
    }
    this.image.onerror = function() {
        log('AssetManager: Error loading asset.', log.ERROR);
    }
    this.image.src = this.src;
}

Asset.prototype.onLoad = function() {
    if (this.scale != 1) this.doScale();

    this.loaded = true;

    AssetManager.progress.upLoaded();
}

Asset.prototype.doScale = function() {
    var canvas = document.createElement('canvas');
    // Quick browser check, because asset loading can be done done before the main initializing
    if (canvas.getContext == undefined) return;

    var width = this.image.width * this.scale;
    var height = this.image.height * this.scale;
    canvas.width = width;
    canvas.height = height;
    var ctx = canvas.getContext('2d');
    ctx.drawImage(this.image, 0, 0);
    var imageData = ctx.getImageData(0, 0, this.image.width, this.image.height);

    var scaled = ctx.createImageData(imageData.width * this.scale, imageData.height * this.scale);

    if (!scaled) {
        log('AssetManager: Out of memory.', log.ERROR);
        return;
    }

    for (var row = 0; row < imageData.height; row++) {
        for (var col = 0; col < imageData.width; col++) {
            var sourcePixel = [
                imageData.data[(row * imageData.width + col) * 4 + 0],
                imageData.data[(row * imageData.width + col) * 4 + 1],
                imageData.data[(row * imageData.width + col) * 4 + 2],
                imageData.data[(row * imageData.width + col) * 4 + 3]
            ];
            for (var y = 0; y < this.scale; y++) {
                var destRow = row * this.scale + y;
                for (var x = 0; x < this.scale; x++) {
                    var destCol = col * this.scale + x;
                    for (var i = 0; i < 4; i++) {
                        scaled.data[(destRow * scaled.width + destCol) * 4 + i] = sourcePixel[i];
                    }
                }
            }
        }
    }

    ctx.putImageData(scaled, 0, 0);

    this.image = canvas;
}


global.AssetManager = AssetManager;

})(global);