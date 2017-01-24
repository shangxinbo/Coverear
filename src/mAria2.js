const exec = require('child_process').execFile
const path = require('path')
const OS = require('os')

exports.startJsonRPC = (callback) => {

    let ARIA2_EXEPATH = path.join(__dirname, '../aria2/aria2c.exe'),
        ARIA2_CONF = path.join(__dirname, '../aria2/aria2.conf'),
        ARIA2_LOG = path.join(__dirname, '../aria2/aria2.log'),
        ARIA2_SESSION = path.join(__dirname, '../aria2/aria2.session'),
        DOWN_PATH = path.join(__dirname, '../downDir')

    if (OS.type() == 'Windows_NT') {
        exec(ARIA2_EXEPATH, [
            '--conf-path=' + ARIA2_CONF,
            '--dir=' + DOWN_PATH,
            '--log=' + ARIA2_LOG,
            '--input-file=' + ARIA2_SESSION,
            '--save-session=' + ARIA2_SESSION
        ], (error, stdout, stderr) => {
            if (callback) callback(error)
        })
        callback()
    } else {
        if (callback) callback('os is not support')
    }
}