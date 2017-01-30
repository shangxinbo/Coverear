const config = require('../../config.json')
const join = require('path').join
const fs = require('fs');

exports.dialog = function(aria2) {
    let bus = new Vue()
    let type = Vue.component('set-dialog', {
        template: '#setDialog',
        data: function() {
            return {
                show: false,
                rpc: config.ARIA2_EXE,
                dir: config.DOWN_PATH,
                proxy: config.ALL_PROXY
            }
        },
        methods: {
            close: function() {
                this.show = false
            },
            submit: function() {
                let _this = this
                let editJson = Object.assign({}, config, {
                    ARIA2_EXE: this.rpc,
                    DOWN_PATH: this.dir,
                    ALL_PROXY: this.proxy
                })
                fs.writeFile(join(__dirname, '../../config.json'), JSON.stringify(editJson), 'utf8', (err) => {
                    if (err) {
                        console.log(err)
                    } else {
                        //TODO: 成功提示
                        _this.show = false
                    }
                });
            }
        },
        mounted: function() {
            const _this = this
            bus.$on('showDialog', function() {
                _this.show = true
                    //TODO: charts of data
            })
        }
    })
    return bus
}