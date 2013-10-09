(function(global, undefined) {
'use strict';

require('../server/Setup.js');
require('../server/EngineServer.js');
require('../shared/Utils.js');
require('../shared/world/World.js');
require('../shared/entity/Entity.js');
require('../shared/component/Component.js');
require('../shared/component/PositionComponent.js');
require('../shared/component/RemoteComponent.js');
require('../shared/component/RemotePositionComponent.js');
require('../shared/system/System.js');
require('../shared/net/Packet.js');
require('../shared/net/DataStream.js');
require('../shared/net/Packets.js');
require('../shared/net/NetHandler.js');
require('../shared/net/PacketHandler.js');
require('../server/system/RemoteServerSystem.js');

require('./server/net/PacketHandlerServer.js');
require('./shared/net/Packets.js');
require('./shared/entity/EntityPointer.js');
require('./server/component/PacketHandlerComponent.js');
require('./server/system/TrackerSystem.js');

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


    global.world = _world;
})

Engine.tick(function() {
    _world.tick();
})



Engine.init();


})(global);
