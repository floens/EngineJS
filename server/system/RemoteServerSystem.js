(function(global, undefined) {
'use strict';

global.RemoteServerSystem = function(port, maxConnections, packetHandlerFactoryFunction) {
    System.call(this);

    if (!Utils.isNumber(port)) throw new Error('First argument must be the port to listen on.');
    if (!Utils.isNumber(maxConnections)) throw new Error('Second argument must be max connections.');

    this.port = port;
    this.maxConnections = maxConnections;
    this.packetHandlerFactoryFunction = packetHandlerFactoryFunction;

    this.connections = [];

    this.startHTTPServer();
}
RemoteServerSystem.extend(System);
System.registerSystem(RemoteServerSystem, 6);

RemoteServerSystem.prototype.tick = function() {
    this.parent.tick.call(this);

    for (var i = 0; i < this.connections.length; i++) {
        var connection = this.connections[i];
        connection.netHandler.tick();
        connection.packetHandler.tick();
    }
}

RemoteServerSystem.prototype.startServer = function(httpServer) {
    var WebSocketServer = require('websocket').server;

    var server = new WebSocketServer({
        httpServer: httpServer
    })

    var self = this;
    server.on('request', function(req) {
        /*if (req.origin != 'http://localhost') {
            log('Kicked a client for not being in the list of allowed origins: ' + req.origin);
            req.reject();
        }*/

        // Connected
        var connection = req.accept(null, req.origin);

        connection.netHandler = new NetHandler(connection);
        connection.packetHandler = self.packetHandlerFactoryFunction();
        connection.packetHandler.setNetHandler(connection.netHandler);

        if (self.connections.length >= self.maxConnections) {
            connection.netHandler.disconnect('Server full');
            log('Peer ' + connection.remoteAddress + ' was kicked because the server is full.');
            return;
        }

        self.connections.push(connection);
        log('Peer connected [' + connection.remoteAddress + ']');

        connection.on('message', function(message) {
            if (message.type === 'utf8') {
                var packet = connection.netHandler.readConnection(message.utf8Data);

                if (packet != null) {
                    connection.packetHandler.handlePacket(packet);
                }
            }
        })

        connection.on('close', function(reasonCode, description) {
            log('Peer disconnected [' + connection.remoteAddress + ']');

            connection.packetHandler.onDisconnect();
            connection.netHandler.disconnect();
            self.connections.remove(connection);
        })

        connection.packetHandler.onConnect();
    })
}

RemoteServerSystem.prototype.startHTTPServer = function() {
    var http = require('http');

    var httpServer = http.createServer(function(req, res) {
        res.writeHead(400);
        res.end();
    })

    httpServer.listen(this.port);

    this.startServer(httpServer);
}


})(global);
