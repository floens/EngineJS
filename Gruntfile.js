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
        'shared/system/System.js',
        'shared/system/MovementSystem.js',
        'shared/collision/Collidable.js',
        'shared/collision/AABB.js',
        'shared/collision/Circle.js',
        'shared/item/Item.js',
        'shared/net/Packet.js',
        'shared/net/DataStream.js',
        'shared/net/Packets.js',
        'client/input/Input.js',
        'client/gfx/AssetManager.js',
        'client/gfx/Screen.js',
        'client/gfx/Canvas.js',
        'client/system/RenderSystem.js',
        'client/system/InputSystem.js',
        'client/system/RemoteClientSystem.js',
        'client/component/RenderComponent.js',
        'client/component/ControllableComponent.js',
        'client/component/ImageRenderComponent.js',
        'client/component/BoxRenderComponent.js',
        'client/component/CircleRenderComponent.js',
        'client/component/RemoteClientComponent.js',
        'client/ui/UIManager.js',
        'client/ui/UIMain.js',
        'client/ui/UIMultiplayerSelect.js',
        'client/ui/UIBack.js',
        'client/ui/UIText.js',
        'client/ui/UILoad.js',
        'client/world/WorldManager.js',
        'client/net/NetHandlerClient.js"></',
        'client/Storage.js',
        'client/EngineClient.js'
    ];

    var serverFiles = [
        'server/MainServer.js'
    ];

    var clientScriptName = 'Engine';

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
        copy: {
            build: {
                files: {
                    'build/client/': ['res/**', 'css/**'],
                    'build/client/index.html': 'build_tools/client/index.html'
                }
            }
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
                    'build/client/Engine.js': 'build/tmp/clientConcat.js'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.registerTask('default', ['clean', 'copy', 'concat', 'uglify']);
};
