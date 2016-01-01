#!/usr/bin/env node
var path = require('path')

var initdify = require('./')
var pjson = require(path.resolve(process.cwd(), './package.json'))

var file = initdify({
  name: pjson.name,
  command: pjson.main,
  description: pjson.description
})

console.log(file)
