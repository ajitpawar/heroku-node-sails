module.exports = function(grunt) {

  grunt.config.set('browserify', {
    js: {
      src: 'browserify.js',
      dest: '.tmp/public/js/browserify-include.js'
    }
  });

  grunt.loadNpmTasks('grunt-browserify');
};