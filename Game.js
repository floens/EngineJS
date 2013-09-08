(function(global, undefined) {
'use strict';


Engine.setOptions({
    containerElement: 'container'
})


Engine.load(function() {
    UIManager.set(new UILoad(start));

    AssetManager.load('res/EntityPlayer.png', 'player', {
        scale: 4
    });
})


var _worldManager;

var start = function() {
    UIManager.set(null);

    var world = new World();
    world.setRemote(false);
    world.addSystem(new MovementSystem());
    world.addSystem(new RenderSystem());
    world.addSystem(new InputSystem());
    world.addSystem(new RemoteClientSystem('ws://localhost:8080', new PacketHandlerClient()));

    _worldManager = new WorldManager();
    _worldManager.setWorld(world);

    global.worldManager = _worldManager;

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
    player.addComponent(new RemoteComponent());
    player.add();

    Engine.tick(tick);
    Engine.render(render);
}

var tick = function() {
    _worldManager.tick();
}

var render = function() {
    _worldManager.render();
}


Engine.init();


})(global);
