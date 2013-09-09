module.exports = function(grunt) {
    var clientFiles = [
        'todo'
    ];

    var serverFiles = [
        'todo'
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

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.registerTask('default', ['clean', 'concat', 'uglify']);
};
