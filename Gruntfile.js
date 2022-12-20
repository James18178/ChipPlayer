var path = require('path');
var spawn = require('child_process').spawn;
var util = require('util');

module.exports = function(grunt) {
    var path = require('path');
    grunt.registerTask('build_core', 'Compile the C libraries with emscripten.', function(outfile) {
        var cb = this.async();

        var emcc = 'emcc';
        var gme_dir = path.join('core_src', 'game_music_emu', 'gme');
        var gme_files = grunt.file.expand(gme_dir + '/*.cpp');

        var import_flags = [];
        var source_files = ['core_src/core.c'].concat(gme_files);
        outfile = outfile || 'demo/player_core.js';
        var flags = [
            '-s', 'ASM_JS=1',
            '-s','EXTRA_EXPORTED_RUNTIME_METHODS=["cwrap","getValue"]',
            '-s', 'EXPORTED_FUNCTIONS=@core_src/exported_functions.json',
            '-O1',
            '-I' + gme_dir,
            '-o',  outfile,

            // GCC/Clang arguments to shut up about warnings in code I didn't
            // write. :D,
            '-sASSERTIONS',
            '-Wno-deprecated',
            '-Qunused-arguments',
            '-Wno-logical-op-parentheses'
        ];
        var args = [].concat(flags, source_files);

        grunt.log.writeln('Compiling via emscripten to ' + outfile);
        var build_proc = spawn(emcc, args, {stdio: 'inherit'});
        build_proc.on('exit', function() {
            cb();
        });
    });
};
