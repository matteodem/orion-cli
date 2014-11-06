exports.execute = function () {
  var parser = require('nomnom');
  parser.script('orion');

  parser.command('create')
    .callback(function(opts){
      try{
        var Git = require('./git');
        Git.create(opts[1], opts.p);
      } catch (ex) {
        console.error(ex.message);
      }
    })
    .help('Creates a new blank app.  ex: \'onion create <name> \'');

  parser.parse();
};
