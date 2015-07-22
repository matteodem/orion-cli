var fs = require('fs-extra'),
  path = require('path'),
  colors = require('colors'),
  prompt = require('prompt'),
  execSync = require('child_process').execSync,
  FileManager = require('../lib/fileManager');

module.exports = function (opts) {
  var res = path.resolve,
    pwd = opts.pwd || process.cwd();

  if (!fs.existsSync(res(pwd, '.meteor'))) {
    console.error("Run 'set-profile' within your Meteor App!".red);
    process.exit(1);
  }

  if (!fs.existsSync(res(pwd, 'settings.json'))) {
    console.error("Run 'orion init' to use scaffolding".red);
    process.exit(1);
  }

  var settings = JSON.parse(fs.readFileSync(res(pwd, 'settings.json'), { encoding: 'utf8' }));

  if (!settings['orion-cli']) {
    console.error("Run 'orion init' to use scaffolding".red);
    process.exit(1);
  }

  prompt.get([{ name: 'profile', description: 'What profile do you want to use?' }], function (err, vars) {
    if (vars.profile) {
      settings['orion-cli'].profile = vars.profile;
      fs.writeFileSync(res(pwd, 'settings.json'), JSON.stringify(settings, null, 4) + '\n',{ encoding: 'utf8' });

      var config = JSON.parse(
        fs.readFileSync((pwd + '/' + settings['orion-cli'].config).replace(/\/\//g, '/'), { encoding: 'utf8' })
      );

      if (config.packages && config.packages[vars.profile]) {
        console.log(execSync('meteor add ' + config.packages[vars.profile].join(' '), { encoding: 'utf8' }));
        console.log('Successfully changed profile to: ' + vars.profile.yellow);
      } else {
        console.log('Successfully changed profile to: ' + vars.profile.yellow);
      }
    }
  });
};
