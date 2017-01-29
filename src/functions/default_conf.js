const join = require('path').join

module.exports = {
    "ARIA2_EXE": join(__dirname, '../../aria2/aria2c.exe'),
    "ARIA2_CONF": join(__dirname, '../../aria2/aria2.conf'),
    "ARIA2_LOG": join(__dirname, '../../aria2/aria2.log'),
    "ARIA2_SESSION": join(__dirname, '../../aria2/aria2.session'),
    "DOWN_PATH": join(__dirname, '../../downDir')
}