var test = require('tape')
var initdify = require('../')

test('Node: create a correct Unit file', function (t) {
  var cmd = 'node ./bin/www'
  var description = 'My App'
  var project = '/foo/bar'

  var file = initdify({
    command: cmd,
    description: description,
    cwd: project
  })

  t.ok(file, 'returns unit file')
  t.ok(file.match(`Description=${description}\n`), 'has correct description')
  t.ok(file.match(`WorkingDirectory=${project}\n`), 'has correct working dir')
  t.ok(file.match(`ExecStart=${cmd}\n`), 'has correct command')
  t.end()
})

test('Node: create a correct Unit file without options', function (t) {
  var file = initdify()

  t.ok(file, 'returns unit file')
  t.ok(file.match(`WorkingDirectory=${process.cwd()}\n`), 'has default working dir')
  t.ok(file.match('ExecStart=npm start\n'), 'has default command')
  t.end()
})
