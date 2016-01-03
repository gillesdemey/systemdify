module.exports = function (opts) {
  var description = opts.description
  var command = opts.command
  var cwd = opts.cwd

  return `
[Unit]
Description=${description}
After=network.target

[Service]
Type=simple
WorkingDirectory=${cwd}
ExecStart=${command}
Restart=always
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
`
}
