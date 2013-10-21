(function(global) {
'use strict';

require('../server/Setup.js');
require('../server/EngineServer.js');
require('../shared/Utils.js');
require('../shared/world/World.js');
require('../shared/entity/Entity.js');
require('../shared/component/Component.js');
require('../shared/component/PositionComponent.js');
require('../shared/component/RemoteComponent.js');
require('../shared/component/PacketHandlerComponent.js');
require('../shared/system/System.js');
require('../shared/net/Packet.js');
require('../shared/net/DataStream.js');
require('../shared/net/Packets.js');
require('../shared/net/NetHandler.js');
require('../shared/net/PacketHandler.js');
require('../server/system/RemoteServerSystem.js');
require('../server/system/TrackerSystem.js');

require('./server/net/PacketHandlerServer.js');
require('./shared/net/Packets.js');
require('./shared/component/PlayerPositionComponent.js');
require('./shared/component/BlockChangeComponent.js');
require('./shared/system/MovementSystem.js');
require('./shared/system/VoxelWorld.js');
require('./shared/entity/EntityPlayer.js');
require('./shared/block/Block.js');
require('./shared/AABB.js');

var _world;

Engine.load(function() {
    _world = new World();

    var remoteSystem = new RemoteServerSystem(8080, 32, function() {
        var packetHandler = new PacketHandlerServer();
        packetHandler.setWorld(_world);
        return packetHandler;
    });

    _world.addSystem(remoteSystem);

    _world.addSystem(new TrackerSystem());

    var voxelWorld = new VoxelWorld(64, 64, 64);
    voxelWorld.generate();

    _world.addSystem(voxelWorld);
    _world.addSystem(new MovementSystem(voxelWorld));
    
    log('Started server on localhost:8080');
})

Engine.tick(function() {
    _world.tick();
})



Engine.init();


})(global);
