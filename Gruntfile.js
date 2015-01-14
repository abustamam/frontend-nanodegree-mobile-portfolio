'use strict'

var ngrok = require('ngrok');

module.exports = function(grunt) {

  // Load grunt tasks
  require('load-grunt-tasks')(grunt);

  require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);
  // Grunt configuration
  grunt.initConfig({
    // Config for htmlhint
    htmlhint: {
      build: {
        options: {
            'tag-pair': true,
            'tagname-lowercase': true,
            'attr-lowercase': true,
            'attr-value-double-quotes': true,
            'doctype-first': true,
            'spec-char-escape': true,
            'id-unique': true,
            'head-script-disabled': true,
            'style-disabled': true
        },
        src: ['*.html']
      }
    },

    // Config for htmlmin
    htmlmin: {
      dist: {
        options: {
          removeComments: true,
          collapseWhitespace: true
        },
        files: {
          'index.html': 'src/index.html'
        }
      },

      dynamic: {
        options: {
          removeComments: true,
          collapseWhitespace: true
        },
        files: [{
          expand: true,
          cwd: 'src/',
          src: ['**/*.html', '!index.html'],
          dest: 'build'
        }]
      }
    },

    // Config for uglifier
    uglify: {
      my_target: {
        files: [{
          expand: true,
          cwd: 'src/',
          src: '**/*.js',
          dest: 'build/',
          ext: 'min.js'
        }]
      }
    },

    // Config for cssmin
    cssmin: {
      target: {
        files: [{
          expand: true,
          cwd: 'src/',
          src: '**/*.img',
          dest: 'build/',
          ext: 'min.img'
        }]
      }
    },

    // Config for imagemin
    imagemin: {
      dynamic: {
        files: [{
          expand: true,
          cwd: 'src/',
          src: ['**/*.{png,jpg,gif}'],
          dest: 'build/'
        }]
      }
    },

    // Config for pagespeed
    pagespeed: {
      options: {
        nokey: true,
        locale: "en_GB",
        threshold: 40
      },
      local: {
        options: {
          strategy: "desktop"
        }
      },
      mobile: {
        options: {
          strategy: "mobile"
        }
      }
    },

    // Config for watch
    watch: {
      build: {
        files: ['src/*.html', 'src/js/*.js', 'src/css/*.css'],
        tasks: ['build']
      }
    }
  });

  // Register customer task for ngrok
  grunt.registerTask('psi-ngrok', 'Run pagespeed with ngrok', function() {
    var done = this.async();
    var port = 8080;

    ngrok.connect(port, function(err, url) {
      if (err !== null) {
        grunt.fail.fatal(err);
        return done();
      }
      grunt.config.set('pagespeed.options.url', url);
      grunt.task.run('pagespeed');
      done();
    });
  });

  // Register default tasks
  grunt.registerTask('default', ['psi-ngrok']);

  // Register build tasks
  grunt.registerTask('build', ['newer:htmlhint', 'newer:htmlmin', 'newer:uglify', 'newer:cssmin']);
}