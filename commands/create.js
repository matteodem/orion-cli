var fs = require('fs'),
  github = require('transfer-github');

// TODO: Add 'colors' package
// TODO: options! (blank)
module.exports = function (opts) {
  var appPath = process.env.PWD + '/' + opts.name;

  if (fs.existsSync(appPath)) {
    throw new Error("Directory already exists! Remove it or change the app name");
  } else {
    fs.mkdirSync(appPath);

    github.get('matteodem/meteor-boilerplate#master', appPath, function (err) {
      if (err) {
        throw new Error(err);
      }

      console.log('Succesfully created your app!');
      console.log('');
      console.log('    cd ' + opts.name);
      console.log('    meteor');
    });
  }
};