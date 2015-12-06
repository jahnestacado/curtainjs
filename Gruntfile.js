module.exports = function (grunt) {
    grunt.initConfig({
        uglify: {
            my_target: {
                files: {
                    "js/jquery.curtain.min.js": "js/jquery.curtain.js"
                }
            }
        },
        cssmin: {
            target: {
                files: {
                    "css/jquery.curtain.min.css": "css/jquery.curtain.css"
                }
            }
        }
    });

    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-cssmin");
    grunt.registerTask("minify", ["uglify", "cssmin"]);
};
