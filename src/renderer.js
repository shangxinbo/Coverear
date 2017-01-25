// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const Aria2 = require('aria2')
const activeList = require('./components/active-list')
const completeList = require('./components/complete-list')
const pauseList = require('./components/pause-list')
const chooseType = require('./components/choose-type')

let options = {
    host: 'localhost',
    port: 6800,
    secure: false,
    secret: '',
    path: '/jsonrpc'
}

let aria2 = new Aria2([options])

aria2.onmessage = function(m) {
    //console.log('aria2 IN', JSON.parse(JSON.stringify(m)))
}

// open WebSocket
aria2.open(function() {
    activeList.create(aria2)
    completeList.create(aria2)
    pauseList.create(aria2)
    let typeBus = chooseType.showType(aria2)

    new Vue({
        el: '#app',
        data: function() {
            return {
                nav: 1
            }
        },
        methods: { // 不能用箭头函数
            addUri: function(url) {
                typeBus.$emit('showDialog')
                    //dialogType.$data.show = true
                    //aria2.send('addUri', ['https://noto-website-2.storage.googleapis.com/pkgs/NotoSansCJKsc-hinted.zip']).then((m) => {})
            },
            changeNav: function(num) {
                this.nav = num
            },
            stop: function() {
                let checked = document.querySelectorAll('.active-list tbody input:checked')
                for (let i = 0; i < checked.length; i++) {
                    let gid = checked[i].getAttribute('data-gid')
                    aria2.pause(gid).then('', err => {
                        console.log(err) //TODO: 报错提示
                    })
                }
            },
            start: function() {
                let checked = document.querySelectorAll('.pause-list tbody input:checked')
                for (let i = 0; i < checked.length; i++) {
                    let gid = checked[i].getAttribute('data-gid')
                    aria2.unpause(gid).then('', err => {
                        console.log(err) //TODO: 报错提示
                    })
                }
            },
            del: function() {
                let checked = document.querySelectorAll('.table-list tbody input:checked')
                for (let i = 0; i < checked.length; i++) {
                    let gid = checked[i].getAttribute('data-gid')
                    aria2.remove(gid).then('', err => {
                        console.log(err) //TODO: 报错提示
                    })
                }
            }
        }
    })

    //https://download.jetbrains.com/webstorm/WebStorm-2016.3.2.exe
    //https://github.com/git-for-windows/git/releases/download/v2.11.0.windows.3/Git-2.11.0.3-64-bit.exe
    //magnet:?xt=urn:btih:22badeca61daa14ac97f73aa691b838520d27225&dn=The.Man.with.Thousand.Faces.2016.720p.BluRay.x264-BiPOLAR%5Brarbg%5D&tr=http%3A%2F%2Ftracker.trackerfix.com%3A80%2Fannounce&tr=udp%3A%2F%2F9.rarbg.me%3A2710%2Fannounce&//tr=udp%3A%2F%2F9.rarbg.to%3A2710%2Fannounce
})