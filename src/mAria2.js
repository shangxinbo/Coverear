const exec = require('child_process').execFile
const spawn = require('child_process').spawn
const path = require('path')
const OS = require('os')
const config = require('./functions/common').getConfig()

exports.startJsonRPC = (callback) => {
    if (OS.type() == 'Windows_NT') {
        let child = spawn(config.ARIA2_EXE, [
            '--conf-path=' + config.ARIA2_CONF,
            '--dir=' + config.DOWN_PATH,
            '--log=' + config.ARIA2_LOG,
            '--input-file=' + config.ARIA2_SESSION,
            '--save-session=' + config.ARIA2_SESSION
        ])
        let run = 1;
        child.stdout.on('data', (data) => {
            console.log(data.toString('utf-8'))
            if (callback && run) {
                callback()
                run = 0;
            }
        });
        child.on('error', function(err) {
            console.log('aria2子进程意外错误：' + err);
        })
    } else {
        if (callback) callback('os is not support')
    }
}