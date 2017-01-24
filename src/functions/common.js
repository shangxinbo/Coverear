exports.formatFileName = (value) => {
    let val = value.toString()
    if (val) {
        if (value.length > 60) {
            return value.substr(0, 67) + '…'
        } else {
            return value
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