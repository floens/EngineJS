// Loads all files for the server into the global object and sets some things up

global.CLIENT = false;
global.SERVER = true;

require('../shared/Utils.js');

require('../shared/world/World.js');

require('../shared/entity/Entity.js');
require('../shared/entity/EntityPlayer.js');
require('../shared/entity/EntityBox.js');
require('../shared/entity/EntityCircle.js');

require('../shared/component/Component.js');
require('../shared/component/PositionComponent.js');
require('../shared/component/CollidableComponent.js');
require('../shared/component/CircleCollidableComponent.js');
require('../shared/component/RemoteComponent.js');

require('../shared/system/System.js');
require('../shared/system/MovementSystem.js');

require('../shared/collision/Collidable.js');
require('../shared/collision/AABB.js');
require('../shared/collision/Circle.js');

require('../shared/item/Item.js');

require('../shared/net/Packet.js');
require('../shared/net/DataStream.js');
require('../shared/net/Packets.js');
require('../shared/net/NetHandler.js');

require('../server/system/RemoteServerSystem.js');

require('../server/net/EntityTracker.js');
require('../server/net/EntityTrackerEntry.js');

