(function(global, undefined) {
'use strict';

// require('./build/server/Engine.js');

// For debugging
require('../server/Setup.js');
require('../server/EngineServer.js');
require('../shared/Utils.js');
require('../shared/world/World.js');
require('../shared/entity/Entity.js');
require('../shared/component/Component.js');
require('../shared/component/PositionComponent.js');
require('../shared/system/System.js');
require('../shared/net/Packet.js');
require('../shared/net/DataStream.js');
require('../shared/net/Packets.js');
require('../shared/net/NetHandler.js');
require('../shared/net/PacketHandler.js');
require('../server/system/RemoteServerSystem.js');


require('./entity/EntityPlayer.js');
require('./entity/EntityBox.js');
require('./entity/EntityCircle.js');
require('./component/CollidableComponent.js');
require('./component/CircleCollidableComponent.js');
require('./system/MovementSystem.js');
require('./collision/Collidable.js');
require('./collision/AABB.js');
require('./collision/Circle.js');
require('./net/EntityTracker.js');
require('./net/EntityTrackerEntry.js');
require('./net/PacketHandlerServer.js');

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

    var remoteSystem = new RemoteServerSystem(8080, 32, function() {
        var packetHandler = new PacketHandlerServer();
        packetHandler.setWorld(world);
        return packetHandler;
    });

    world.addSystem(remoteSystem);

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

Engine.init();

require('repl').start('>');


})(global);
