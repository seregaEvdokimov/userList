/**
 * Created by s.evdokimov on 08.11.2016.
 */

(function(App) {
    'use strict';

    function XHR(config) {
        this.xhr = new XMLHttpRequest();
        this.method = config.method;
        this.URL = config.URL;
        this.config = config.options;
        this.paramsBody = '';

        if('payload' in this.config) {
            this.paramsBody = this.createParamsBody(this.config.payload);
        }
    }

    XHR.prototype.sendRequest = function() {
        var self = this;
        return new Promise(function(resolve, reject) {
            self.xhr.open(self.method, self.URL, true);
            self.xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            self.xhr.addEventListener('readystatechange', self.readyStateChangeHandler.bind(self, resolve, reject));
            self.xhr.send(self.paramsBody);
        });
    };

    XHR.prototype.createParamsBody = function(data) {
        var str = '';
        for (var key in data) {
            str += key + '=' + encodeURIComponent(data[key] + '') + '&';
        }
        return str;
    };

    XHR.prototype.readyStateChangeHandler = function (resolve, reject) {
        if (this.xhr.readyState !== 4) {
            return;
        }
        if (this.xhr.status >= 200 && this.xhr.status < 300) {
            var pageResult = JSON.parse(this.xhr.responseText);
            resolve(this.config.success(pageResult));
        } else {
            var errorText = 'error: ' + (this.xhr.status ? this.xhr.statusText : 'problems with request');
            reject(this.config.error(errorText));
        }
    };

    App.Request.XHR = XHR;
})(App);
