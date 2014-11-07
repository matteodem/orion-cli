var fs = require('fs-extra'),
  pwd = process.env.PWD;

/**
 * Manager for scaffolding files
 *
 * @type {{generateTemplates: Function, getPath: Function, create: Function}}
 */
var FileManager = {
  generateTemplates: function (conf, vars) {
    var hasError,
      files = [];

    conf.files.forEach(function (path) {
      var templateContent = fs.readFileSync(pwd + '/' + path, { encoding: 'utf8' }),
        fileConf,
        worked;

      Object.keys(vars).forEach(function (key) {
        templateContent = templateContent.replace(new RegExp('__' + key + '__', 'g'), vars[key]);
      });

      fileConf = JSON.parse(/\{.*\}/g.exec(templateContent)[0]);
      worked = FileManager.create(fileConf.path, templateContent.split('\n').splice(1).join('\n'));

      if (!worked) {
        !hasError && console.log('');
        hasError = true;
        console.error(('Remove existing file: ' + fileConf.path + ' manually!').red);
      }

      files.push(fileConf.path);
    });

    if (hasError) {
      process.exit(1);
    }

    return files;
  },
  create: function (path, content) {
    path = (pwd + '/' + path).replace(/\/\//g, '/');
    var onlyPath = path.split('/').splice(0, path.split('/').length - 1).join('/');

    fs.ensureDirSync(onlyPath);

    if (fs.existsSync(path)) {
      return false;
    }

    fs.writeFileSync(path, content, { encoding: 'utf8' });
    return true;
  }
};

module.exports = FileManager;
