
/**
 * Created by s.evdokimov on 30.11.2016.
 */

(function() {
    'use strict';

    self.importScripts('https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.6.0/socket.io.js');
    var socket = io('http://localhost:4000/');
    var connections = 0; // count active connections
    var ports = [];

    self.addEventListener("connect", function (e) {
        var port = e.ports[0];
        ports.push(port);
        port.start();
        // connections++;

        port.addEventListener("message", function (e) {
            // port.postMessage(e.data);
        }, false);
    }, false);


    socket.on('connect', function (res) {
        var data = JSON.stringify({type: 'connect', payload: res});
        ports.forEach(function(item) {
            item.postMessage(data);
        });
    });

    socket.on('new user', function (res) {
        var data = JSON.stringify({type: 'new user', payload: res});
        ports.forEach(function(item) {
            item.postMessage(data);
        });
    });

    socket.on('time passed', function(res){
        var data = JSON.stringify({type: 'time passed', payload: res});
        ports.forEach(function(item) {
            item.postMessage(data);
        });
    });
})();


