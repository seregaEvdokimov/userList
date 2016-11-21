/**
 * Created by s.evdokimov on 09.11.2016.
 */


(function(App, document) {

    function Row(options) {
        var self = this;

        this.el = document.createElement('tr');
        this.id = options.collection.id;
        this.container = options.collection;
        this.collection = options.collection;
        this.tbodyEl = options.tbodyEl;
        this.nodes = {};
        this.renderOrder = ['id', 'name' , 'email' , 'birth', 'date', 'del', 'edit'];
        this.fields = {
            id: function(user) {
                var idElement = document.createElement('td');
                idElement.className = 'id';
                idElement.textContent = user.id;

                self.nodes.id = idElement;
                return idElement;
            },
            name: function(user) {
                var nameElement = document.createElement('td');
                nameElement.className = 'name';
                nameElement.textContent = user.name;
                nameElement.dataset.tooltip = 'name';

                self.nodes.name = nameElement;
                return nameElement;
            },
            email: function(user) {
                var emailElement = document.createElement('td');
                emailElement.className = 'email';
                emailElement.textContent = user.email;
                emailElement.dataset.tooltip = 'email';

                self.nodes.email = emailElement;
                return emailElement;
            },
            birth: function(user) {
                var date = new Date(user.birth);
                var dateElement = document.createElement('td');
                dateElement.className = 'birth';
                dateElement.textContent = date.getDate() + '. ' + (date.getMonth() + 1) + '. ' + date.getFullYear();

                self.nodes.birt = dateElement;
                return dateElement;
            },
            date: function(user){
                var dateElement = document.createElement('td');
                dateElement.className = 'date';

                var leftTimeElement = document.createElement('div');
                leftTimeElement.className = 'left-time';
                leftTimeElement.textContent = self.calculateTime(user.date);

                var overlayElement = document.createElement('div');
                overlayElement.className = 'overlay';
                self.progress = new App.Lib.ProgressBarTimer({start: user.birth, end: user.date}, overlayElement);

                dateElement.appendChild(leftTimeElement);
                dateElement.appendChild(overlayElement);

                self.nodes.date = dateElement;
                return dateElement;
            },
            del: function() {
                var delElement = document.createElement('td');
                delElement.className = 'del';

                var delButton = document.createElement('a');
                delButton.textContent = 'Delete';
                delButton.className = 'delete-btn';

                delElement.appendChild(delButton);
                return delElement;
            },
            edit: function() {
                var editElement = document.createElement('td');
                editElement.className = 'edit';

                var editButton = document.createElement('a');
                editButton.textContent = 'Edit';
                editButton.className = 'edit-btn';

                editElement.appendChild(editButton);
                return editElement;
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