/**
 * Created by s.evdokimov on 08.11.2016.
 */
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var bodyParser = require('body-parser');
var fs = require("fs");
var faker = require("faker");

var siteUrl = "http://localhost:63342";
var backAPI = {
    pathToUsersList: "data/users.json",
    userData: [],

    init: function() {
        var self = this;
        fs.readFile(this.pathToUsersList, 'utf8', function (err, data) {
            if (err) return console.log(err);
            self.userData = JSON.parse(data);
        });

        return this;
    },
    rewriteData: function(type, data) {
        var pathToFile = '';
        switch(type) {
            case 'user':
                pathToFile = this.pathToUsersList;
                break;
        }

        data = JSON.stringify(data);
        fs.writeFile(pathToFile, data, 'utf8', function (err) {
            if (err) return console.log(err);
        });
    },
    user: function(type, data) {
        var result = [];
        switch(type) {
            case 'get':
                result = this.getUsers(data);
                break;
            case 'create':
                result = this.createUser(data);
                break;
            case 'update':
                result = this.updateUser(data);
                break;
            case 'delete':
                result = this.deleteUser(data);
                break;
        }

        return result;
    },
    tooltip: function(type, data) {
        var result = [];
        switch(type) {
            case 'get':
                result = this.getTooltip(data);
                break;
        }

        return result;
    },
    getUsers: function(data) {
        var self = this;
        if(data.count) return JSON.stringify({count: self.userData.length});

        var start = (data.start == 1) ? 0 : data.start;
        var limit = data.limit;

        var result = this.userData.filter(function (item, index) {
            return index >= start && index < limit;
        });

        return JSON.stringify(result);
    },
    createUser: function(data) {
        var uniqId = parseInt(this.userData[this.userData.length - 1].id) + 1;
        data.id = uniqId;
        data.timePassed = ('boolean' == typeof data.timePassed) ? data.timePassed : !data.timePassed;

        this.userData.push(data);
        this.rewriteData('user', this.userData);
        return JSON.stringify(data);
    },
    updateUser: function(data) {
        data.id = parseInt(data.id);
        data.timePassed = ('boolean' == typeof data.timePassed) ? data.timePassed : !data.timePassed;

        var findIndex;
        this.userData.forEach(function (item, index) {
            if (item.id === data.id) {
                findIndex = index;
            }
        });

        this.userData.splice(findIndex, 1, data);
        this.rewriteData('user', this.userData);
        return JSON.stringify(data);
    },
    deleteUser: function(data) {
        var removeIndex;
        this.userData.forEach(function(item, index) {
            if (item.id == data.id) {
                removeIndex = index;
            }
        });

        var deletedUser = this.userData.splice(removeIndex, 1)[0];
        this.rewriteData('user', this.userData);
        return JSON.stringify(deletedUser);
    },
    getTooltip: function (data) {
        var id = parseInt(data.id);
        var type = data.type;

        var find = this.userData.filter(function (item, index) {
            return item.id === id;
        });

        find = find[0];

        var result = {};
        switch(type) {
            case 'name':
                result.img = find.avatar;
                result.text = find.name;
                break;
            case 'email':
                result.text = Math.floor(Math.random() * 100);
                break;
        }

        return JSON.stringify(result);
    }
}.init();

server.listen(4000);
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.options('/*', function (req, res) {
    addResponseHeaders(res);
    res.status(200);
    res.end();
});

app.post('/user', function (req, res) {
    var result = backAPI.user('create', req.body);
    addResponseHeaders(res);
    res.end(result);
});

app.delete('/user', function (req, res) {
    var result = backAPI.user('delete', req.body);
    addResponseHeaders(res);
    res.end(result);
});

app.put('/user', function (req, res) {
    var result = backAPI.user('update', req.body);
    addResponseHeaders(res);
    res.end(result);
});

app.get('/user', function (req, res) {
    var result = backAPI.user('get', req.query);
    addResponseHeaders(res);
    res.end(result);
});

app.get('/tooltip', function (req, res) {
    var result = backAPI.tooltip('get', req.query);
    addResponseHeaders(res);
    res.end(result);
});

function addResponseHeaders(obj) {
    obj.header('Access-Control-Allow-Origin', siteUrl);
    obj.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    obj.header('Access-Control-Allow-Headers', 'Content-Type');
}


var socketIntervals = {};
function checkForUpdates(socket) {
    socketIntervals.createUserInterval = setInterval(function() {
        var user = {
            id: null,
            name: faker.name.findName(),
            email: faker.internet.email(),
            date: faker.date.future(),
            birth: faker.date.recent(),
            avatar: faker.image.avatar(),
            timePassed: false
        };

        backAPI.user('create', user);
        socket.emit('new user', user);
    }, 60000);

    socketIntervals.timePassedInterval = setInterval(function() {
        var result = backAPI.userData.reduce(function(acc, item) {
            if(item.timePassed) return acc;

            var startTime = Date.now();
            var finishTime = new Date(item.date).getTime();

            if(startTime > finishTime) {
                item.timePassed = true;
                backAPI.user('update', item);
                acc.push(item);
            }

            return acc;
        }, []);

        if(result.length) socket.emit('time passed', result);
    }, 1000);
}
function clearUpdateIntervals() {
    for(var index in socketIntervals) {
        var interval = socketIntervals[index];
        clearInterval(interval);
    }
}

io.on('connection', function(socket) {
    console.log('connect');
    socket.emit('connect');
    checkForUpdates(socket);

    socket.on('disconnect', function () {
        clearUpdateIntervals();
        console.log('disconnect');
    });
});
