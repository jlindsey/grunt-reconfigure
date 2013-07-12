//      grunt-reconfigure
//      https://github.com/jlindsey/grunt-reconfigure
//      Copyright (c) 2013 Joshua Lindsey
//      Licensed under the MIT license.

'use strict';

module.exports = function(grunt) {

  // ## Baseline setup

  // Include Underscore
  var _ = require('underscore');

  // Define an array used for storing any changed options
  // for later output.
  var updates = [];


  // ## Helper functions

  // Recursively step through the provided object and return
  // whether it contains the provided keypath.
  var hasKeyPath = function(obj, parts) {
    if (parts.length === 0) { return true; }
    
    var key = parts.shift();

    if (!_(obj).has(key)) {
      return false;
    } else {
      return hasKeyPath(obj[key], parts);
    }
  };


  // Recursively step through the provided object, searching for
  // an `options` object with `reconfigureOverrides` containing the
  // provided `env`.
  // If it finds one, it resets any keys and values found inside on
  // the containing `options` object.
  var updateOptions = function(obj, env, keypath) {
    if (!_.isObject(obj)) { return; }

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
    } else {
      for (var objKey in obj) {
        updateOptions(obj[objKey], env, keypath+'.'+objKey);
      }
    }
  };

  // Recursively step through the provided object (the `grunt.config.data` object)
  // and delete all the `reconfigureOverrides` objects. If we don't do this, many
  // subsequent tasks will error due to unrecognized options.
  var cleanupOverrides = function(obj) {
    if (!_.isObject(obj)) { return; }
    
    if (hasKeyPath(obj, ['options', 'reconfigureOverrides'])) {
      delete obj.options.reconfigureOverrides;
    } else {
      for (var key in obj) {
        if (!_.isObject(obj[key])) { continue; }
        cleanupOverrides(obj[key]);
      }
    }
  };

  // ## Task definition
  grunt.registerTask('reconfigure', 'Override configuration options', function(env) {
    // Task can't do anything unless an `env` is provided, so
    // warn the user and fail.
    if (arguments.length === 0) {
      grunt.log.error('Must specify an override key to use (eg. grunt reconfigure:dist)');
      return false;
    }

    // Loop through the keys in the config data and pass them
    // to our recursive functions for processing.
    for (var key in grunt.config.data) {
      updateOptions(grunt.config.data[key], env, key);
      cleanupOverrides(grunt.config.data[key]);
    }


    // Padding to add between output columns
    var padding = 5;

    // We use `grunt.log.table` to format the output lines, and that 
    // needs an array of column widths. This will loop through the array
    // of updates and set these widths to the longest lengths among those
    // strings (plus the padding).
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

    // Emit a warning if no options were overridden, because that's
    // probably not what the user was expecting.
    if (updates.length === 0) {
      grunt.warn("No override options found for " + env);
    }

    // Output the config updates with pretty colors and formatting.
    for (var i in updates) {
      var update = updates[i];
      var text = [update.key.magenta+':', update.oldVal.cyan, '->'.grey, update.newVal.blue];
      grunt.log.ok(grunt.log.table(widths, text));
    }

    return true;
  });
};
