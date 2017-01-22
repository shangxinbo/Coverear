const exec = require('child_process').execFile
const path = require('path')
const OS = require('os')

exports.startJsonRPC = (callback) => {
    if (OS.type() == 'Windows_NT') {
        let child_process_jsonRPC = exec(path.join(__dirname, '../aria2/aria2c.exe'), ['--conf-path=D:/github/xDownload/aria2/aria2.conf'], (error, stdout, stderr) => {
            if (callback) callback(error)
        })
        callback();
    } else {
        if (callback) callback('os is not support')
    }
}
