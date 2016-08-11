'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var path = require('path');
var os = require('os');
var fs = require('fs');
var helper = require('./helper');

var CONTROLLER_TEMPLATE = path.join(__dirname, 'templates', 'Controller.jst');
var SERVICE_TEMPLATE = path.join(__dirname, 'templates', 'Service.jst');
var MAPPER_TEMPLATE = path.join(__dirname, 'templates', 'Mapper.jst');
var MODEL_TEMPLATE = path.join(__dirname, 'templates', 'Model.jst');

var SERVICE_REQUIRE = "\n" + 'const %SERVICE%Service = require(\'%SERVICE_PATH%\');';
var SERVICE_INIT = "\n" + '    this.service = new %SERVICE%Service(di);';

var MAPPER_REQUIRE = "\n" + 'const %MAPPER%Mapper = require(\'%MAPPER_PATH%\');';
var MAPPER_INIT = "\n" + '    this.mapper = new %MAPPER%Mapper(di);';

var Generator = function () {
  function Generator(module, controller, service, mapper, mapperExtends, model) {
    _classCallCheck(this, Generator);

    this.module = module;
    this.controller = controller;
    this.service = service;
    this.mapper = mapper;
    this.mapperExtends = mapperExtends;
    this.model = model;
  }

  _createClass(Generator, [{
    key: 'setConfig',
    value: function setConfig(config) {
      this.config = config;
      return this;
    }
  }, {
    key: 'start',
    value: function start() {
      var _this = this;

      return new Promise(function (resolve, reject) {
        _this.createModule().createController().createService().createMapper().createModel();

        resolve(true);
      });
    }
  }, {
    key: 'createModule',
    value: function createModule(module) {
      if (module) {}
      return this;
    }
  }, {
    key: 'createController',
    value: function createController() {
      var template = fs.readFileSync(CONTROLLER_TEMPLATE).toString().split('%CONTROLLER%').join(this.controller);
      var serviceRequire = '';
      var serviceInit = '';

      if (this.service) {
        var servicePath = '../services/' + this.getServiceFileName() + '.service.js';
        serviceRequire = SERVICE_REQUIRE.replace('%SERVICE%', this.service).replace('%SERVICE_PATH%', servicePath);
        serviceInit = SERVICE_INIT.replace('%SERVICE%', this.service);
      }
      template = template.replace('%SERVICE_REQUIRE%', serviceRequire).replace('%SERVICE_INIT%', serviceInit);

      this.controllerFileName = helper.camelCaseToDashes(this.controller);
      fs.writeFileSync(path.join(this.config.path, 'controllers', this.controllerFileName + '.controller.js'), template);
      return this;
    }
  }, {
    key: 'createService',
    value: function createService() {
      if (this.service) {
        var template = fs.readFileSync(SERVICE_TEMPLATE).toString().split('%SERVICE%').join(this.service);
        var mapperRequire = '';
        var mapperInit = '';

        if (this.mapper) {
          var mapperPath = '../mappers/' + this.getMapperFileName() + '.mapper.js';
          mapperRequire = MAPPER_REQUIRE.replace('%MAPPER%', this.mapper).replace('%MAPPER_PATH%', mapperPath);
          mapperInit = MAPPER_INIT.replace('%MAPPER%', this.mapper);
        }
        template = template.replace('%MAPPER_REQUIRE%', mapperRequire).replace('%MAPPER_INIT%', mapperInit);
        fs.writeFileSync(path.join(this.config.path, 'services', this.getServiceFileName() + '.service.js'), template);
      }
      return this;
    }
  }, {
    key: 'createMapper',
    value: function createMapper() {
      if (this.mapper) {
        var template = fs.readFileSync(MAPPER_TEMPLATE).toString().split('%MAPPER%').join(this.mapper);
        var mapperPath = '../mappers/' + this.getMapperFileName() + '.mapper.js';

        template = template.split('%MAPPER_EXTENDS%').join(this.mapperExtends + 'Mapper');
        template = template.split('%MODEL%').join(this.mapper);

        var modelPath = '../models/' + this.getMapperFileName() + '.js';
        template = template.replace('%MODEL_PATH%', modelPath);

        template = template.replace('%MODEL_REPOSITORY%', helper.firstLower(this.controller));
        template = template.replace('%MODEL_CONNECTION%', this.mapperExtends.toLowerCase());

        fs.writeFileSync(path.join(this.config.path, 'mappers', this.getMapperFileName() + '.mapper.js'), template);
      }
      return this;
    }
  }, {
    key: 'createModel',
    value: function createModel() {
      if (this.mapper) {
        var template = fs.readFileSync(MODEL_TEMPLATE).toString().split('%MODEL%').join(this.mapper);
        var modelConstructor = [];
        if (this.model) {
          var fields = this.model.split(',');
          for (var i in fields) {
            var field = fields[i].trim();
            modelConstructor.push('    this.' + field + ' = data.' + field + ';');
          }
        }
        template = template.replace('%MODEL_CONSTRUCTOR%', modelConstructor.join("\n"));
        fs.writeFileSync(path.join(this.config.path, 'models', this.getMapperFileName() + '.js'), template);
      }
      return this;
    }
  }, {
    key: 'getServiceFileName',
    value: function getServiceFileName() {
      if (this.serviceFileName) {
        return this.serviceFileName;
      }
      return helper.camelCaseToDashes(this.service);
    }
  }, {
    key: 'getMapperFileName',
    value: function getMapperFileName() {
      if (this.mapperFileName) {
        return this.mapperFileName;
      }
      return helper.camelCaseToDashes(this.mapper);
    }
  }]);

  return Generator;
}();

module.exports = Generator;