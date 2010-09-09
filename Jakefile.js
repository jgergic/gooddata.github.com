var sys      = require('sys')
    ,exec    = require('child_process').exec;

var run_command = function(info, command, callback) {
    sys.puts(info);
    return exec(command, {env:process.env,cwd:process.cwd()}, function(err, stdout, stderr) {
        if (err) throw new Error('Failed command: '+command+' Error: '+stderr);
        else callback(err, stdout, stderr);
    });
};

desc('…blank…');
task('default', [], function() {
    sys.puts('Available targets: build, deploy, clean');
}, true);

desc('Prepare for git push');
task('build', [], function() {
    run_command('Compiling CSS from LESS...', 'lessc css/style.less | java -jar /usr/local/bin/yuicompressor.jar --type css > css/style.css', function() {
        sys.puts('done.');
        complete();
    });
}, true);