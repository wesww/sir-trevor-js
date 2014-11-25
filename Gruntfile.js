/*global module:false*/
module.exports = function(grunt) {

  var banner = ['/*!',
                 ' * Sir Trevor JS v<%= pkg.version %>',
                 ' *',
                 ' * Released under the MIT license',
                 ' * www.opensource.org/licenses/MIT',
                 ' *',
                 ' * <%= grunt.template.today("yyyy-mm-dd") %>',
                 ' */\n\n'
                ].join("\n");

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-sass');

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    'jasmine' : {
      'sir-trevor': {
        src : 'sir-trevor.js',
        options: {
          vendor: ['bower_components/jquery/jquery.js',
                   'bower_components/underscore/underscore.js',
                   'bower_components/es5-shim/es5-shim.js',
                   'bower_components/es6-shim/es6-shim.js',
                   'bower_components/Eventable/eventable.js'],
          specs : 'spec/javascripts/**/*.spec.js',
          helpers : 'spec/javascripts/helpers/*.js',
          summary: true
        }
      }
    },

    uglify: {
      options: {
        mangle: false,
        banner: banner
      },
      standard: {
        files: {
          'sir-trevor.min.js': ['sir-trevor.js']
        }
      }
    },

    watch: {
      scripts: {
        files: ['src/*.js', 'src/**/*.js', 'src/sass/*.scss'],
        tasks: ['sass']
      }
    },

    jshint: {
      all: ['sir-trevor.js'],

      options: {
        curly: true,
        eqeqeq: true,
        immed: false,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true
      },
      globals: {
        jQuery: true,
        _: true,
        console: true
      }
    },

    sass: {
      dist: {
        files: {
          'sir-trevor.css': 'src/sass/main.scss'
        }
      }
    }

  });

  // Default task.
  grunt.loadNpmTasks('grunt-contrib-jasmine');

  grunt.registerTask('travis', ['jasmine']);

  grunt.registerTask('default', ['sass', 'uglify', 'jasmine']);

  grunt.registerTask('jasmine-browser', ['server','watch']);

};
