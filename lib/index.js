exports.execute = function () {
  var parser = require('nomnom');

  parser.script('orion');

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
    .option('profile', {
      abbr: 'p',
      help: "Choose between default (javascript), es6 (harmony) or coffee (coffeescript) profiles"
    })
    .callback(require('../commands/create'))
    .help('Creates a new app, see \'onion create <name> \'')
  ;

  parser.parse();
};
