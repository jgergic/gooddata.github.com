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
    sys.puts('Available targets: upload, clean, build, deploy, deploy-production');
}, true);

// --BETA-DEPLOYS------------------------------------------

desc('Build Jekyll website, compress CSS');
task('build', ['clean'], function() {
    run_command('Building Jekyll site...', 'jekyll && cat _site/css/style.css | java -jar /usr/local/bin/yuicompressor.jar --type css > _site/css/style-min.css && mv _site/css/style-min.css _site/css/style.css && echo "User-Agent: *\nDisallow: /" > _site/robots.txt', function() {
        sys.puts('done.');
        complete();
    });
}, true);

desc('Push website to developer-beta');
task('deploy', [], function() {
    run_command('Uploading website...', '$(cd _site/ && tar czf - . | ssh root@jn.users.getgooddata.com \'cat | tar xzf - -C /opt/devsite/\')', function() {
        sys.puts('done.');
        complete();
    });
}, true);

desc('Build and upload website');
task('upload', ['build','deploy'], function() {});

// --PRODUCTION-DEPLOYS------------------------------------

desc('Build Jekyll website, compress CSS');
task('build-production', ['clean'], function() {
    run_command('Building Jekyll site...', 'cat css/style.less | tail -n +3 > /tmp/style.less && lessc /tmp/style.less | java -jar /usr/local/bin/yuicompressor.jar --type css > css/style.css', function() {
        sys.puts('done.');
        complete();
    });
}, true);

desc('Push website to developer-beta');
task('deploy-production', [], function() {
    run_command('Uploading website...', 'echo "Review your changes in git, commit and push to origin"', function() {
        sys.puts('done.');
        complete();
    });
}, true);

desc('Build and upload website');
task('upload-production', ['build-production','deploy-production'], function() {});

// --------------------------------------------------------

desc('Clean old statically generated version');
task('clean', [], function() {
    run_command('Cleaning...', 'rm -Rf _site', function() {
        sys.puts('done.');
        complete();
    });
}, true);
