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
	command: 'node ./server.js',
	description: 'My Awesome Application',
	cwd: '/path/to/my-app/'
})

```

Will return the following:

```
[Unit]
Description=My Awesome Application
After=network.target

[Service]
Type=simple
ExecStart=node ./server.js
Restart=always
Environment=NODE_ENV=production
WorkingDirectory=/path/to/my-app

[Install]
WantedBy=multi-user.target
```

## CLI

Systemdify will figure out what to do automatically, so you don't have to.

Simply execute systemdify and it will generate a unit file for you based on your package.json file. It will place your unit file under `/etc/systemd/system/<package.name>.service` by default. 

Systemdify will try to use your `npm start` script and fall back to executing your `main` entry if you don't have one.

Systemdify will always exit cleanly when it issues a warning, but will fail if node is not installed on the system.

```
Usage
  $ systemdify <folder>

Options
  -o, --output Write output to file

Examples
  $ systemdify /path/to/my/app -o my-app.service
  $ cat my-app.service

  [Unit]
  description=My Application
  ...
```

## NPM Hooks

The recommended way to use to module is to add it to your dev dependencies and execute the package after you've done an NPM install.

```json
...
scripts: {
  "install": "sudo ./node_modules/.bin/systemdify"
},
devDepencencies: {
  "systemdify": "^0.2.0"
}
...
```
