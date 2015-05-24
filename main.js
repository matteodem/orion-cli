exports.execute = function () {
  var parser = require('nomnom');

  parser.script('orion');

  // Create Command
  parser.command('create')
    .option('name', {
      position: 1,
      required: true,
      help: 'Name of your Meteor App'
    })
    .option('blank', {
      abbr: 'b',
      flag: true,
      help: "Create a blank app without any example code"
    })
    /*.option('profile', {
      abbr: 'p',
      help: "Choose between default (javascript), es6 (harmony) or coffee (coffeescript) profiles"
    }) */
    .callback(require('./commands/create'))
    .help('Creates a new app with the Meteor Boilerplate')
  ;

  // Init Command
  parser.command('init')
    .callback(require('./commands/init'))
    .help('Initialize app for scaffolding (execute from within the app)')
  ;

  // Generate Command
  parser.command('generate')
    .option('name', {
      position: 1,
      help: 'Name of templates to generate, see settings.json'
    })
    .option('entity_name', {
      position: 2,
      help: 'Name of entity to generate without prompt'
    })
    .option('entity_param', {
      position: 3,
      help: 'Additional parameter for entity generation'
    })
    .callback(require('./commands/generate'))
    .help('Scaffolds templates (execute from within the app)')
  ;

  // Reset command
  parser.command('reset')
    .callback(require('./commands/reset'))
    .help('Reset files in the app (execute from within the app)')
  ;

  // Set Profile command
  parser.command('set-profile')
    .callback(require('./commands/setProfile.js'))
    .help('Set a new scaffolding profile')
  ;

  parser.parse();
};
