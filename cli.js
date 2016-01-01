#!/usr/bin/env node
var resolve = require('path').resolve
var meow = require('meow')

var initdify = require('./')

var cli = meow(`
  Usage
    $ systemdify <folder>

  Examples
    $ systemdify /path/to/my/app

    [Unit]
    description=My Application
    ...
`)

var folder = cli.input[0] || process.cwd()
var pjson = require(resolve(folder, 'package.json'))

var file = initdify({
  name: pjson.name,
  command: resolve(folder, pjson.main),
  description: pjson.description
})

console.log(file)
