var log = require('npmlog')
var path = require('path')
var pjson = require('./package.json')
var which = require('which')

module.exports = function (opts) {
  var description = opts.description
  var command = opts.command

  // figure out where node is installed
  try {
    var node = which.sync('node')
    command = `${node} ${path.resolve(command)}`
  } catch (_) {
    log.error(`${pjson.name}@${pjson.version}`, 'Node is not installed! Aborting')
    process.exit(1)
  }

  return `
[Unit]
Description=${description}
After=network.target

[Service]
Type=simple
ExecStart=${command}
Restart=always
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
`
}
