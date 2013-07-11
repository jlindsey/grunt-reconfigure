/*
 * grunt-reconfigure
 * https://github.com/jlindsey/grunt-reconfigure
 *
 * Copyright (c) 2013 Joshua Lindsey
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {
  grunt.registerTask('reconfigure', 'Override configuration options', function(env) {
    var _ = require('underscore');
    var updates = [];
    
    var hasKeyPath = function(obj, parts) {
      if (parts.length === 0) { return true; }
      
      var key = parts.shift();

      if (!_(obj).has(key)) {
        return false;
      } else {
        return hasKeyPath(obj[key], parts);
      }
    };

    var updateOptions = function(obj, env, keypath) {
      if (!_(obj).isObject()) { return; }

      if (hasKeyPath(obj, ['options', 'reconfigureOverrides', env])) {
        var options = obj.options,
            overrides = obj.options.reconfigureOverrides[env];

        for (var key in overrides) {
          var update = { 
            key: keypath+'.options.'+key,
            oldVal: options[key].toString(),
            newVal: overrides[key].toString()
          };
          updates.push(update);

          options[key] = overrides[key];
        }

        delete options.reconfigureOverrides;
      } else {
        for (var objKey in obj) {
          updateOptions(obj[objKey], env, keypath+'.'+objKey);
        }
      }
    };

    if (arguments.length === 0) {
      grunt.log.error('Must specify an override key to use (eg. grunt reconfigure:dist)');
      return false;
    }

    for (var key in grunt.config.data) {
      updateOptions(grunt.config.data[key], env, key);
    }

    for (var i in updates) {
      var update = updates[i];
      var text = [update.key.magenta+':', update.oldVal.cyan, '->'.grey, update.newVal.blue];
      grunt.log.ok(grunt.log.table([30, 15, 3, 15], text));
    }

    return true;
  });
};
