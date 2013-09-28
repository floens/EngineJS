(function(global, undefined) {
'use strict';

Engine.setOptions({
    containerElement: 'gameContainer',
    minWidth: 200,
    minHeight: 200,
    maxWidth: 1200,
    maxHeight: 600
})


Engine.load(function() {
    if (!RemoteClientSystem.getWebSocketSupport()) {
        UIManager.set(new UIText('This browser does not support multiplayer :('));
        return;
    }

    UIManager.set(new UILoad(start));

    AssetManager.load('res/EntityPlayer.png', 'player', {
        scale: 4
    });
})

var _world;

var start = function() {
    UIManager.set(null);

    var world = new World();
    world.setRemote(false);
    world.addSystem(new MovementSystem());
    world.addSystem(new RenderSystem());
    world.addSystem(new InputSystem());

    var remoteSystem = new RemoteClientSystem('ws://localhost:8080', function() {
        var packetHandler = new PacketHandlerClient();
        packetHandler.setWorld(world);
        return packetHandler;
    });

    world.addSystem(remoteSystem);

    _world = world;
    global.world = world;

    // var box = new EntityBox(world, 64, 64);
    // box.add();

    /*var circle = new EntityCircle(world, 64);
    circle.addComponent(new ControllableComponent());
    circle.getComponent(RenderComponent).setColor('#3E3E9E');
    circle.getComponent(PositionComponent).x = 400;
    circle.getComponent(PositionComponent).y = 0;
    circle.getComponent(CollidableComponent).setMass(0.1).setElasticity(0.1);
    circle.add();*/

    var player = new EntityPlayer(world);
    player.addComponent(new ImageRenderComponent(AssetManager.getAsset('player'), 0, 0, 64, 96));
    player.addComponent(new ControllableComponent());
    player.add();

    Engine.tick(tick);
    Engine.render(render);
}

var tick = function() {
    _world.tick();
}

var render = function() {
    _world.render();
}


Engine.init();


})(global);
