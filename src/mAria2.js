const exec = require('child_process').execFile
const path = require('path')
const OS = require('os')
const config = require('./functions/common').getConfig()

exports.startJsonRPC = (callback) => {
    if (OS.type() == 'Windows_NT') {
        exec(config.ARIA2_EXE, [
            '--conf-path=' + config.ARIA2_CONF,
            '--dir=' + config.DOWN_PATH,
            '--log=' + config.ARIA2_LOG,
            '--input-file=' + config.ARIA2_SESSION,
            '--save-session=' + config.ARIA2_SESSION
        ], (error, stdout, stderr) => {
            if (callback) callback(error)
        })
        callback()
    } else {
        if (callback) callback('os is not support')
    }
}