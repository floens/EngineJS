(function(global, undefined) {
'use strict';

Engine.setOptions({
    containerElement: 'container'
})

var _world;
var _packetHandler;

Engine.load(function() {
    _world = new World();

    _world.addSystem(new RenderSystem());

    var remoteSystem = new RemoteClientSystem('ws://192.168.6.151:8080', function() {
        _packetHandler = new PacketHandlerClient();
        _packetHandler.setWorld(_world);
        return _packetHandler;
    });

    _world.addSystem(remoteSystem);

    UIManager.set(new UILoad('Connecting'));
})

var _lx = 0;
var _ly = 0;

Engine.tick(function() {
    _world.tick();

    var mouse = Input.getMousePosition();
    var x = mouse[0] / Screen.width;
    var y = mouse[1] / Screen.height;

    if (x != _lx || y != _ly) {
        _lx = x;
        _ly = y;

        var packet = new PointerPositionPacket();
        packet.setInfo(-1, x, y);

        _packetHandler.sendPacket(packet);
    }
})

Engine.render(function() {
    _world.render();
})







Engine.init();


})(global);
