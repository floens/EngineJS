(function(global, undefined) {
'use strict';

global.RemoteClientSystem = function(url) {
    System.call(this);

    this.tickSystem = true;
    this.addAspect(PositionComponent);
    this.addAspect(RemoteClientComponent);

    this.connected = false;
    this.connection = null;

    // Holds the kick message if clients gets disconnected
    this.kickMessage = '';

    this.connect(url);
}
RemoteClientSystem.extend(System);
System.registerSystem(RemoteClientSystem, 5);

RemoteClientSystem.prototype.tick = function() {
    this.parent.tick.call(this);

    for (var i = 0; i < this.entities.length; i++) {
        this.processEntity(this.entities[i]);
    }
}

RemoteClientSystem.prototype.processEntity = function(entity) {

}

RemoteClientSystem.prototype.sendHandshake = function() {
    this.sendPacket(new HandshakePacket('Message!'));
}

RemoteClientSystem.prototype.handlePacket = function(packet) {
    log('Received a packet!');
    log(packet, true);
}


RemoteClientSystem.prototype.sendPacket = function(packet) {
    try {
        this.connection.netHandler.writeConnection(Packet.writeStream(packet));
    } catch(err) {
        log(err, true);
    }
}

RemoteClientSystem.prototype.connect = function(url) {
    if (!this.checkWebSocketSupport()) {
        GuiManager.set(new GuiBack('This browser doesn\'t support multiplayer.', function() {
            GuiManager.set(null);
        }))
        return;
    }

    GuiManager.set(new GuiText('Connecting...'));

    this.startConnection(url);
}

RemoteClientSystem.prototype.startConnection = function(url) {
    var connection = this.connection = new WebSocket(url);
    this.connection.netHandler = null;

    var self = this;
    connection.onopen = function(event) {
        GuiManager.set(new GuiText('Connected.'));

        self.connected = true;
        connection.netHandler = new NetHandler(connection, self);

        self.sendHandshake();
    }

    connection.onmessage = function(event) {
        if (connection == null) return;

        var packet = connection.netHandler.onMessage(event.data);

        self.handlePacket(packet);
    }

    connection.onclose = function(event) {
        if (!self.connected) { // Close has been handled already, otherwise you may get a wrong/duplicate error
            return;
        }

        self.connected = false;

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
                    if (connection.netHandler != null) {
                        text = 'Connection closed.';
                    } else {
                        text = 'Could not connect.';
                    }
                    break;
                default:
                    text = 'Internal connection error.';
                    break;
            }
        }

        connection = null;

        GuiManager.set(new GuiBack(text, function() {
            GuiManager.set(null);
        }));
    }

    connection.onerror = function(event) {
        log('Connection error.');

        GuiManager.set(new GuiBack('Connection error.', function() {
            GuiManager.set(null);
        }));
    }
}

RemoteClientSystem.prototype.onKick = function(e) {
    log('Kicked: ' + e);
    this.kickMessage = e;
}

RemoteClientSystem.prototype.getHandler = function() {
    if (this.connection == null) return null;
    // null or netHandler
    return this.connection.netHandler;
}

// TODO move to main
RemoteClientSystem.prototype.checkWebSocketSupport = function() {
    return global.WebSocket != undefined;
}

})(global);
