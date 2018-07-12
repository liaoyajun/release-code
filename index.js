#!/usr/bin/env node
var path = require('path')
// var exec = require('child_process').exec
require('shelljs/global')
var Client = require('ssh2').Client
var conn = new Client()
var sshModel = require('./ssh')
var ssh = new sshModel(conn)
var host = require('./host.json')
const argv = require('yargs')
    .option('p', {
        alias: 'path',
        demand: true,
        describe: 'project path name in workspace'
    })
    .option('r', {
        alias: 'remote',
        describe: 'your project path in remote host'
    })
    .usage('Usage: release [options]')
    .example('release -p myproject', 'publish myproject')
    .help('h')
    .alias('h', 'help')
    .argv;
const packageConfig = require('./package.json')
const projectName = argv.path
const workspace = packageConfig.workspace
const projectPath = path.join(workspace, projectName)
cd(projectPath)
exec('npm run build')
exec('git add .')
exec('git commit -m "xx"')
exec('git push origin master')
ssh.connect(host)
// ssh.sshExec(`cd ${argv.remote} && git pull`)
ssh.sshExec(`cd ${argv.remote} && git reset --hard`)
