// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const Aria2 = require('aria2')
const activeList = require('./components/active-list')
const completeList = require('./components/complete-list')
const pauseList = require('./components/pause-list')
const addSource = require('./components/add-source')
const detail = require('./components/detail')
const set = require('./components/set')
const statusBar = require('./components/status-bar')
const exec = require('child_process').exec

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
    let detailBus = detail.dialog(aria2)
    let setBus = set.dialog(aria2)
    let statusBus = statusBar.show()

    let app = new Vue({
        el: '#app',
        data: function() {
            return {
                nav: 1
            }
        },
        methods: { // 不能用箭头函数
            addUri: function(url) {
                typeBus.$emit('showDialog')
            },
            changeNav: function(num) {
                this.nav = num
            },
            showDetail: function() {
                detailBus.$emit('showDialog')
            },
            stop: function() {
                let checked = getCheck(this.nav)
                for (let i = 0; i < checked.length; i++) {
                    let gid = checked[i].getAttribute('id')
                    aria2.pause(gid).then('', err => {
                        console.log(err) //TODO: 报错提示
                    })
                }
            },
            start: function() {
                let checked = getCheck(this.nav)
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
                    switch (this.nav) {
                        case 1:
                            //TODO: 正在进行的下载不能直接删除，需要暂停再删除
                            break
                        case 2:
                            aria2.removeDownloadResult(gid).then('', err => {
                                console.log(err) //TODO: 报错提示
                            })
                            break
                        case 3:
                            aria2.remove(gid).then('', err => {
                                aria2.removeDownloadResult(gid).then('', err => {
                                    console.log(err) //TODO: 报错提示
                                })
                            })
                            break
                        default:
                            break;
                    }
                }
            },
            openFolder: function() {
                let checked = getCheck(this.nav)
                let path_arr = []
                for (let i = 0; i < checked.length; i++) {
                    let path = checked[i].getAttribute('path')
                    if (!path_arr.includes(path)) {
                        path_arr.push(path)
                    }
                }

                for (let j = 0; j < path_arr.length; j++) {
                    exec('start ' + path_arr[j], function(err) {
                        console.log(err)
                    })
                }
            },
            set: function() {
                setBus.$emit('showDialog')
            },
            redown: function() {
                //TODO: redown
            }
        }
    })


    aria2.onDownloadPause = function(m) {
        app.$data.nav = 3
    }

    aria2.onDownloadComplete = function(m) {
        app.$data.nav = 2
    }

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