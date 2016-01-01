#!/usr/bin/env node

var fs = require('fs')
var resolve = require('path').resolve
var meow = require('meow')
var log = require('npmlog')

var initdify = require('./')

var cli = meow(`
  Usage
    $ systemdify <folder>

  Options
    -o, --output Write output to file

  Examples
    $ systemdify /path/to/my/app

    [Unit]
    description=My Application
    ...
`, {
  string: 'output',
  alias: {
    o: 'output'
  }
})

var folder = cli.input[0] || process.cwd()
var pjson

try {
  pjson = require(resolve(folder, 'package.json'))
} catch (_) {
  console.error('No package.json found!')
  process.exit(1)
}

var file = initdify({
  name: pjson.name,
  command: resolve(folder, pjson.main),
  description: pjson.description
})

if (cli.flags.output) {
  fs.writeFileSync(cli.flags.output, file)
  process.exit(0)
}

fs.writeFile(`/etc/systemd/system/${pjson.name}.service`, file, function (err) {
  switch (err.code) {
    case 'ENOENT':
      log.warn(`systemdify@${cli.pkg.version}`, 'systemd not found, skipping')
      break
    default:
      throw err
  }
})
