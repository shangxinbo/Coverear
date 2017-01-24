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
            startFromLink: function() {
                const _this = this
                if (this.link) {
                    aria2.send('addUri', [this.link]).then(m => {
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
                    aria2.send('addUri', [this.file]).then(m => {
                        this.show = false
                        this.link = ''
                    }, err => {
                        console.log(err) //TODO: url error
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