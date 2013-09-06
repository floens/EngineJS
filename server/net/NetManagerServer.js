(function(global, undefined) {
'use strict';

var WebSocketServer = require('websocket').server,
    http = require('http');

var _maxConnections = -1,
    _connections = [];

global.NetManager = {};
NetManager.start = function(port, maxConnections) {
    var httpServer = http.createServer(function(req, res) {
        res.writeHead(400);
        res.end();
    })

    httpServer.listen(port);
    _maxConnections = maxConnections;

    this.startServer(httpServer);
}

NetManager.startServer = function(httpServer) {
    var server = new WebSocketServer({
        httpServer: httpServer
    })

    server.on('request', function(req) {
        /*if (req.origin != 'http://localhost' && req.origin != 'http://floens.org' && req.origin != 'http://direct.floens.org') {
            log('Kick a client for not being in the list of allowed origins: ' + req.origin);
            req.reject();
        }*/

        // Connected
        var connection = req.accept(null, req.origin);

        connection.netHandler = new NetHandler(connection);

        if (_connections.length >= _maxConnections) {
            connection.netHandler.disconnect('Server full!');
            log('Peer ' + connection.remoteAddress + ' was kicked because the server is full.');
            return;
        }

        _connections.push(connection);

        connection.on('message', function(message) {
            if (message.type === 'utf8') {
                var packet = connection.netHandler.onMessage(message.utf8Data);
                log(packet, true);
            }
        })

        connection.on('close', function(reasonCode, description) {
            log('Peer disconnected [' + connection.remoteAddress + ']');

            _connections.remove(connection);
        })
    })
}

NetManager.tick = function() {
    var list = _connections;
    for (var i = 0; i < list.length; i++) {
        try {
            list[i].netHandler.tick();
        } catch(err) {
            log('NetHandler error: ', log.ERROR);
            log(err);
        }
    }
}

NetManager.getTotalOutBytes = function() {
    var amount = 0;
    var list = _connections;
    for (var i = 0; i < list.length; i++) {
        amount += list[i].netHandler.bytesOut;
    }
    return amount;
}

// If a handler is given, broadcast to all handlers except the handler
NetManager.broadcastMessage = function(message, handler) {
    var list = _connections;
    for (var i = 0; i < list.length; i++) {
        if (handler != null && list[i].netHandler == handler) continue;
        list[i].netHandler.sendMessage(message);
    }
}

NetManager.broadcastChat = function(value) {
    NetManager.broadcastMessage(Protocol.encode(Protocol.SEND_CHAT, {
        message: value
    }), null);
}

})(global);
