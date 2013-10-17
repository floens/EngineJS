module.exports = function(grunt) {
    var clientFiles = [
        'client/Setup.js',
        'shared/Utils.js',
        'shared/world/World.js',
        'shared/entity/Entity.js',
        'shared/component/Component.js',
        'shared/component/PositionComponent.js',
        'shared/component/RemoteComponent.js',
        'shared/system/System.js',
        'shared/net/Packet.js',
        'shared/net/DataStream.js',
        'shared/net/Packets.js',
        'shared/net/NetHandler.js',
        'shared/net/PacketHandler.js',
        'client/input/Input.js',
        'client/gfx/AssetManager.js',
        'client/gfx/Screen.js',
        'client/gfx/Canvas.js',
        'client/gfx/GLCanvas.js',
        'client/gfx/GLRenderer.js',
        'client/system/RemoteClientSystem.js',
        'client/net/PacketHandlerClient.js',
        'client/ui/UIManager.js',
        'client/ui/UI.js',
        'client/ui/UIButton.js',
        'client/ui/UIMain.js',
        'client/ui/UIBack.js',
        'client/ui/UIText.js',
        'client/ui/UIAssetLoad.js',
        'client/Storage.js',
        'client/EngineClient.js'
    ];

    var serverFiles = [
        'server/Setup.js',
        'shared/Utils.js',
        'shared/world/World.js',
        'shared/entity/Entity.js',
        'shared/component/Component.js',
        'shared/component/PositionComponent.js',
        'shared/component/RemoteComponent.js',
        'shared/system/System.js',
        'shared/net/Packet.js',
        'shared/net/DataStream.js',
        'shared/net/Packets.js',
        'shared/net/NetHandler.js',
        'shared/net/PacketHandler.js',
        'server/component/PacketHandlerComponent.js',
        'server/system/RemoteServerSystem.js',
        'server/system/TrackerSystem.js',
        'server/EngineServer.js'
    ];

    var packageJson = grunt.file.readJSON('package.json');

    var buildVersion = packageJson.version;

    var banner = 
        '/* ' + new Date().getFullYear() + ' - build ' + buildVersion + ' */\n';

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
            },
            license: {
                files: {
                    'build/EngineClient.js': ['client/lib/gl-matrix-license.txt', 'build/EngineClient.js']
                }
            }
        },
        uglify: {
            options: {
                banner: banner
            },
            build: {
                files: {
                    'build/EngineClient.js': 'build/tmp/clientConcat.js',
                    'build/EngineServer.js': 'build/tmp/serverConcat.js'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.registerTask('default', ['clean', 'concat:build', 'uglify', 'concat:license']);
};
