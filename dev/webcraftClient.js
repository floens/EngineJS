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

    // WebCraft.startSinglePlayer();
}

global.WebCraft = {};
WebCraft.startMultiPlayer = function(url) {
    _world = new World();

    var remoteSystem = new RemoteClientSystem('ws://' + url, function() {
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
    }
}

WebCraft.startSinglePlayer = function() {
    _world = new World();

    WebCraft.world = _world;

    var player = WebCraft.startGame(32, 32, 32, null);
    player.add();

    for (var i = 0; i < 1; i++) {
        var particle = new EntityParticle(_world);
        var pos = particle.getComponent(PlayerPositionComponent);
        pos.x = 2;
        pos.y = 23;
        pos.z = 2;
        particle.add();
    }
}

WebCraft.startGame = function(width, height, depth, tileArray) {
    global.world = _world;

    // UIManager.set(new UIGame());
    UIManager.set(null);
    Input.setPointerLocked(true);

    _world.addSystem(_renderSystem);
    _world.addSystem(new CameraSystem());
    _world.addSystem(new ModelRenderer(_renderSystem.canvas));
    _world.addSystem(new VoxelRenderer(_renderSystem.canvas));

    var voxelWorld = new VoxelWorld(width, height, depth);
    if (tileArray == null) {
        voxelWorld.generate();
    } else {
        voxelWorld.tileArray = tileArray;
    }

    _world.addSystem(new ParticleSystem());
    _world.addSystem(voxelWorld);
    _world.addSystem(new MovementSystem(voxelWorld));
    _world.addSystem(new ControlSystem(voxelWorld));
    _world.getSystem(VoxelRenderer).setVoxelWorld(voxelWorld);

    var entity = new EntityPlayer(_world);
    entity.addComponent(new CameraComponent());
    entity.addComponent(new ControlComponent());
    entity.getComponent(PlayerPositionComponent).y = 22;
    entity.getComponent(PlayerPositionComponent).yaw = Math.PI * 3 / 4;
    return entity;
}

WebCraft.stopGame = function() {
    if (_world == null) return;
    _world.remove();
    _world = null;

    _packetHandler = null;

    _renderSystem.clear();
    UIManager.set(new UIMain());
    Input.setPointerLocked(false);
}

var _lx = 0;
var _ly = 0;
var _lz = 0;
var _lYaw = 0;
var _lPitch = 0;

var tick = function() {
    if (_world == null) return;
    _world.tick();


    if (_packetHandler == null) return;
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
