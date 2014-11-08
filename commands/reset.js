var fs = require('fs-extra'),
  path = require('path'),
  colors = require('colors'),
  prompt = require('prompt'),
  res = path.resolve,
  FileManager = require('../lib/fileManager');

function resetApp(pwd, settings, cb) {
  var resetConf = JSON.parse(fs.readFileSync(res(pwd, settings.config), { encoding: 'utf8' })).reset;
  resetConf = Object.merge(resetConf.default, resetConf[settings.profile] || {});

  resetConf.remove.forEach(function (dir) {
    fs.removeSync(res(pwd, dir));

    if (dir.split('/').pop().indexOf('.') === -1) {
      fs.mkdirSync(res(pwd, dir));
    }
  });

  resetConf.pwd = pwd;
  resetConf.forceRemove = true;
  FileManager.generateTemplates(resetConf, {});

  cb && cb();
}

module.exports = function (opts) {
  var pwd = opts.pwd || process.env.PWD;

  if (!fs.existsSync(res(pwd, '.meteor'))) {
    console.error("Run 'reset' within your Meteor App!".red);
    process.exit(1);
  }

  if (!fs.existsSync(res(pwd, 'settings.json'))) {
    console.error("Run 'orion init' to use scaffolding".red);
    process.exit(1);
  }

  var settings = JSON.parse(fs.readFileSync(res(pwd, 'settings.json'), { encoding: 'utf8' }))['orion-cli'];

  if (!settings) {
    console.error("Run 'orion init' to use scaffolding".red);
    process.exit(1);
  }

  if (opts.force) {
    resetApp(pwd, settings);
  } else {
    prompt.get([{ name: 'really', description: 'Really want to reset this app? (Y/n)' }], function (err, vars) {
      if (vars.really.toUpperCase() !== 'Y') {
        process.exit(1);
      }

      resetApp(pwd, settings, function () {
        console.log('Successfully reset the app!');
      });
    });
  }
};