/**
 * Created by s.evdokimov on 15.11.2016.
 */

(function() {
    'use strict';

    function ProgressBarTimer(data, element) {
        this.element = element;
        this.startTime = new Date(data.start).getTime();
        this.finishTime = new Date(data.end).getTime();
        this.className = '';
        this.percent = null;
        this.timer = new App.Lib.Timer({start: data.start, end: data.end}, this.timerCb.bind(this));

        this.progressCalc();
        this.showProgress();
    }

    ProgressBarTimer.prototype.start = function() {
        this.timer.start();
    };

    ProgressBarTimer.prototype.stop = function() {
        this.timer.stop();
    };

    ProgressBarTimer.prototype.timerCb = function() {
        this.progressCalc();
        this.showProgress();
    };

    ProgressBarTimer.prototype.getClassName = function() {
        return this.className;
    };

    ProgressBarTimer.prototype.getPercent = function() {
        return this.percent;
    };

    ProgressBarTimer.prototype.update = function(data) {
        this.startTime = new Date(data.start).getTime();
        this.finishTime = new Date(data.end).getTime();

        this.progressCalc();
        this.showProgress();
    };

    ProgressBarTimer.prototype.showProgress = function() {
        this.getClassName() == 'positive'
            ? this.element.classList.remove('negative')
            : this.element.classList.remove('positive');

        this.element.style.width = this.getPercent() + '%';
        this.element.classList.add(this.getClassName());
    };

    ProgressBarTimer.prototype.progressCalc = function() {
        var difference = this.finishTime - this.startTime;
        var current = Date.now() - this.startTime;
        this.percent = current * 100 / difference;

        this.className = (this.percent >= 0 && this.percent <= 100) ? 'positive': 'negative';
        this.percent = (this.percent >= 0 && this.percent <= 100) ? this.percent : 100;
    };

    App.Lib.ProgressBarTimer = ProgressBarTimer;
})(App);