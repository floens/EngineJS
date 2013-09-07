(function(global, undefined) {
'use strict';

global.RemoteClientSystem = function(url) {
    System.call(this);

    this.addAspect(PositionComponent);
    this.addAspect(RemoteComponent);

    this.connected = false;
    this.connection = null;
    this.netHandler = null;

    // Holds the kick message if clients gets disconnected
    this.kickMessage = '';

    this.connect(url);
}
RemoteClientSystem.extend(System);
System.registerSystem(RemoteClientSystem, 5);

RemoteClientSystem.prototype.tick = function() {
    this.parent.tick.call(this);

    if (this.connected) {
        this.netHandler.tick();
    }

    for (var i = 0; i < this.entities.length; i++) {
        this.processEntity(this.entities[i]);
    }
}

RemoteClientSystem.prototype.processEntity = function(entity) {

}

RemoteClientSystem.prototype.handlePacket = function(packet) {
    log('Received a packet!');
    log(packet, true);
}

RemoteClientSystem.prototype.sendPacket = function(packet) {
    this.netHandler.writeConnection(packet);
}

RemoteClientSystem.prototype.connect = function(url) {
    if (!this.checkWebSocketSupport()) {
        UIManager.set(new UIBack('This browser doesn\'t support multiplayer.', function() {
            UIManager.set(null);
        }))
        return;
    }

    UIManager.set(new UIText('Connecting...'));

    this.startConnection(url);
}

RemoteClientSystem.prototype.startConnection = function(url) {
    var connection = this.connection = new WebSocket(url);

    var self = this;
    connection.onopen = function(event) {
        UIManager.set(new UIText('Connected.'));

        self.connected = true;
        self.netHandler = new NetHandler(connection, self);

        // TODO DEBUG
        self.sendPacket(new HandshakePacket('Message!'));
    }

    connection.onmessage = function(event) {
        if (connection == null) return;

        var packet = self.netHandler.readConnection(event.data);

        self.handlePacket(packet);
    }

    connection.onclose = function(event) {
        if (!self.connected) { // Close has been handled already, otherwise you may get a wrong/duplicate error
            return;
        }

        self.connected = false;
        self.netHandler.disconnect();
        self.netHandler = null;
        self.connection = null;
        connection = null;

        log('Connection closed.');

        var text = '';
        if (self.kickMessage.length > 0) {
            text = self.kickMessage;
        } else {
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

        UIManager.set(new UIBack(text, function() {
            UIManager.set(null);
        }));
    }

    connection.onerror = function(event) {
        log('Connection error.');

        UIManager.set(new UIBack('Connection error.', function() {
            UIManager.set(null);
        }));
    }
}

RemoteClientSystem.prototype.getHandler = function() {
    // null or netHandler
    return this.netHandler;
}

// TODO move to main
RemoteClientSystem.prototype.checkWebSocketSupport = function() {
    return global.WebSocket != undefined;
}

})(global);
