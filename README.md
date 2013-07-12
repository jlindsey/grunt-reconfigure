# grunt-reconfigure [![Build Status](https://travis-ci.org/jlindsey/grunt-reconfigure.png?branch=master)](https://travis-ci.org/jlindsey/grunt-reconfigure)

Grunt Task to override other configuration options.

## Getting Started
This plugin requires Grunt `~0.4.0`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-reconfigure --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-reconfigure');
```

*This plugin was designed to work with Grunt 0.4.x. If you're still using grunt v0.3.x it's strongly recommended that [you upgrade](http://gruntjs.com/upgrading-from-0.3-to-0.4), but in case you can't please use [v0.3.2](https://github.com/gruntjs/grunt-contrib-coffee/tree/grunt-0.3-stable).*

## Reconfigure task
_Run this task with the `grunt reconfigure` command._  
_This task is designed to be run as part of a chain (ex. `grunt reconfigure:dev coffee jade`)_

This task looks for a key in the `options` object in any Grunt task config called `reconfigureOverrides`. Within that object should be any number of arbitrarily named keys corresponding to the "environment" you wish those options to take effect in. For example, if you have a Jade config that looks like this:

```js
{
  jade: {
    index: {
      options: {
        reconfigureOverrides: {
          dev: {
            pretty: true
          },
          dist: {
            pretty: false
          }
        }
      },
      files: {
        "public/index.html": "src/jade/index.jade"
      }
    }
  }
}
```

Then running Grunt with `grunt reconfigure:dev jade` will compile your Jade templates with `pretty: true`. Any options set outside of the override object will be treated normally.

## Contributing

  1. Create a feature branch
  2. Write your code
  3. Write tests (*please*)
  4. Open a pull requests and I'll merge it back in (and add you to the contributors)!

## License

Copyright (c) 2013 Joshua Lindsey. See LICENSE for details.
