/*****
* Dedictated server
* 
* Module "websocket" needs to be installed, install using "npm install websocket".
*
* Required folders are the "shared" and "server" folders
* Start by executing "node Server.js -port <port_number>"
*/

/** @const */ global.CLIENT = false;
/** @const */ global.SERVER = true;

require('../shared/Utils.js');
require('../shared/map/Map.js');
require('../shared/map/MapGenerator.js');
require('../shared/map/Tile.js');
require('../shared/map/TileWater.js');
require('../shared/entity/Entity.js');
require('../shared/entity/EntityMob.js');
require('../shared/entity/EntityEnemy.js');
require('../shared/entity/EntityPlayer.js');
require('../shared/entity/EntityProjectile.js');
require('../shared/entity/EntityBullet.js');
require('../shared/entity/EntityArrow.js');
require('../shared/item/Item.js');
require('../shared/item/ItemPistol.js');
require('../shared/item/ItemTile.js');
require('../shared/item/ItemSword.js');
require('../shared/item/ItemBow.js');
require('../shared/net/Protocol.js');

require('../server/net/NetManagerServer.js');
require('../server/net/NetHandlerServer.js');
require('../server/net/ClientHandler.js');
require('../server/net/EntityTracker.js');
require('../server/net/EntityTrackerEntry.js');
require('../server/map/MapLoader.js');
require('../server/TeamManager.js');

var list = process.argv;
for (var i = 0; i < list.length; i++) {
    var j = list[i];
    if (j == '--port' || j == '-p') {
        var port = parseInt(list[i + 1]);
        i++;
    }
}

if (port == undefined || Number.isNaN(port)) {
    log('Please specify a port to run on with --port.', log.ERROR);
    return;
}

/**********
* Start
*/
log('Starting dedictated server on port ' + port + '.');

global.Main = {
    protocolVersion: 26,
    maxPlayers: 32,
    map: null,
    paused: true
}

Main.pause = function() {
    Main.paused = true;
}

Main.unpause = function() {
    Main.paused = false;
    // Start the tick loop again
    _tickLastTime = Date.now();
    _tickLoop();
}

NetManager.start(port);

if (MapLoader.exists('map1')) {
    var map = MapLoader.load('map1');
    log('Loaded map1.');
} else {
    var map = new Map(200, 100);
    map.generate();
}

map.isRemote = false;
map.entityTracker = new EntityTracker(map);
Main.map = map;

global.save = function(e) {
    MapLoader.save(e, Main.map);
}

global.spawnEnemy = function() {
    var e = new EntityEnemy(map);
    e.setPosition(10, 10);
}

// spawnEnemy();

function doTick() {
    try {
        TeamManager.tick();
        map.tick();
        NetManager.tick();
    } catch(e) {
        log('Internal error: ', log.ERROR);
        log(e.stack);
    }
}

var _tickUnprocessed = 0,
    _tickLastTime = Date.now();
var _tickLoop = function() {
    _tickUnprocessed += (Date.now() - _tickLastTime) / (1000 / 60);

    if (_tickUnprocessed > 25) {
        log('Can\'t keep up!');
    }
    // After sleep etc.
    if (_tickUnprocessed > 1000) _tickUnprocessed = 0;

    while (_tickUnprocessed >= 1) {
        _tickUnprocessed -= 1;
        doTick();
    }

    _tickLastTime = Date.now();

    if (!Main.paused) {
        setTimeout(_tickLoop, 1000 / 60);
    }
}
_tickLoop();

require('repl').start('> ');

// TODO: remove
process.on('uncaughtException', function(err) {
    log('**** UncaughtException ****', log.ERROR);
    log(err.stack, true);
})
