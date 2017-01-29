exports.dialog = function(aria2) {
    let bus = new Vue()
    let type = Vue.component('set-dialog', {
        template: '#setDialog',
        data: function() {
            return {
                show: false
            }
        },
        methods: {
            close: function() {
                this.show = false
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