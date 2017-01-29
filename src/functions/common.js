const CONF = require('../../config.json')
const default_config = require('./default_conf')

exports.formatFileName = (value) => {
    let config = module.exports.getConfig()
    let val = value.toString().split('/')
    let fileName = val[val.length - 1]
    if (fileName) {
        if (fileName.length > 60) {
            return fileName.substr(0, 67) + '…'
        } else {
            return fileName
        }
    }
}

exports.formatByte = (value) => {
    if (value > 1024 * 1024) {
        return (value / 1024 / 1024).toFixed(2) + 'MB'
    } else {
        return (value / 1024).toFixed(2) + 'KB'
    }
}

exports.getConfig = () => {
    let obj = {}
    for (i in default_config) {
        if (CONF[i]) {
            obj[i] = CONF[i]
        } else {
            obj[i] = default_config[i]
        }
    }
    return obj
}