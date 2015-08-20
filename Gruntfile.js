module.exports = function (grunt) {

    // Configure Grunt
    grunt.initConfig({

        connect: {
            server: {
                options: {
                    port: 9001,
                    keepalive: true
                }
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-connect');
};