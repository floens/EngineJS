(function(global, undefined) {
'use strict';

require('./server/EngineServer.js');

Engine.setOptions({
    port: 8080,
    maxConnections: 32
})

Engine.load(function() {
    log('Loaded!');

    start();
})


var _world;

var start = function() {
    var world = new World();
    world.setRemote(false);
    world.addSystem(new MovementSystem());

    // Debug
    global.world = world;

    Engine.tick(tick);
}

var tick = function() {
    world.tick();
}


// TODO
Engine.init();

require('repl').start('>');


})(global);
