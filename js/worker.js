/**
 * Created by s.evdokimov on 30.11.2016.
 */

importScripts('https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.6.0/socket.io.js');
var socket = io('http://localhost:4000/');
var connections = 0; // count active connections
var port;

self.addEventListener("connect", function (e) {
    port = e.ports[0];
    connections++;

    port.addEventListener("message", function (e) {
        // port.postMessage(e.data);
    }, false);

    port.start();
}, false);


socket.on('connect', function (res) {
    var data = JSON.stringify({type: 'connect', payload: res});
    port.postMessage(data);
});

socket.on('new user', function (res) {
    var data = JSON.stringify({type: 'new user', payload: res});
    port.postMessage(data);
});

socket.on('time passed', function(res){
    var data = JSON.stringify({type: 'time passed', payload: res});
    port.postMessage(data);
});
