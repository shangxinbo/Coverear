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
        props: ['nav'],
        data: function () {
            return {
                list: []
            }
        },
        filters: {
            fileName: formatFileName,
            speed: function (value) {
                if (value > 1024 * 1024) {
                    return (value / 1024 / 1024).toFixed(2) + 'MB/s'
                } else {
                    return (value / 1024).toFixed(2) + 'KB/s'
                }
            },
            byte: formatByte
        },
        methods: {
            checkAllToggle: (evt) => {
                let checked = evt.target.checked
                let listCheckbox = document.querySelectorAll('.active-list tbody input[type="checkbox"]')
                for (let i = 0; i < listCheckbox.length; i++) {
                    listCheckbox[i].checked = checked;
                }
            },
            changeAllStatus: (evt) => {
                let checked = evt.target.checked
                if (!checked) {
                    document.querySelector('.active-list thead input[type="checkbox"]').checked = false;
                }
            }
        },
        mounted: function () {
            let _this = this
            setInterval(() => {
                aria2.send('tellActive').then(function (m) {
                    _this.list = m
                    for (let i = 0; i < _this.list.length; i++) {
                        let vs = _this.list[i]
                        percent = (vs['completedLength'] / vs['totalLength']).toFixed(3) * 100
                        _this.list[i].style = 'background: linear-gradient(to right,#ABF2F2 ' + percent + '%, #fff ' + percent + '%)'
                    }
                })
            }, 2000)
        }
    })
    Vue.component('complete-list', {
        template: '#completeList',
        props: ['nav'],
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

    Vue.component('pause-list', {
        template: '#pauseList',
        props: ['nav'],
        data: function () {
            return {
                list: []
            }
        },
        filters: {
            fileName: formatFileName,
            speed: function (value) {
                if (value > 1024 * 1024) {
                    return (value / 1024 / 1024).toFixed(2) + 'MB/s'
                } else {
                    return (value / 1024).toFixed(2) + 'KB/s'
                }
            },
            byte: formatByte
        },
        methods: {
            checkAllToggle: (evt) => {
                let checked = evt.target.checked
                let listCheckbox = document.querySelectorAll('.active-list tbody input[type="checkbox"]')
                for (let i = 0; i < listCheckbox.length; i++) {
                    listCheckbox[i].checked = checked;
                }
            },
            changeAllStatus: (evt) => {
                let checked = evt.target.checked
                if (!checked) {
                    document.querySelector('.active-list thead input[type="checkbox"]').checked = false;
                }
            }
        },
        mounted: function () {
            let _this = this
            setInterval(() => {
                aria2.send('tellWaiting', 0, 10).then(m => {
                    _this.list = m
                    for (let i = 0; i < _this.list.length; i++) {
                        let vs = _this.list[i]
                        percent = (vs['completedLength'] / vs['totalLength']).toFixed(3) * 100
                        _this.list[i].style = 'background: linear-gradient(to right,#ABF2F2 ' + percent + '%, #fff ' + percent + '%)'
                    }
                }, err => {
                    console.log(err)
                })
            }, 2000)
        }
    })


    let dobtn = new Vue({
        el: '#tabNav',
        data: function () {
            return {
                nav: 1
            }
        },
        methods: {    // 不能用箭头函数
            addUri: function (url) {
                aria2.send('addUri', ['https://noto-website-2.storage.googleapis.com/pkgs/NotoSansCJKsc-hinted.zip']).then((m) => {
                })
            },
            changeNav: function (num) {
                this.nav = num;
            },
            stop: function () {
                let checked = document.querySelectorAll('.active-list tbody input:checked')
                for (let i = 0; i < checked.length; i++) {
                    let gid = checked[i].getAttribute('data-gid')
                    aria2.pause(gid).then('', err => {
                        console.log(err) //TODO: 报错提示
                    })
                }
            },
            start: function () {
                let checked = document.querySelectorAll('.pause-list tbody input:checked')
                for (let i = 0; i < checked.length; i++) {
                    let gid = checked[i].getAttribute('data-gid')
                    aria2.unpause(gid).then('', err => {
                        console.log(err) //TODO: 报错提示
                    })
                }
            },
            del: function () {
                let checked = document.querySelectorAll('.active-list tbody input:checked')
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

function formatFileName(value) {
    let val = value.toString()
    if (val) {
        if (value.length > 60) {
            return value.substr(0, 67) + '…'
        } else {
            return value
        }
    }
}
function formatByte(value) {
    if (value > 1024 * 1024) {
        return (value / 1024 / 1024).toFixed(2) + 'MB'
    } else {
        return (value / 1024).toFixed(2) + 'KB'
    }
}