// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

var Aria2 = require('aria2')
console.log(Aria2);

let options = {
  host: 'localhost',
  port: 6800,
  secure: false,
  secret: '',
  path: '/jsonrpc'
}
let aria2 = new Aria2([options]);

aria2.onopen = function() {
  console.log('aria2 open');
};

aria2.open().then(function(){
    console.log(123)
})
