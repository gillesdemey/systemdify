#!/usr/bin/env node

var fs = require('fs')
var log = require('npmlog')
var meow = require('meow')
var resolve = require('path').resolve
var which = require('which')

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
var command
var prefix = `${cli.pkg.name}@${cli.pkg.version}`

try {
  pjson = require(resolve(folder, 'package.json'))
} catch (_) {
  log.error(prefix, 'No package.json found!')
  process.exit(1)
}

if (!pjson.main && (!pjson.scripts || !pjson.scripts.start)) {
  log.error(prefix, 'No valid command found! Skipping')
  process.exit(0)
}

if (pjson.scripts && pjson.scripts.start) {
  command = pjson.scripts.start
} else if (pjson.main) {
  try {
    var node = which.sync('node')
    command = `${node} ${pjson.main}`
  } catch (_) {
    log.error(prefix, 'Node is not installed! Aborting')
    process.exit(1)
  }
}

var file = initdify({
  name: pjson.name,
  command: command,
  cwd: resolve(folder),
  description: pjson.description
})

if (cli.flags.output) {
  fs.writeFileSync(cli.flags.output, file)
  process.exit(0)
}

fs.writeFile(`/etc/systemd/system/${pjson.name}.service`, file, function (err) {
  switch (err.code) {
    case 'ENOENT':
      log.warn(prefix, 'systemd not found, skipping')
      break
    default:
      throw err
  }
})
