const fs = require('fs')

exports.showType = function(aria2) {
    let bus = new Vue()
    let type = Vue.component('choose-type', {
        template: '#chooseType',
        data: function() {
            return {
                show: false,
                step: 1,
                link: '',
                file: ''
            }
        },
        methods: {
            close: function() {
                this.show = false
                this.step = 1
                this.link = ''
                this.file = ''
            },
            goStep: function(num) {
                this.step = num
            },
            changeFile: function(evt) {
                this.file = evt.target.files[0].path
            },
            startFromLink: function() {
                const _this = this
                let source = _this.link
                if (this.link) {
                    if (this.link.indexOf('thunder://') >= 0) {
                        let decodeUrl = new Buffer(this.link.replace('thunder://', ''), 'base64').toString()
                        source = decodeUrl.substr(2, decodeUrl.length - 4)
                    }
                    aria2.send('addUri', [source]).then(m => {
                        this.show = false
                        this.link = ''
                    }, err => {
                        console.log(err) //TODO: url error
                    })
                }
            },
            startFromFile: function() {
                const _this = this
                if (this.file) {
                    fs.readFile(_this.file, 'base64', function(err, data) {
                        aria2.send('addTorrent', data).then(m => {
                            _this.show = false
                            _this.file = ''
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