// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

var Aria2 = require('aria2')

let options = {
    host: 'localhost',
    port: 6800,
    secure: false,
    secret: '',
    path: '/jsonrpc'
}
let aria2 = new Aria2([options]);

aria2.onsend = function (m) {
    //console.log('aria2 OUT', m);
};

aria2.onmessage = function (m) {
    //console.log('aria2 IN', m);
};

// open WebSocket
aria2.open(function () {

    Vue.component('active-list', {
        template: '#activeList',
        props:['nav'],
        data: function () {
            return {
                list: []
            }
        },
        mounted: function () {
            let _this = this
            setInterval(() => {
                aria2.send('tellActive').then(function (m) {
                    _this.list = m
                })
            }, 20000)
        }
    })
    Vue.component('complete-list', {
        template: '#completeList',
        props:['nav'],
        data: function () {
            return {
                list: []
            }
        },
        mounted: function () {
            let _this = this
            aria2.send('tellStopped', 0, 10).then(function (m) {
                _this.list = m
            })
        },
        methods: {
            del: function (gid) {
                aria2.send('remove', gid)
            }
        }
    })

    let dobtn = new Vue({
        el: '#tabNav',
        data: function () {
            return {
                nav: 1
            }
        },
        methods: {
            addUri: function (url) {
                aria2.send('addUri', ['https://download.jetbrains.com/webstorm/WebStorm-2016.3.2.exe']).then((m) => {
                })
            },
            changeNav: function (num) {
                this.nav = num;
            }
        }
    })

    //https://download.jetbrains.com/webstorm/WebStorm-2016.3.2.exe
    //https://github.com/git-for-windows/git/releases/download/v2.11.0.windows.3/Git-2.11.0.3-64-bit.exe
    //magnet:?xt=urn:btih:22badeca61daa14ac97f73aa691b838520d27225&dn=The.Man.with.Thousand.Faces.2016.720p.BluRay.x264-BiPOLAR%5Brarbg%5D&tr=http%3A%2F%2Ftracker.trackerfix.com%3A80%2Fannounce&tr=udp%3A%2F%2F9.rarbg.me%3A2710%2Fannounce&//tr=udp%3A%2F%2F9.rarbg.to%3A2710%2Fannounce
})