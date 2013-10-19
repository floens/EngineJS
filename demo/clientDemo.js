(function(global) {
'use strict';

Engine.setOptions({
    containerElement: 'container',
    debug: true
})

var _world;
var _packetHandler;
var _renderSystem;

Engine.load(function() {
    // Input.setFullscreen(true);

    AssetManager.loadFile('shaders/worldVertex.txt', 'worldVertex');
    AssetManager.loadFile('shaders/worldFragment.txt', 'worldFragment');
    AssetManager.loadFile('shaders/modelVertex.txt', 'modelVertex');
    AssetManager.loadFile('shaders/modelFragment.txt', 'modelFragment');

    AssetManager.loadImage('images/terrain.png', 'terrain');
    AssetManager.loadImage('images/terrain.png', 'terrainScaled', {scale: 3});
    AssetManager.loadImage('images/controls.png', 'controls');
    AssetManager.loadImage('images/controls.png', 'controlsScaled', {scale: 3});
    AssetManager.loadImage('images/player.png', 'player');

    UIManager.set(new UIAssetLoad(start, '#ffffff'));
})

var start = function() {
    UIManager.set(new UIMain());

    _renderSystem = new RenderSystem();
    if (!_renderSystem.canvas.getReady()) return;

    Engine.tick(tick);
    Engine.render(render);

    StartMultiplayer('192.168.6.151:8080');
}

global.StartMultiplayer = function(value) {
    _world = new World();
    _world.addSystem(_renderSystem);
    _world.addSystem(new CameraSystem());
    _world.addSystem(new ModelRenderer(_renderSystem.canvas));
    _world.addSystem(new VoxelRenderer(_renderSystem.canvas));

    var remoteSystem = new RemoteClientSystem('ws://' + value, function() {
        _packetHandler = new PacketHandlerClient();
        _packetHandler.setWorld(_world);
        return _packetHandler;
    });

    if (remoteSystem.getConnectError()) {
        UIManager.set(new UIText('Can\'t connect', '#ffffff'));
        _world = null;
    } else {
        _world.addSystem(remoteSystem);

        UIManager.set(new UIText('Connecting', '#ffffff'));

        Input.setPointerLocked(true);
    }
}

var _lx = 0;
var _ly = 0;
var _lz = 0;
var _lYaw = 0;
var _lPitch = 0;

var tick = function() {
    if (_world == null) return;
    _world.tick();

    var ph = _packetHandler;
    if (ph.entity != null) {
        var pos = ph.entity.getComponent(PlayerPositionComponent);
        if (pos.x != _lx || pos.y != _ly || pos.z != _lz || pos.yaw != _lYaw || pos.pitch != _lPitch) {
            _lx = pos.x;
            _ly = pos.y;
            _lz = pos.z;
            _lYaw = pos.yaw;
            _lPitch = pos.pitch;

            ph.sendPacket(new ClientPositionPacket(pos.x, pos.y, pos.z, pos.yaw, pos.pitch));
        }
    }
}

var render = function() {
    if (_world == null) return;
    _world.render();
}


Engine.init();


})(global);
