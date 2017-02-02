const fs = require('fs')

function linkCheck(link) {
    let reg = /^(http|ftp|https|sftp|magnet):([\s\S]*)$/
    return reg.test(link)
}

exports.dialog = function(aria2) {
    let bus = new Vue()
    let type = Vue.component('add-source', {
        template: '#addSource',
        data: function() {
            return {
                show: false,
                step: 1,
                link: '',
            }
        },
        methods: {
            close: function() {
                this.show = false
                this.step = 1
                this.link = ''
            },
            goStep: function(num) {
                this.step = num
            },
            startFromLink: function() {
                const _this = this
                let source = _this.link.trim()
                if (linkCheck(source)) {
                    aria2.send('addUri', [source]).then(m => {
                        _this.show = false
                        _this.link = ''
                    }, err => {
                        console.log(err) //TODO: url error
                    })
                }
            },
            startFromTorrent: function(evt) {
                const _this = this
                const torrent = evt.target.files[0].path
                if (torrent) {
                    fs.readFile(torrent, 'base64', function(err, data) {
                        aria2.send('addTorrent', data).then(m => {
                            _this.show = false
                        }, err => {
                            console.log(err) //TODO: url error
                        })
                    })
                }
            },
            startFromMatelink: function(evt) {
                const _this = this
                const matelink = evt.target.files[0].path
                if (matelink) {
                    fs.readFile(matelink, 'base64', function(err, data) {
                        aria2.send('addMetalink', data).then(m => {
                            _this.show = false
                        }, err => {
                            console.log(err) //TODO: url error
                        })
                    })
                }
            }
        },
        mounted: function() {
            const _this = this
            bus.$on('showDialog', function() {
                _this.show = true
            })
        }
    })
    return bus
}