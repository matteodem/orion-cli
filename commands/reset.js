var fs = require('fs-extra'),
  pwd = process.env.PWD,
  path = require('path'),
  colors = require('colors'),
  prompt = require('prompt'),
  FileManager = require('../lib/fileManager');

module.exports = function (opts) {
  var res = path.resolve;

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

  prompt.get([{ name: 'really', description: 'Really want to reset this app? (Y/n)' }], function (err, vars) {
    if (vars.really.toUpperCase() !== 'Y') {
      process.exit(1);
    }

    var resetConf = JSON.parse(fs.readFileSync(settings.config, { encoding: 'utf8' })).reset;
    resetConf = Object.merge(resetConf.default, resetConf[settings.profile] || {});

    resetConf.remove.forEach(function (dir) {
      fs.removeSync(res(pwd, dir));

      if (dir.split('/').pop().indexOf('.') === -1) {
        fs.mkdirSync(res(pwd, dir));
      }
    });

    resetConf.forceRemove = true;
    FileManager.generateTemplates(resetConf, {});

    console.log('Successfully reset the app!');
  });
};