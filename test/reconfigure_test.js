/*
 * grunt-reconfigure
 * https://github.com/jlindsey/grunt-reconfigure
 *
 * Copyright (c) 2013 Joshua Lindsey
 * Licensed under the MIT license.
 */

'use strict';

var exec = require('child_process').exec;

exports.requires_target = function(test) {
  test.expect(1);

  exec('grunt reconfigure', function(err, stdout, stderr) {
    var check = stdout.indexOf('Must specify an override key to use (eg. grunt reconfigure:dist');
    test.ok((check > -1), 'incorrect message');
    test.done();
  });
};

exports.warning_if_no_env_defined = function(test) {
  test.expect(2);

  exec('grunt reconfigure:foo --no-color', function(err, stdout, stderr) {
    var check = />>.*?->.*$/;
    var warning = stdout.indexOf('Warning: No override options found for foo');

    test.ok((check.test(stdout) === false), 'incorrect output');
    test.ok((warning > -1), 'incorrect warning');
    test.done();
  });
};

exports.correct_output = function(test) {
  test.expect(3);

  exec('grunt reconfigure:test --no-color', function(err, stdout, stderr) {
    var check_1 = /testdata\.options\.foo:\s+bar\s+->\s+qux/;
    var check_2 = /testdata\.options\.baz:\s+false\s+->\s+true/;

    test.ok((check_1.test(stdout) === true), 'incorrect output 1');
    test.ok((check_2.test(stdout) === true), 'incorrect output 2');

    exec('grunt reconfigure:test2 --no-color', function(err, stdout, stderr) {
      var check_3 = /testdata\.options\.fizz:\s+buzz\s+->\s+boo/;

      test.ok((check_3.test(stdout) === true), 'incorrect output 3'+stdout);

      test.done();
    });
  });
};

exports.creates_option_if_none_exists = function(test) {
  test.expect(1);

  exec('grunt reconfigure:test3 --no-color', function(err, stdout, stderr) {
    var check_1 = /testdata\.options\.fuzz:\s+undefined\s+->\s+fizz/;
    test.ok((check_1.test(stdout)), 'incorrect output');
    test.done();
  });
};

exports.correctly_recurses_into_trees = function(test) {
  test.expect(1);
  exec('grunt reconfigure:pants --no-color', function(err, stdout, stderr) {
    var check_1 = /testdata\.nested\.another\.level_3\.options\.josh:\s+shorts\s+->\s+pants/;
    test.ok((check_1.test(stdout) === true), 'incorrect output 1');
    test.done();
  });
};
