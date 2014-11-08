var fs = require('fs'),
  colors = require('colors'),
  res = require('path').resolve,
  github = require('transfer-github');

// TODO: options! (blank)
module.exports = function (opts) {
  var appPath = res(process.env.PWD, opts.name);

  if (fs.existsSync(appPath)) {
    console.error("Directory already exists! Remove it or change the app name".red);
    process.exit(1);
  }

  var i = 0;  // dots counter

  fs.mkdirSync(appPath);

  var interval = setInterval(function() {
    var dots = new Array(i + 1).join(".");

    process.stdout.clearLine();  // clear current text
    process.stdout.cursorTo(0);  // move cursor to beginning of line
    i = (i + 1) % 4;

    process.stdout.write("Downloading".yellow + dots.yellow);
  }, 300);

  github.get('matteodem/meteor-boilerplate#master', appPath, function (err) {
    if (err) {
      console.error(err.red);
    }

    clearInterval(interval);
    process.stdout.clearLine();
    process.stdout.cursorTo(0);

    if (opts.blank) {
      require('./reset')({
        pwd: appPath,
        force: true
      });
    }

    console.log('Succesfully created your app!');
    console.log('');
    console.log('    cd ' + opts.name);
    console.log('    meteor');
  });
};