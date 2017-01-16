module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    dir: {
      vendor: 'bower_components/', // 第三方套件目錄
      src: 'src/', // 原始碼目錄
      // 發佈目錄
      dist: 'www/',
      distVendor: '<%= dir.dist %>vendor/'
    },
    clean: {
      // 移除www目錄底下的所有資源
      build: ['<%= dir.dist %>/**/*'],
      // 移除發布暫存檔
      builded: [
        '<%= concat.dist.dest %>'
      ]
    },
    copy: {
      // 把原始碼目錄的www發佈到專案的dist底下
      www: {
        expand: true,
        cwd: '<%= dir.src %>www/',
        src: ['**/*'],
        dest: '<%= dir.dist %>'
      },
      // 把原始碼目錄的tpls發佈到專案的dist/tpls/底下
      tpls: {
        expand: true,
        cwd: '<%= dir.src %>tpls/',
        src: ['**/*.html'],
        dest: '<%= dir.dist %>tpls/'
      },
      // 把原始碼目錄的nls發佈到專案的dist/nls/底下
      nls: {
        expand: true,
        cwd: '<%= dir.src %>nls/',
        src: ['**/*.js'],
        dest: '<%= dir.dist %>nls/'
      },
      vendor: {
        files: [
          // Underscore
          {src: '<%= dir.vendor %>underscore/underscore-min.js', dest: '<%= dir.distVendor %>underscore-min.js'},
          // Backbone
          {src: '<%= dir.vendor %>backbone/backbone-min.js', dest: '<%= dir.distVendor %>backbone-min.js'},
          // Mustache
          {src: '<%= dir.vendor %>mustache.js/mustache.min.js', dest: '<%= dir.distVendor %>mustache.min.js'},
          // jQuery
          {src: '<%= dir.vendor %>jquery/dist/jquery.min.js', dest: '<%= dir.distVendor %>jquery.min.js'}
        ]
      }
    },
    concat: {
      options: {
        separator: '\n\n'
      },
      dev: {
        src: ['<%= dir.src %>js/**/*.js'],
        dest: '<%= dir.dist %>app.js'
      },
      dist: {
        src: ['<%= dir.src %>js/**/*.js'],
        dest: '<%= dir.dist %>app.org.js'
      }
    },
    uglify: {
      dist: {
        options: {
          banner: '/*!\n * <%= pkg.name %> v<%= pkg.version %>\n * Copyright © Campuscruiser, All Rights Reserved.\n */\n'
        },
        files: {
          '<%= dir.dist %>app.js': ['<%= concat.dist.dest %>']
        }
      },
      vendor: {
        files: [
          // requirejs
          {'<%= dir.dist %>require.js': ['<%= dir.vendor %>requirejs/require.js']},
          // requirejs-i18n
          {'<%= dir.distVendor %>require-js/i18n.min.js': ['<%= dir.vendor %>i18n/i18n.js']},
          // requirejs-text
          {'<%= dir.distVendor %>require-js/text.min.js': ['<%= dir.vendor %>text/text.js']},
          // requirejs-css
          {'<%= dir.distVendor %>require-js/css.min.js': ['<%= dir.vendor %>require-css/css.js']}
        ]
      }
    },
    compass: {
      dist: {
        options: {
          sourcemap: true,
          sassDir: '<%= dir.src %>scss/',
          cssDir: '<%= dir.dist %>css/'
        }
      }
    },
    watch: {
      js: {
        files: ['<%= dir.src %>js/**/*.js'],
        tasks: ['concat:dist', 'uglify:dist']
      },
      dev: {
        files: ['<%= dir.src %>js/**/*.js'],
        tasks: ['concat:dev']
      }
    }
  });
  
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // 監聽JS變更事件
  grunt.event.on('watch', function(action, filepath) {
    grunt.log.writeln('');
    grunt.log.writeln(filepath + ' has ' + action);
  });

  grunt.registerTask('default', ['watch:js']);

  grunt.registerTask('wd', ['watch:dev']);
  
  grunt.registerTask('b', [
    'clean:build',
    'copy:vendor',
    'uglify:vendor',
    'copy:tpls',
    'copy:nls',
    'copy:www',
    'concat:dist',
    'uglify:dist',
    'compass:dist',
    'clean:builded'
  ]);

  grunt.registerTask('c', [
    'copy:tpls',
    'copy:www',
    'compass:dist'
  ]);

  grunt.registerTask('j', [
    'copy:tpls',
    'copy:nls',
    'copy:www',
    'concat:dist',
    'uglify:dist'
  ]);
};