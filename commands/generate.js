var fs = require('fs'),
  pwd = process.cwd(),
  sugar = require('sugar'),
  prompt = require('prompt'),
  colors = require('colors'),
  FileManager = require('../lib/fileManager');

module.exports = function (opts) {
  var mainSettings,
    settings,
    profile;

  if (!fs.existsSync(pwd + '/.meteor')) {
    console.error("Run 'generate' within your Meteor App!".red);
    process.exit(1);
  }

  try {
    mainSettings = JSON.parse(fs.readFileSync('settings.json', { encoding: 'utf8' }))['orion-cli'];

    if (!mainSettings || !mainSettings.config) {
      console.error("Run 'orion init' to use scaffolding".red);
      process.exit(1);
    }

    settings = JSON.parse(
      fs.readFileSync((pwd + '/' + mainSettings.config).replace(/\/\//g, '/'), { encoding: 'utf8' })
    ).generate;

    profile = mainSettings.profile;
  } catch (e) {
    settings = {};
  }

  if (!opts.name) {
    var firstTemplate = '';

    Object.keys(settings).forEach(function (key) {
      var desc = '';

      if (settings[key]) {
        if (settings[key][profile] && settings[key][profile].desc) {
          desc = settings[key][profile].desc;
        } else if (settings[key].default && settings[key].default.desc) {
          desc = settings[key].default.desc;
        }
      }

      if (desc) {
        desc = '\t - ' + desc;
      }

      if (!firstTemplate) {
        firstTemplate = key.yellow;
      }

      console.log(key.yellow + desc);
    });

    console.log('\n`orion generate ' + firstTemplate + '`' + ' for example')
    process.exit(0);
  }

  if (!settings[opts.name]) {
    console.error(("No view called: '" + opts.name + "' defined").red);
    process.exit(1);
  }

  var templateConf = settings[opts.name].default;

  if (settings[opts.name][profile]) {
    templateConf = Object.merge(templateConf, settings[opts.name][profile]);
  }

  templateConf.variables = templateConf.variables || [];
  templateConf.variables = templateConf.variables.map(function (variable) {
    return { name: variable.name, description: variable.desc  };
  });

  prompt.message = "orion";
  prompt.delimiter = " | ".green;
  prompt.get(templateConf.variables, function (err, result) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
  
    result.name = opts.name
    var files = FileManager.generateTemplates(templateConf, result);
    console.log('\nSuccessfully created following files: ');
    files.forEach(function (file) {
      console.log('    ' + file);
    });
  });
};