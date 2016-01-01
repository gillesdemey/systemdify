var test = require('tape')
var initdify = require('./')

test('create a correct Unit file', function (t) {
  t.plan(1)

  var file = initdify({
    name: 'my-app',
    command: './server.js',
    description: 'My App'
  })

  t.ok(file)
})
