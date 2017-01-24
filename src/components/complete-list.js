const formatFileName = require('../functions/common').formatFileName
const formatByte = require('../functions/common').formatByte

exports.create = function(aria2) {
    Vue.component('complete-list', {
        template: '#completeList',
        props: ['nav'],
        data: function() {
            return {
                list: []
            }
        },
        mounted: function() {
            let _this = this
            aria2.send('tellStopped', 0, 10).then(function(m) {
                _this.list = m
            })
        },
        methods: {
            del: function(gid) {
                aria2.send('remove', gid)
            }
        }
    })
}