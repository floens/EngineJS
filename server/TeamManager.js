(function(global, undefined) {
'use strict';

var _playerList = [];

var _teamA = [],
    _teamB = [];

var _playing = false;

global.TeamManager = {};
TeamManager.addPlayer = function(e) {
    _playerList.push(e);

    if (_teamA.length > _teamB.length) {
        _teamB.push(e);
        e.team = 1;
    } else if (_teamB.length > _teamA.length) {
        _teamA.push(e);
        e.team = 0;
    } else {
        var team = Random.int(2);
        if (team == 0) {
            _teamA.push(e);
            e.team = 0;
        } else {
            _teamB.push(e);
            e.team = 1;
        }
    }
}

TeamManager.removePlayer = function(e) {
    if (!_playerList.remove(e)) {
        log('TeamManager: entity to remove not found.');
    }

    _teamA.remove(e);
    _teamB.remove(e);
}

TeamManager.tick = function() {
    if (_teamA.length > _teamB.length + 1) {
        this.moveRandomToTeam(_teamA, _teamB, 1);
    } else if (_teamB.length > _teamA.length + 1) {
        this.moveRandomToTeam(_teamB, _teamA, 0);
    }

    for (var i = 0; i < _playerList.length; i++) {
        var player = _playerList[i];
        player.score = player.kills;
    }
}

TeamManager.getSpawn = function(team, map) {
    if (team == 0) {
        return [5, Math.floor(map.height * 0.4)];
    } else {
        return [map.width - 5, Math.floor(map.height * 0.4)];
    }
}

TeamManager.moveRandomToTeam = function(a, b, number) {
    // Get random player from a
    var player = a.splice(Random.int(a.length), 1)[0];
    
    b.push(player);
    player.team = number;
    player.remoteTeam = number;

    var message = player.name + ' has been moved to team ' + (number == 0 ? 'blue' : 'red') + ' for balance.'
    NetManager.broadcastChat(message);
    log(message);
}

TeamManager.sendChatTo = function(player, message) {
    player.netHandler.sendMessage(Protocol.encode(Protocol.SEND_CHAT, {
        message: message
    }));
}

})(global);
