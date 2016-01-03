var fs = require('fs')
var path = require('path')
var cp = require('child_process')
var test = require('tape')
var pjson = require('../package.json')

var CMD_PATH = path.resolve(__dirname, '..', 'cli.js')
var CMD = 'node ' + CMD_PATH

test('Command line: version', function (t) {
  t.plan(2)

  cp.exec(CMD + ' --version', function (err, stdout) {
    t.error(err, 'should not error')
    t.ok(
      stdout.toLowerCase().indexOf(pjson.version) !== -1,
      'has correct version'
    )
  })
})

test('Command line: help', function (t) {
  t.plan(2)

  cp.exec(CMD + ' --help', function (err, stdout) {
    t.error(err, 'should not error')
    t.ok(stdout.toLowerCase().indexOf('usage') !== -1, 'has help output')
  })
})

test('Command line: no valid command', function (t) {
  t.plan(2)

  cp.exec(CMD, function (err, stdout, stderr) {
    t.error(err, 'should not error')
    t.ok(stderr.indexOf('WARN') !== -1, 'should warn if no command is found')
  })
})

test('Command line: without input', function (t) {
  t.plan(2)

  cp.exec(CMD, function (err, stdout, stderr) {
    // on machines without systemd, a warning will be logged to stderr
    t.error(err, 'should not error')
    t.ok(stderr.indexOf('WARN') !== -1, 'should warn if not installed')
  })
})

test('Command line: with input with flags start script', function (t) {
  var daemon = 'test.service'
  var project = 'test/fixtures/my-app'
  var fixture = require('./fixtures/my-app/package.json')

  cp.exec(CMD + ` ${project} --output ${daemon}`, function (err, stdout) {
    t.error(err, 'should not error')
    t.ok(fs.existsSync(daemon), 'service created')

    var file = fs.readFileSync(path.resolve(daemon), { encoding: 'utf-8' })
    t.ok(
      file.match(`WorkingDirectory=${path.resolve(project)}\n`),
      'has correct WorkingDir'
    )
    t.ok(
      file.match(`Description=${fixture.description}\n`),
      'has correct description'
    )
    t.ok(
      file.match(`ExecStart=${fixture.scripts.start}\n`),
      'has correct command'
    )

    fs.unlinkSync(daemon)
    t.end()
  })
})

test('Command line: without input with flags', function (t) {
  var daemon = 'test.service'

  cp.exec(CMD + ` --output ${daemon}`, function (err, stdout) {
    t.error(err, 'should not error')
    t.ok(fs.existsSync(daemon), 'service created')

    var file = fs.readFileSync(daemon, { encoding: 'utf-8' })
    t.ok(
      file.match(`WorkingDirectory=${process.cwd()}\n`),
      'has correct WorkingDir'
    )
    t.ok(
      file.match(`Description=${pjson.description}\n`),
      'has correct description'
    )
    t.ok(
      file.match(`ExecStart=(.+)${pjson.main}\n`),
      'has correct command'
    )

    fs.unlinkSync(daemon)
    t.end()
  })
})

test('Command line: input without flags', function (t) {
  t.plan(2)

  cp.exec(CMD + ` test/fixtures/my-other-app`, function (err, stdout, stderr) {
    t.error(err, 'should not error')
    t.ok(stderr.indexOf('WARN') !== -1, 'should warn if not installed')
  })
})

test('Command line: input with flags', function (t) {
  var daemon = 'test.service'
  var project = 'test/fixtures/my-other-app'
  var fixture = require('./fixtures/my-other-app/package.json')

  cp.exec(CMD + ` ${project} --output ${daemon}`, function (err, stdout) {
    t.error(err, 'should not error')
    t.ok(fs.existsSync(daemon), 'service created')

    var file = fs.readFileSync(path.resolve(daemon), { encoding: 'utf-8' })
    t.ok(
      file.match(`WorkingDirectory=${path.resolve(project)}\n`),
      'has correct WorkingDir'
    )
    t.ok(
      file.match(`Description=${fixture.description}\n`),
      'has correct description'
    )
    t.ok(
      file.match(`ExecStart=(.+)${fixture.main}\n`),
      'has correct command'
    )

    fs.unlinkSync(daemon)
    t.end()
  })
})

test('Command line: fail when no package json is found', function (t) {
  cp.exec(CMD + ` doesnotexist`, function (err, stdout) {
    t.plan(1)
    t.ok(
      err.toString().match('No package.json found!'),
      'should fail without package.json'
    )
  })
})
