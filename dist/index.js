'use strict';

var args = process.argv.slice(2);
var readline = require('readline');
var Generator = require('./generator');
var config = require('./config');
var helper = require('./helper');

var _module, controller, service, mapper, model, fields;

var controller = args[0];
console.log("Warning! If controller exists generator will overwrite it!");
console.log('We will create controller: ', controller);
console.log();

var mappers = ['MySQL', 'Redis', 'MongoDb', 'HTTP'];

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Create service? (Y/n):', function (answer) {
  if (answer !== 'n') {
    service = helper.toSingular(args[0]);
  }
  rl.question('Create mapper? (Y/n):', function (answer) {
    if (answer !== 'n') {
      mapper = helper.toSingular(args[0]);
    }
    var i = 0;
    var extendMapper = mappers.map(function (m) {
      i++;
      return i + ". " + m;
    });
    extendMapper = "Which mapper to extend (default MySQL)? \n" + extendMapper.join("\n") + "\n: ";

    rl.question(extendMapper, function (answer) {
      if (answer !== 'n') {
        mapperExtend = mappers[answer - 1] || mappers[0];
      }
      rl.question('List your fields comma separated or leave blank:', function (answer) {
        if (answer !== 'n') {
          model = answer;
        }
        new Generator(_module, controller, service, mapper, mapperExtend, model).setConfig(config).start().then(function (result) {
          console.log('Everything is good. Bye!');
          rl.close();
        }).catch(function (e) {
          console.log('Generator error:', e);
          rl.close();
        });
      });
    });
  });
});