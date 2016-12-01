/**
 * Created by s.evdokimov on 14.11.2016.
 */

(function(App) {
    'use strict';

    function Timer(data, cb) {
        this.startTime = new Date(data.start).getTime();
        this.finishTime = new Date(data.end).getTime();
        this.intervalId = null;
        this.active = false;
        this.cb = cb;
    }

    Timer.prototype.update = function(data) {
        this.startTime = new Date(data.start).getTime();
        this.finishTime = new Date(data.end).getTime();
    };

    Timer.prototype.start = function() {
        var self = this;

        if(this.active === true) {
            return false;
        }

        this.active = true;
        this.intervalId = setInterval(function() {
            self.cb();
        }, 1000);
    };

    Timer.prototype.stop = function() {
        this.active = false;
        clearInterval(this.intervalId);
    };

    App.Lib.Timer = Timer;
})(App);