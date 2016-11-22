/**
 * Created by s.evdokimov on 08.11.2016.
 */
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require("fs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
var siteUrl = "http://localhost:63342";
var pathToUsersList = "data/users.json";


app.options('/*', function (req, res) {
    addResponseHeaders(res);
    res.status(200);
    res.end();
});

app.post('/user', function (req, res) {
    fs.readFile(pathToUsersList, 'utf8', function (err, data) {
        if (err) {
            return console.log(err);
        } else {
            console.log(data);
            var users = JSON.parse(data);
            var model = req.body;
            var maxId = users.length + 1;

            model["id"] = maxId;

            users.push(model);
            model = JSON.stringify(model);
            users = JSON.stringify(users);

            fs.writeFile(pathToUsersList, users, 'utf8', function (err) {
                if (err) return console.log(err);
            });
            addResponseHeaders(res);
            res.status(201);
            res.end(model);
        }
    });
});

app.delete('/user', function (req, res) {
    fs.readFile(pathToUsersList, 'utf8', function (err, data) {
        if (err) {
            return console.log(err);
        } else {
            console.log(data);
            var id = parseInt(req.body.id);
            var users = JSON.parse(data);
            var removeIndex;
            users.forEach(function (item, index) {
                if (item['id'] === id) {
                    removeIndex = index;
                }
            });
            var deletedModel = users.splice(removeIndex, 1)[0];
            users = JSON.stringify(users);
            fs.writeFile(pathToUsersList, users, 'utf8', function (err) {
                if (err) return console.log(err);
            });
            addResponseHeaders(res);
            res.end(JSON.stringify(deletedModel));
        }
    });
});

app.put('/user', function (req, res) {
    fs.readFile(pathToUsersList, 'utf8', function (err, data) {
        if (err) {
            return console.log(err);
        } else {
            console.log(data);
            var users = JSON.parse(data);
            var model = req.body;
            var id = +parseInt(model['id']);
            model.id = id;

            var findIndex;
            users.forEach(function (item, index) {
                if (item['id'] === id) {
                    findIndex = index;
                }
            });

            users.splice(findIndex, 1, model);
            users = JSON.stringify(users);

            fs.writeFile(pathToUsersList, users, 'utf8', function (err) {
                if (err) return console.log(err);
            });

            model = JSON.stringify(model);
            addResponseHeaders(res);
            res.status(200);
            res.end(model);
        }
    });
});

app.get('/user', function (req, res) {
    fs.readFile(pathToUsersList, 'utf8', function (err, data) {
        if (err) {
            return console.log(err);
        } else {
            console.log(data);
            var users = JSON.parse(data);

            if(req.query.count) {
                var out = {count: users.length};
                addResponseHeaders(res);
                return res.end(JSON.stringify(out));
            }

            var model = req.query;
            var start = (model.start == 1) ? 0 : model.start;
            var limit = model.limit;

            var result = users.filter(function (item, index) {
                return index >= start && index < limit;
            });

            addResponseHeaders(res);
            res.end(JSON.stringify(result));
        }
    });
});

app.get('/tooltip', function (req, res) {
    fs.readFile(pathToUsersList, 'utf8', function (err, data) {
        if (err) {
            return console.log(err);
        } else {
            var users = JSON.parse(data);
            var model = req.query;

            var id = parseInt(model.id);
            var type = model.type;

            var find = users.filter(function (item, index) {
                return item['id'] === id;
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

            var out = JSON.stringify(result);
            addResponseHeaders(res);
            res.status(200);
            res.end(out);
        }
    });
});

function addResponseHeaders(obj) {
    obj.header('Access-Control-Allow-Origin', siteUrl);
    obj.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    obj.header('Access-Control-Allow-Headers', 'Content-Type');
}

var server = app.listen(4000, function () {
    console.log("Example app listening at http://localhost:4000")
});
