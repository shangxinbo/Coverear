exports.show = function(aria2) {
    //TODO: status bar
    let bus = new Vue()
    let type = Vue.component('status-bar', {
        template: '#statusBar',
        data: function() {
            return {
                show: false
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