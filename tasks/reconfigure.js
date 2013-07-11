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
            oldVal: (typeof options[key] === 'undefined') ? 'undefined' : options[key].toString(),
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

    var padding = 5;
    var widths = _.reduce(updates, function(memo, update, i) {
      if ((update.key.length + padding) > memo[0]){
        memo[0] = (update.key.length + padding);
      }
      if ((update.oldVal.length + padding) > memo[1]) {
        memo[1] = (update.oldVal.length + padding);
      }
      if ((update.newVal.length + padding) > memo[3]) {
        memo[3] = (update.newVal.length + padding);
      }

      return memo;  
    }, [0, 0, 3, 0]);

    if (updates.length === 0) {
      grunt.warn("No override options found for " + env);
    }

    for (var i in updates) {
      var update = updates[i];
      var text = [update.key.magenta+':', update.oldVal.cyan, '->'.grey, update.newVal.blue];
      grunt.log.ok(grunt.log.table(widths, text));
    }

    return true;
  });
};
