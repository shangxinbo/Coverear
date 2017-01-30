const fs = require('fs')

function linkCheck(link) {
    let reg = /^(http|ftp|https|sftp|magnet):\/\/([\s\S]*)$/
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
                torrent: '',
                matelink: ''
            }
        },
        methods: {
            close: function() {
                this.show = false
                this.step = 1
                this.link = ''
                this.torrent = ''
                this.matelink = ''
            },
            goStep: function(num) {
                this.step = num
            },
            changeTorrent: function(evt) {
                this.torrent = evt.target.files[0].path
            },
            changeMatelink: function(evt) {
                this.matelink = evt.target.files[0].path
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
            startFromTorrent: function() {
                const _this = this
                if (this.torrent) {
                    fs.readFile(_this.torrent, 'base64', function(err, data) {
                        aria2.send('addTorrent', data).then(m => {
                            _this.show = false
                            _this.torrent = ''
                        }, err => {
                            console.log(err) //TODO: url error
                        })
                    })
                }
            },
            startFromMatelink: function() {
                const _this = this
                if (this.matelink) {
                    fs.readFile(_this.matelink, 'base64', function(err, data) {
                        aria2.send('addMetalink', data).then(m => {
                            _this.show = false
                            _this.matelink = ''
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