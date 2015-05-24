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

  // Get parsed options - entity name & param
  if ( opts.entity_name
    || ( opts.entity_name
      && opts.entity_param ) ) {

    var params = {},
      entity_map = [
        'entity_name',
        'entity_param'
      ],
      variable = {};

    // Remove parsed options from prompt queue
    for ( var n in entity_map ) {
      if ( entity_map.hasOwnProperty( n )
        && typeof opts[ entity_map[ n ] ] !== 'undefined' ) {
        variable = templateConf.variables.shift();
        params[ variable.name ] = opts[ entity_map[ n ] ];
      }
    }
  }

  // Create templates
  if ( templateConf.variables.length > 0 ) {
    // Need prompt
    prompt.message = "orion";
    prompt.delimiter = " | ".green;
    prompt.get(templateConf.variables, function(err, result) {
      // Extend result with params
      for ( var n in params ) {
        if ( params.hasOwnProperty( n ) ) {
          result[ n ] = params[ n ];
        }
      }
      runTemplateGeneration(err, result);
    });
  } else {
    runTemplateGeneration( null, params);
  }

  /**
   * Generate entity with template
   * @param err
   * @param result
   */
  function runTemplateGeneration(err, result) {
    if (err) {
      console.error(err);
      process.exit(1);
    }

   result.templateName = opts.name; // Set entity template
    var files = FileManager.generateTemplates(templateConf, result);
    console.log('\nSuccessfully created following files: ');
    files.forEach(function (file) {
      console.log('    ' + file);
    });
  }
};