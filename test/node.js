var test = require('tape')
var initdify = require('../')

test('create a correct Unit file', function (t) {
  t.plan(1)

  var file = initdify({
    command: 'node ./server.js',
    description: 'My App'
  })

  t.ok(file, 'returns unit file')
})

test('create a correct Unit file without options', function (t) {
  var file = initdify()

  t.ok(file, 'returns unit file')
  t.ok(file.match(`WorkingDirectory=${process.cwd()}\n`), 'has default working dir')
  t.ok(file.match('ExecStart=npm start\n'), 'has default command')
  t.end()
})
