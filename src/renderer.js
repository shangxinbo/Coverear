// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const Aria2 = require('aria2')
const activeList = require('./components/active-list')
const completeList = require('./components/complete-list')
const pauseList = require('./components/pause-list')
const addSource = require('./components/add-source')

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
    let typeBus = addSource.dialog(aria2)

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
                    //aria2.send('addUri', ['https://noto-website-2.storage.googleapis.com/pkgs/NotoSansCJKsc-hinted.zip']).then((m) => {})
            },
            changeNav: function(num) {
                this.nav = num
            },
            stop: function() {
                let checked = getCheck(this.nav)
                for (let i = 0; i < checked.length; i++) {
                    let gid = checked[i].getAttribute('id')
                    console.log(gid)
                    aria2.pause(gid).then('', err => {
                        console.log(err) //TODO: 报错提示
                    })
                }
            },
            start: function() {
                let checked = getCheck(this.nav)
                console.log(this.nav)
                for (let i = 0; i < checked.length; i++) {
                    let gid = checked[i].getAttribute('id')
                    aria2.unpause(gid).then('', err => {
                        console.log(err) //TODO: 报错提示
                    })
                }
            },
            del: function() {
                let checked = getCheck(this.nav)
                for (let i = 0; i < checked.length; i++) {
                    let gid = checked[i].getAttribute('id')
                    aria2.remove(gid).then('', err => {
                        console.log(err) //TODO: 报错提示
                    })
                }
            },
            set: function() {
                //TODO: 
            }
        }
    })
})


function getCheck(nav) {
    if (nav == 1) {
        return document.querySelectorAll('.active-list input:checked')
    } else if (nav == 2) {
        return document.querySelectorAll('.complete-list input:checked')
    } else if (nav == 3) {
        return document.querySelectorAll('.pause-list input:checked')
    } else {
        return null
    }
}