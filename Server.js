(function(global, undefined) {
'use strict';

require('./build/server/Engine.js');

Engine.load(function() {
    log('Loaded!');

    start();
})

var _world = null;
var _entity = null;

var start = function() {
    var world = new World();
    world.setRemote(false);
    world.addSystem(new MovementSystem());
    world.addSystem(new RemoteServerSystem(8080, 32));

    // Debug
    _world = world;
    global.world = world;

    _entity = new EntityPlayer(world);
    _entity.add();

    Engine.tick(tick);
}

var tick = function() {
    world.tick();
}

global._sendPacket = function() {
    var remoteSystem = _world.getSystem(RemoteServerSystem);

    if (remoteSystem.connections.length > 0) {
        remoteSystem.connections[0].netHandler.writeConnection(new CreateEntityPacket(_entity));
    }
}


Engine.init();

require('repl').start('>');


})(global);
