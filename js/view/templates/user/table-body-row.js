/**
 * Created by s.evdokimov on 09.11.2016.
 */


(function(App, document) {

    function Row(options) {
        var self = this;

        this.el = document.createElement('tr');
        this.id = options.collection.id;
        this.container = App.serviceContainer;
        this.collection = options.collection;
        this.tbodyEl = options.tbodyEl;
        this.dictionary = this.container.lib.dictionary;
        this.nodes = {};
        this.renderOrder = ['id', 'name' , 'email' , 'birth', 'date', 'del', 'edit'];
        this.fields = {
            id: function(user) {
                self.nodes.id = document.createElement('td');
                self.nodes.id.className = 'id';
                self.nodes.id.textContent = user.id;
                return self.nodes.id;
            },
            name: function(user) {
                self.nodes.name = document.createElement('td');
                self.nodes.name.className = 'name';
                self.nodes.name.textContent = user.name;
                self.nodes.name.dataset.tooltip = 'name';
                return self.nodes.name;
            },
            email: function(user) {
                self.nodes.email = document.createElement('td');
                self.nodes.email.className = 'email';
                self.nodes.email.textContent = user.email;
                self.nodes.email.dataset.tooltip = 'email';
                return self.nodes.email;
            },
            birth: function(user) {
                var date = new Date(user.birth);
                self.nodes.birt = document.createElement('td');
                self.nodes.birt.className = 'birth';
                self.nodes.birt.textContent = date.getDate() + '. ' + (date.getMonth() + 1) + '. ' + date.getFullYear();
                return self.nodes.birt;
            },
            date: function(user){
                self.nodes.date = document.createElement('td');
                self.nodes.date.className = 'date';

                var leftTimeElement = document.createElement('div');
                leftTimeElement.className = 'left-time';
                leftTimeElement.textContent = self.calculateTime(user.date);

                var overlayElement = document.createElement('div');
                overlayElement.className = 'overlay';
                self.progress = new App.Lib.ProgressBarTimer({start: user.birth, end: user.date}, overlayElement);

                self.nodes.date.appendChild(leftTimeElement);
                self.nodes.date.appendChild(overlayElement);
                return self.nodes.date;
            },
            del: function() {
                self.nodes.del = document.createElement('td');
                self.nodes.del.className = 'del';

                var delButton = document.createElement('a');
                delButton.dataset.languageKey = 'delete';
                delButton.textContent = self.dictionary.t(['userTable', 'tBody', 'delete']);
                delButton.className = 'delete-btn';

                self.nodes.del.appendChild(delButton);
                return self.nodes.del;
            },
            edit: function() {
                self.nodes.edit = document.createElement('td');
                self.nodes.edit.className = 'edit';

                var editButton = document.createElement('a');
                editButton.dataset.languageKey = 'edit';
                editButton.textContent = self.dictionary.t(['userTable', 'tBody', 'edit']);
                editButton.className = 'edit-btn';

                self.nodes.edit.appendChild(editButton);
                return self.nodes.edit;
            }
        };

        // components
        this.timer = new App.Lib.Timer({start: self.collection.birth, end: self.collection.date}, this.timerCb.bind(this));
        this.render();
    }

    Row.prototype.update = function(data) {
        var timerData = {};
        var avatar = {};

        for(var index in data) {
            if(index == 'timePassed') continue;

            var val = data[index];
            if(index == 'birth' || index == 'date') {
                timerData[index] = val;
            } else if(index == 'avatar') {
                avatar.img = val;
                avatar.name = data.name;
            } else {
                this.nodes[index].textContent = val;
            }
        }

        this.progress.update({start: timerData.birth, end: timerData.date});
        this.timer.update({start: timerData.birth, end: timerData.date});
    };

    Row.prototype.timerCb = function() {
        var leftTime = this.nodes.date.querySelector('.left-time');
        leftTime.textContent = this.calculateTime(this.timer.finishTime);
    };

    Row.prototype.init = function() {
        this.timer.start();
        this.progress.start();
        return this.el;
    };

    Row.prototype.destroy = function() {
        this.stop();
        this.tbodyEl.el.removeChild(this.el);
    };

    Row.prototype.stop = function() {
        this.timer.stop();
        this.progress.stop();
    };

    Row.prototype.render = function() {
        var arr = this.renderOrder;
        var fragment = document.createDocumentFragment();

        for(var i = 0; i < arr.length; i++){
            var field = arr[i];
            var el = this.fields[field](this.collection);
            fragment.appendChild(el);
        }

        this.el.appendChild(fragment);
        return this.el;
    };

    Row.prototype.calculateTime = function(endTime) {
        var currentDate = new Date().getTime();
        endTime = new Date(endTime).getTime();

        var difference = endTime - currentDate;
        var time =  difference / 1000; // to second

        var seconds = Math.floor(time % 60);
        time = time / 60;

        var minutes = Math.floor(time % 60);
        time = time / 60;

        var hours = Math.floor(time % 24);
        time = time / 24;

        var days = Math.floor(time % 30);
        time = time / 30;

        var month = Math.floor(time % 12);
        var years = Math.floor(time / 12);

        var timeLeft = {
            years: years,
            months: month,
            days: days,
            hours: hours,
            minutes: minutes,
            seconds: seconds
        };

        var dateString = '';
        for (var key in timeLeft) {
            dateString += key + ': ' + timeLeft[key] + ', ';
        }

        return dateString;
    };

    App.View.UserTable.Body.Row = Row;
})(App, document);