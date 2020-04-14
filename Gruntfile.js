module.exports = function(grunt) {
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        strip_code: {
            options: {
                blocks: [
                    {
                        start_block: "/* start-test-block */",
                        end_block: "/* end-test-block */"
                    }
                ]
            },
            your_target: {
                files: [
                    {src: 'src/proxima.js', dest: 'proxima.js'}
                ]
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
            },
            my_target: {
                files: {
                    'proxima.min.js': ['proxima.js']
                }
            }
        }
    })

    grunt.loadNpmTasks('grunt-strip-code')
    grunt.loadNpmTasks('grunt-contrib-uglify')

    // Default task(s).
    grunt.registerTask('default', ['strip_code', 'uglify'])

}