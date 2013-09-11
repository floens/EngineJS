module.exports = function(grunt) {
    var clientFiles = [
        'client/Setup.js',
        'shared/Utils.js',
        'shared/world/World.js',
        'shared/entity/Entity.js',
        'shared/entity/EntityPlayer.js',
        'shared/entity/EntityBox.js',
        'shared/entity/EntityCircle.js',
        'shared/component/Component.js',
        'shared/component/PositionComponent.js',
        'shared/component/CollidableComponent.js',
        'shared/component/CircleCollidableComponent.js',
        'shared/component/RemoteComponent.js',
        'shared/system/System.js',
        'shared/system/MovementSystem.js',
        'shared/collision/Collidable.js',
        'shared/collision/AABB.js',
        'shared/collision/Circle.js',
        'shared/item/Item.js',
        'shared/net/Packet.js',
        'shared/net/DataStream.js',
        'shared/net/Packets.js',
        'shared/net/NetHandler.js',
        'shared/net/PacketHandler.js',
        'client/input/Input.js',
        'client/gfx/AssetManager.js',
        'client/gfx/Screen.js',
        'client/gfx/Canvas.js',
        'client/system/RenderSystem.js',
        'client/system/InputSystem.js',
        'client/system/RemoteClientSystem.js',
        'client/net/PacketHandlerClient.js',
        'client/component/RenderComponent.js',
        'client/component/ControllableComponent.js',
        'client/component/ImageRenderComponent.js',
        'client/component/BoxRenderComponent.js',
        'client/component/CircleRenderComponent.js',
        'client/ui/UIManager.js',
        'client/ui/UI.js',
        'client/ui/UIButton.js',
        'client/ui/UIMain.js',
        'client/ui/UIBack.js',
        'client/ui/UIText.js',
        'client/ui/UILoad.js',
        'client/world/WorldManager.js',
        'client/Storage.js',
        'client/EngineClient.js'
    ];

    var serverFiles = [
        'server/Setup.js',
        'server/EngineServer.js',
        'shared/Utils.js',
        'shared/world/World.js',
        'shared/entity/Entity.js',
        'shared/entity/EntityPlayer.js',
        'shared/entity/EntityBox.js',
        'shared/entity/EntityCircle.js',
        'shared/component/Component.js',
        'shared/component/PositionComponent.js',
        'shared/component/CollidableComponent.js',
        'shared/component/CircleCollidableComponent.js',
        'shared/component/RemoteComponent.js',
        'shared/system/System.js',
        'shared/system/MovementSystem.js',
        'shared/collision/Collidable.js',
        'shared/collision/AABB.js',
        'shared/collision/Circle.js',
        'shared/item/Item.js',
        'shared/net/Packet.js',
        'shared/net/DataStream.js',
        'shared/net/Packets.js',
        'shared/net/NetHandler.js',
        'shared/net/PacketHandler.js',

        'server/system/RemoteServerSystem.js',
        'server/net/EntityTracker.js',
        'server/net/EntityTrackerEntry.js'
    ];

    var packageJson = grunt.file.readJSON('package.json');

    var buildVersion = packageJson.version;

    var banner = '/* ' + new Date().getFullYear() + ' - build ' + buildVersion + ' */\n';

    grunt.log.write('Building version ' + buildVersion + '.');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            build: [
                'build/'
            ]
        },
        concat: {
            build: {
                files: {
                    'build/tmp/clientConcat.js': clientFiles,
                    'build/tmp/serverConcat.js': serverFiles
                }
            }
        },
        uglify: {
            options: {
                banner: banner
            },
            build: {
                files: {
                    'build/client/Engine.js': 'build/tmp/clientConcat.js',
                    'build/server/Engine.js': 'build/tmp/serverConcat.js'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.registerTask('default', ['clean', 'concat', 'uglify']);
};
