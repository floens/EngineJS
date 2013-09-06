(function(global, undefined) {
'use strict';

global.EntityTrackerEntry = function(entity) {
    this.entity = entity;
    this.data = {};

    this.setEntity(entity);

    // To keep track which players it has been added/removed to
    // keys are id's, and values are booleans to indicate if out of range
    this.trackedPlayersIds = {}
    this.trackedPlayers = [];
}

EntityTrackerEntry.prototype.setEntity = function() {
    if (this.entity instanceof EntityMob) {
        this.data.x = _round(this.entity.x);
        this.data.y = _round(this.entity.y);
        this.data.xa = _round(this.entity.xa);
        this.data.ya = _round(this.entity.ya);

        this.data.health = this.entity.health;
    }

    if (this.entity instanceof EntityPlayer) {
        this.data.score = this.entity.score;
        this.data.team = this.entity.team;
        this.data.weapon = -1;
    }
}

EntityTrackerEntry.prototype.onRemove = function() {
    for (var i = 0; i < this.trackedPlayers.length; i++) {
        this.sendRemoveEntity(this.trackedPlayers[i]);

        if (this.entity instanceof EntityPlayer) {
            this.sendRemoveScore(this.trackedPlayers[i]);
        }
    }
}

// Update self position etc. to all tracked players
EntityTrackerEntry.prototype.updateToPlayers = function() {
    // Update position to tracked players
    if (this.entity instanceof EntityMob) {
        if (this.data.x != _round(this.entity.x) || 
            this.data.y != _round(this.entity.y) || 
            this.data.xa != _round(this.entity.xa) || 
            this.data.ya != _round(this.entity.ya)
        ) {
            for (var i = 0; i < this.trackedPlayers.length; i++) {
                if (this.trackedPlayers[i].id == this.entity.id) continue;
                this.sendPosition(this.trackedPlayers[i]);
            }

            this.data.x = _round(this.entity.x);
            this.data.y = _round(this.entity.y);
            this.data.xa = _round(this.entity.xa);
            this.data.ya = _round(this.entity.ya);
        }

        if (this.data.health != this.entity.health) {
            for (var i = 0; i < this.trackedPlayers.length; i++) {
                this.sendHealth(this.trackedPlayers[i]);
            }

            this.data.health = this.entity.health;
        }

        if (this.entity.damageAmount != null && this.entity.damageDirection != null && this.entity.damageKnockback != null) {
            if (this.entity instanceof EntityPlayer) {
                var knockbackX = Math.sin(this.entity.damageDirection) * this.entity.damageKnockback,
                    knockbackY = Math.cos(this.entity.damageDirection) * this.entity.damageKnockback - this.entity.damageKnockback * 0.1;

                this.sendPositionAdd(this.entity, 0, 0, knockbackX, knockbackY);
            }

            for (var i = 0; i < this.trackedPlayers.length; i++) {
                this.sendDealDamage(this.trackedPlayers[i]);
            }

            this.entity.damageAmount = null;
            this.entity.damageDirection = null;
            this.entity.damageKnockback = null;
        }
    }

    if (this.entity instanceof EntityPlayer) {
        if (this.entity.score != this.data.score || this.entity.team != this.data.team) {
            for (var i = 0; i < this.trackedPlayers.length; i++) {
                this.sendScore(this.trackedPlayers[i]);
            }
            this.data.score = this.entity.score;
        }

        if (this.entity.team != this.data.team) {
            for (var i = 0; i < this.trackedPlayers.length; i++) {
                this.sendTeam(this.trackedPlayers[i]);
            }
            this.data.team = this.entity.team;
        }

        if ((this.entity.weapon == null ? -1 : this.entity.weapon.remoteType) != this.data.weapon) {
            for (var i = 0; i < this.trackedPlayers.length; i++) {
                if (this.trackedPlayers[i].id == this.entity.id) continue;
                this.sendChangeWeapon(this.trackedPlayers[i]);
            }

            this.data.weapon = this.entity.weapon == null ? -1 : this.entity.weapon.remoteType;
        }
    }
}

EntityTrackerEntry.prototype.sendChangeWeapon = function(player) {
    player.netHandler.sendMessage(Protocol.encode(Protocol.CHANGE_WEAPON, {
        id: this.entity.id,
        weaponId: this.entity.weapon == null ? -1 : this.entity.weapon.remoteType
    }))
}

EntityTrackerEntry.prototype.sendScore = function(player) {
    player.netHandler.sendMessage(Protocol.encode(Protocol.PLAYER_SCORE, {
        id: this.entity.id,
        score: this.entity.score,
        name: this.entity.name,
        team: this.entity.team
    }))
}

EntityTrackerEntry.prototype.sendRemoveScore = function(player) {
    player.netHandler.sendMessage(Protocol.encode(Protocol.PLAYER_SCORE, {
        id: this.entity.id,
        score: -1,
        name: '',
        team: -1
    }))
}

EntityTrackerEntry.prototype.sendTeam = function(player) {
    player.netHandler.sendMessage(Protocol.encode(Protocol.SET_TEAM, {
        id: this.entity.id == player.id ? -1 : this.entity.id,
        team: this.entity.team
    }))
}

EntityTrackerEntry.prototype.sendDealDamage = function(player) {
    player.netHandler.sendMessage(Protocol.encode(Protocol.DEAL_DAMAGE, {
        id: this.entity.id == player.id ? -1 : this.entity.id,
        amount: this.entity.damageAmount,
        direction: _round(this.entity.damageDirection),
        knockback: _round(this.entity.damageKnockback)
    }))
}

EntityTrackerEntry.prototype.sendPosition = function(player) {
    player.netHandler.sendMessage(Protocol.encode(Protocol.ENTITY_POSITION, {
        id: this.entity.id == player.id ? -1 : this.entity.id,
        x: _round(this.entity.x),
        y: _round(this.entity.y),
        xa: _round(this.entity.xa),
        ya: _round(this.entity.ya)
    }))
}

EntityTrackerEntry.prototype.sendPositionAdd = function(player, x, y, xa, ya) {
    player.netHandler.sendMessage(Protocol.encode(Protocol.ADD_POSITION, {
        id: this.entity.id == player.id ? -1 : this.entity.id,
        x: _round(x),
        y: _round(y),
        xa: _round(xa),
        ya: _round(ya)
    }))
}

EntityTrackerEntry.prototype.sendHealth = function(player) {
    player.netHandler.sendMessage(Protocol.encode(Protocol.SET_HEALTH, {
        id: this.entity.id == player.id ? -1 : this.entity.id,
        amount: _round(this.entity.health)
    }))
}

EntityTrackerEntry.prototype.sendAddEntity = function(player) {
    if (this.entity instanceof EntityPlayer) {
        player.netHandler.sendMessage(Protocol.encode(Protocol.ADD_PLAYER, {
            id: this.entity.id,
            name: this.entity.name,
            x: _round(this.entity.x),
            y: _round(this.entity.y)
        }))
    } else if (this.entity instanceof EntityProjectile) {
        player.netHandler.sendMessage(Protocol.encode(Protocol.ADD_PROJECTILE, {
            id: this.entity.id,
            typeId: this.entity.remoteType,
            x: _round(this.entity.x),
            y: _round(this.entity.y),
            direction: this.entity.direction
        }))
    } else {
        player.netHandler.sendMessage(Protocol.encode(Protocol.ADD_ENTITY, {
            id: this.entity.id,
            typeId: this.entity.remoteType,
            x: _round(this.entity.x),
            y: _round(this.entity.y)
        }));
    }

    if (this.entity instanceof EntityMob) {
        this.sendHealth(player);
    }

    if (this.entity instanceof EntityPlayer) {
        this.sendScore(player);
        this.sendTeam(player);
        this.sendChangeWeapon(player);
    }
}

EntityTrackerEntry.prototype.sendRemoveEntity = function(player) {
    player.netHandler.sendMessage(Protocol.encode(Protocol.REMOVE_ENTITY, {
        id: this.entity.id
    }));
}

// Update which players to track
EntityTrackerEntry.prototype.updatePlayers = function(playerList) {
    // Disabled in-range checking for easy score tracking
    /*var playerList = [];
    for (var i = 0; i < playerListRaw.length; i++) {
        if (_distance(this.entity.x, this.entity.y, playerListRaw[i].x, playerListRaw[i].y) < this.viewDistance) {
            playerList.push(playerListRaw[i]);
        }
    }*/

    for (var i in this.trackedPlayersIds) {
        this.trackedPlayersIds[i] = false;
    }

    for (var i = 0; i < playerList.length; i++) {
        var player = playerList[i];
        if (this.trackedPlayersIds[player.id] == undefined) {
            this.startTrackingPlayer(player);
        } else {
            this.trackedPlayersIds[player.id] = true;
        }
    }

    for (var i in this.trackedPlayersIds) {
        if (!this.trackedPlayersIds[i]) {
            this.stopTrackingPlayer(i);
        }
    }
}

EntityTrackerEntry.prototype.startTrackingPlayer = function(player) {
    this.trackedPlayers.push(player);
    this.trackedPlayersIds[player.id] = true;

    if (this.entity.id != player.id) this.sendAddEntity(player);
}

EntityTrackerEntry.prototype.stopTrackingPlayer = function(id) {
    var player = null;

    for (var i = 0; i < this.trackedPlayers.length; i++) {
        if (this.trackedPlayers[i].id == id) {
            player = this.trackedPlayers[i];
            break;
        }
    }

    if (player == null) {
        log('EntityTrackerEntry: Player to stop tracking not found.');
        return;
    }

    this.trackedPlayers.remove(player);
    delete this.trackedPlayersIds[player.id];

    this.sendRemoveEntity(player);
}

var _distance = function(x1, y1, x2, y2) {
    var dx = x2 - x1,
        dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
}

var _round = function(e) {
    return Math.floor(e * 100) / 100;
}

})(global);
