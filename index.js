var xtend = require('xtend')

module.exports = function (opts) {
  var defaults = {
    command: 'npm start',
    cwd: process.cwd(),
    description: ''
  }
  opts = xtend(defaults, opts || {})

  return `
[Unit]
Description=${opts.description}
After=network.target

[Service]
Type=simple
WorkingDirectory=${opts.cwd}
ExecStart=${opts.command}
Restart=always
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
`
}
