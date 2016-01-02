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
    t.error(err)
    t.ok(stdout.toLowerCase().indexOf(pjson.version) !== -1)
  })
})

test('Command line: help', function (t) {
  t.plan(2)

  cp.exec(CMD + ' --help', function (err, stdout) {
    t.error(err)
    t.ok(stdout.toLowerCase().indexOf('usage') !== -1)
  })
})

test('Command line: without input', function (t) {
  t.plan(2)

  cp.exec(CMD, function (err, stdout, stderr) {
    // on machines without systemd, a warning will be logged to stderr
    t.error(err)
    t.ok(stderr.indexOf('WARN') !== -1)
  })
})

test('Command line: without input with flags', function (t) {
  var daemon = 'test.service'

  cp.exec(CMD + ` --output ${daemon}`, function (err, stdout) {
    t.error(err)
    t.ok(fs.existsSync(daemon))

    var file = fs.readFileSync(daemon, { encoding: 'utf-8' })
    t.ok(file.match(`Description=${pjson.description}\n`))
    t.ok(file.match(`ExecStart=(.+)${path.resolve(pjson.main)}\n`))

    fs.unlinkSync(daemon)
    t.end()
  })
})

test('Command line: input without flags', function (t) {
  t.plan(2)

  cp.exec(CMD + ` test/fixtures`, function (err, stdout, stderr) {
    t.error(err)
    t.ok(stderr.indexOf('WARN') !== -1)
  })
})

test('Command line: input with flags', function (t) {
  var daemon = 'test.service'
  var fixture = require('./fixtures/package.json')

  cp.exec(CMD + ` test/fixtures --output ${daemon}`, function (err, stdout) {
    t.error(err)
    t.ok(fs.existsSync(daemon))

    var file = fs.readFileSync(path.resolve(daemon), { encoding: 'utf-8' })
    t.ok(file.match(`Description=${fixture.description}\n`))
    var mainPath = path.resolve('test', 'fixtures', fixture.main)
    t.ok(file.match(`ExecStart=(.+)${mainPath}\n`))

    fs.unlinkSync(daemon)
    t.end()
  })
})

test('Command line: fail when no package json is found', function (t) {
  cp.exec(CMD + ` doesnotexist`, function (err, stdout) {
    t.plan(1)
    t.ok(err.toString().match('No package.json found!'))
  })
})
