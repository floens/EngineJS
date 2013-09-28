(function(global, undefined) {
'use strict';

global.RemoteClientSystem = function(url, packetHandlerFactoryFunction) {
    System.call(this);

    if (!Utils.isString(url)) throw new Error('First argument must be url to connect to.');

    this.connected = false;
    this.connection = null;
    this.netHandler = null;
    this.packetHandlerFactoryFunction = packetHandlerFactoryFunction;
    this.packetHandler = null;

    this.connect(url);
}
RemoteClientSystem.extend(System);
System.registerSystem(RemoteClientSystem, 5);

RemoteClientSystem.prototype.tick = function() {
    this.parent.tick.call(this);

    if (this.connected) {
        this.netHandler.tick();
        this.packetHandler.tick();
    }
}

RemoteClientSystem.prototype.connect = function(url) {
    if (!RemoteClientSystem.getWebSocketSupport()) {
        throw new Error('This browser does not support multiplayer.');
    }

    this.startConnection(url);
}

RemoteClientSystem.prototype.startConnection = function(url) {
    var connection = this.connection = new WebSocket(url);

    this.packetHandler = this.packetHandlerFactoryFunction();

    var self = this;
    connection.onopen = function(event) {
        self.connected = true;
        self.netHandler = new NetHandler(connection, self);
        self.packetHandler.setNetHandler(self.netHandler);

        self.packetHandler.onConnect();
    }

    connection.onmessage = function(event) {
        if (connection == null) return;

        var packet = self.netHandler.readConnection(event.data);

        if (packet != null) {
            self.packetHandler.handlePacket(packet);
        }
    }

    connection.onclose = function(event) {
        if (!self.connected) { // Close has been handled already, otherwise you may get a wrong/duplicate error
            return;
        }

        self.connected = false;
        self.netHandler.disconnect();
        self.netHandler = null;
        self.packetHandler.onDisconnect();
        self.packetHandler = null;
        self.connection = null;
        connection = null;

        log('Connection closed.');

        var text = '';
        switch (event.code) {
            case 1000: // CLOSE_NORMAL
                text = 'Connection closed.';
                break;
            case 1001: // CLOSE_GOING_AWAY
                text = 'Server closing.';
                break;
            case 1002: // CLOSE_PROTOCOL_ERROR
            case 1003: // CLOSE_UNSUPPORTED
            case 1004: // CLOSE_TOO_LARGE
            case 1005: // CLOSE_NO_STATUS
                text = 'Protocol error.';
                break;
            case 1006: // CLOSE_ABNORMAL
                text = 'Connection closed.';
                break;
            default:
                text = 'Internal connection error.';
                break;
        }
    }

    connection.onerror = function(event) {
        log('Connection error.');
        self.packetHandler.onError();
        self.packetHandler = null;
        self.connected = false;
        self.connection = null;
    }
}

RemoteClientSystem.prototype.getHandler = function() {
    // null or netHandler
    return this.netHandler;
}

// Static functions
RemoteClientSystem.getWebSocketSupport = function() {
    return global.WebSocket != undefined;
}



})(global);
