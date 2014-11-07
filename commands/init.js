var fs = require('fs-extra'),
  pwd = process.env.PWD,
  path = require('path'),
  colors = require('colors');

module.exports = function (opts) {
  var newSettings,
    res = path.resolve,
    cliSettings = {
    "orion-cli" : {
      "currentProfile" : "default",
      "generateConfig" : "private/generateConfig.json"
    }
  };

  if (!fs.existsSync(pwd + '/.meteor')) {
    console.error("Run 'init' within your Meteor App!".red);
    process.exit(1);
  }

  if (!fs.existsSync(pwd + '/settings.json')) {
    newSettings = cliSettings;
  } else {
    newSettings = JSON.parse(fs.readFileSync((pwd + '/settings.json'), { encoding: 'utf8' }));
    newSettings['orion-cli'] = cliSettings;
    fs.unlinkSync(pwd + '/settings.json');
  }

  fs.writeFileSync(pwd + '/settings.json', JSON.stringify(newSettings, null, 4) + '\n');
  console.log('    Initialized settings.json with orion default configuration');

  fs.ensureDirSync(pwd + '/private/templates');
  fs.copySync(res(__dirname, '../init/generateConfig.json'), pwd + '/private/generateConfig.json');
  fs.copySync(res(__dirname, '../init/templates'), pwd + '/private/templates');
  console.log('    Initialized generateConfig.json and scaffolding templates under private/');
};