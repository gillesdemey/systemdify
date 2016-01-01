# systemdify

> Automatically create a systemd unit file for your Node application based on package.json

## Install

`npm install --save systemdify`

or to use the CLI

`npm install -g systemdify`

## Node API

```javascript
var systemdify = require('systemdify')

var file = initdify({
	command: './server.js',
	description: 'My Awesome Application'
})

```

Will return the following:

```
[Unit]
Description=My Awesome Application
After=network.target

[Service]
Type=simple
ExecStart=/usr/local/bin/node /path/to/my/app/server.js
Restart=always
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

## CLI

```
Usage
  $ systemdify <folder>

Options
  -o, --output Write output to file

Examples
  $ systemdify /path/to/my/app

  [Unit]
  description=My Application
  ...
```

