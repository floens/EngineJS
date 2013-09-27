(function(global, undefined) {
'use strict';

// require('./build/server/Engine.js');

// For debugging
require('../server/Setup.js');
require('../server/EngineServer.js');
require('../shared/Utils.js');
require('../shared/world/World.js');
require('../shared/entity/Entity.js');
require('../shared/entity/EntityPlayer.js');
require('../shared/entity/EntityBox.js');
require('../shared/entity/EntityCircle.js');
require('../shared/component/Component.js');
require('../shared/component/PositionComponent.js');
require('../shared/component/CollidableComponent.js');
require('../shared/component/CircleCollidableComponent.js');
require('../shared/component/RemoteComponent.js');
require('../shared/system/System.js');
require('../shared/system/MovementSystem.js');
require('../shared/collision/Collidable.js');
require('../shared/collision/AABB.js');
require('../shared/collision/Circle.js');
require('../shared/item/Item.js');
require('../shared/net/Packet.js');
require('../shared/net/DataStream.js');
require('../shared/net/Packets.js');
require('../shared/net/NetHandler.js');
require('../shared/net/PacketHandler.js');
require('../server/system/RemoteServerSystem.js');
require('../server/net/EntityTracker.js');
require('../server/net/EntityTrackerEntry.js');

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

global.sendPacket = function() {
    var remoteSystem = _world.getSystem(RemoteServerSystem);

    if (remoteSystem.connections.length > 0) {
        var packet = new CreateEntityPacket();
        packet.setEntity(_entity);

        remoteSystem.connections[0].netHandler.writeConnection(packet);
    }
}


Engine.init();

require('repl').start('>');


})(global);
