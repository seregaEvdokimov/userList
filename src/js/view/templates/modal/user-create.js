/**
 * Created by s.evdokimov on 09.11.2016.
 */

(function(App, document) {
    'use strict';

    function CreateUser(option) {
        var self = this;

        this.el = document.createElement('div');
        this.el.className = 'modal-window modal-create';
        this.el.dataset.languageKey = 'create';
        this.modalEl = option.modalEl;
        this.collection = option.collection;
        this.container = App.serviceContainer;
        this.modalType = 'create';
        this.isShow = false;
        this.dictionary = this.container.lib.dictionary;
        this.nodes = {};
        this.renderOrder = ['caption', 'avatar', 'name', 'email', 'birth', 'date', 'control'];
        this.fields = {
            caption: function(){
                self.nodes.caption = document.createElement('h3');
                self.nodes.caption.className = 'caption';
                self.nodes.caption.dataset.languageKey = 'caption';
                self.nodes.caption.textContent = self.dictionary.t(['modal', self.modalType, 'caption']);
                return self.nodes.caption;
            },
            avatar: function(){
                self.nodes.avatar = document.createElement('div');
                self.nodes.avatar.className = 'group avatar-group';

                var nameLabel = document.createElement('label');
                nameLabel.dataset.languageKey = 'avatar';
                nameLabel.textContent = self.dictionary.t(['modal', self.modalType, 'avatar']);
                nameLabel.className = 'avatar-label';

                var nameInput = document.createElement('input');
                nameInput.setAttribute('type', 'file');
                nameInput.setAttribute('name', 'avatar');
                nameInput.addEventListener('change', self.imageUpload.bind(self, self));
                nameInput.className = 'file-input';
                self.inputs.avatar = nameInput;

                self.nodes.avatar.appendChild(nameLabel);
                self.nodes.avatar.appendChild(nameInput);
                return self.nodes.avatar;
            },
            name: function(){
                self.nodes.name = document.createElement('div');
                self.nodes.name.className = 'group name-group';

                var nameLabel = document.createElement('label');
                nameLabel.dataset.languageKey = 'name';
                nameLabel.textContent = self.dictionary.t(['modal', self.modalType, 'name']);
                nameLabel.className = 'name-label';

                var nameInput = document.createElement('input');
                nameInput.setAttribute('type', 'text');
                nameInput.setAttribute('name', 'name');
                nameInput.className = 'name-input';
                self.inputs.name = nameInput;

                self.nodes.name.appendChild(nameLabel);
                self.nodes.name.appendChild(nameInput);
                return self.nodes.name;
            },
            email: function(){
                self.nodes.email = document.createElement('div');
                self.nodes.email.className = 'group email-group';

                var nameLabel = document.createElement('label');
                nameLabel.dataset.languageKey = 'email';
                nameLabel.textContent = self.dictionary.t(['modal', self.modalType, 'email']);
                nameLabel.className = 'email-label';

                var nameInput = document.createElement('input');
                nameInput.setAttribute('type', 'text');
                nameInput.setAttribute('name', 'email');
                nameInput.className = 'email-input';
                self.inputs.email = nameInput;

                self.nodes.email.appendChild(nameLabel);
                self.nodes.email.appendChild(nameInput);
                return self.nodes.email;
            },
            birth: function(){
                self.nodes.birth = document.createElement('div');
                self.nodes.birth.className = 'group date-group';

                var nameLabel = document.createElement('label');
                nameLabel.dataset.languageKey = 'birth';
                nameLabel.textContent = self.dictionary.t(['modal', self.modalType, 'birth']);
                nameLabel.className = 'date-label';

                var dateInput = document.createElement('input');
                dateInput.setAttribute('type', 'date');
                dateInput.setAttribute('name', 'birth');
                dateInput.className = 'birth-input';
                self.inputs.birth = dateInput;

                self.nodes.birth.appendChild(nameLabel);
                self.nodes.birth.appendChild(dateInput);
                return self.nodes.birth;
            },
            date: function(){
                self.nodes.time = document.createElement('div');
                self.nodes.time.className = 'group date-group';

                var nameLabel = document.createElement('label');
                nameLabel.dataset.languageKey = 'time';
                nameLabel.textContent = self.dictionary.t(['modal', self.modalType, 'time']);
                nameLabel.className = 'date-label';

                var dateInput = document.createElement('input');
                dateInput.setAttribute('type', 'date');
                dateInput.setAttribute('name', 'date');
                dateInput.className = 'date-input';
                self.inputs.date = dateInput;

                var timeInput = document.createElement('input');
                timeInput.setAttribute('type', 'time');
                timeInput.setAttribute('name', 'time');
                timeInput.className = 'time-input';
                self.inputs.time = timeInput;

                self.nodes.time.appendChild(nameLabel);
                self.nodes.time.appendChild(dateInput);
                self.nodes.time.appendChild(timeInput);
                return self.nodes.time;
            },
            control: function(){
                self.nodes.control = document.createElement('div');
                self.nodes.control.className = 'group control-group';

                var addBtn = document.createElement('button');
                addBtn.className = 'add-btn';
                addBtn.dataset.languageKey = 'save';
                addBtn.textContent = self.dictionary.t(['modal', self.modalType, 'save']);

                var cancelBtn = document.createElement('button');
                cancelBtn.className = 'cancel-btn';
                cancelBtn.dataset.languageKey = 'cancel';
                cancelBtn.textContent = self.dictionary.t(['modal', self.modalType, 'cancel']);

                self.nodes.control.appendChild(addBtn);
                self.nodes.control.appendChild(cancelBtn);
                return self.nodes.control;
            }
        };
        this.inputs = {};
        this.avatar = null;

        // components
        this.uploader = new App.Lib.ImageUploader();

        // listeners
        this.el.addEventListener('click', this.handlerControlBtn.bind(this, this));

        // put to container
        App.serviceContainer.template.modalCreate = this;
    }

    CreateUser.prototype.handlerControlBtn = function(self, event) {
        var el = event.target;

        if(el.tagName != 'BUTTON') {
            return false;
        }

        switch(el.className) {
            case 'cancel-btn':
                self.beforeHide('cancel');
                break;
            case 'add-btn':
                self.chekForm();
                break;
        }
    };

    CreateUser.prototype.imageUpload = function(self, event) {
        var el = event.target;
        el.classList.remove('error');
        el.classList.remove('success');

        this.uploader.read(el, this.onImageUploadSuccess.bind(self));
    };

    CreateUser.prototype.onImageUploadSuccess = function(file) {
        this.avatar = file;
    };

    CreateUser.prototype.chekForm = function() {
        var validator = App.Lib.Validator;
        var dateTimeFinish = {};
        var valid = true;

        for(var index in this.inputs) {
            var result;
            var node = this.inputs[index];
            var value = this.inputs[index].value;

            node.classList.remove('success');
            node.classList.remove('error');

            switch(index) {
                case 'id':
                    continue;
                case 'avatar':
                    result = validator.checkImage(node);
                break;
                case 'name':
                    result = validator.checkName(value);
                break;
                case 'email':
                    result = validator.checkEmail(value);
                break;
                case 'birth':
                    result = validator.checkStartDate({date: value});
                break;
                case 'date':
                    dateTimeFinish.date = value;
                break;
                case 'time':
                    dateTimeFinish.time = value;
                break;
                default:
                    console.warn('Unknown type of validator');
                break;
            }

            node.classList.add(result.className);
            valid = result.valid;

            if(!valid) break;
        }

        valid = (valid) ? this.chekDate(dateTimeFinish) : false;
        if(!valid) return false;

        var pick = this.pickData();
        this.send(pick);
        this.beforeHide('save');
    };

    CreateUser.prototype.chekDate = function(data) {
        var result = App.Lib.Validator.checkFinishDate(data);

        this.inputs.date.classList.add(result.className);
        this.inputs.time.classList.add(result.className);

        return result.valid;
    };

    CreateUser.prototype.pickData = function() {
        var strTime = this.inputs.date.value + ' ' + this.inputs.time.value;
        var data = {
            id: (this.inputs.id) ? this.inputs.id.value : null,
            name: this.inputs.name.value,
            email: this.inputs.email.value,
            date: new Date(strTime),
            birth: new Date(this.inputs.birth.value),
            avatar: this.avatar,
            timePassed: false
        };

        return data;
    };

    CreateUser.prototype.send = function(data) {
        var self = this;
        var user = this.container.model.user;
        user.create(data).then(function(res) {
            self.container.template.userTableTbody.createRow(res);
        });
    };

    CreateUser.prototype.beforeHide = function(status) {
        for(var index in this.inputs) {
            var input = this.inputs[index];

            input.classList.remove('error');
            input.classList.remove('success');
            input.value = '';

            if(index == 'avatar') {
                var parent = input.parentNode;
                var img = parent.querySelector('img');
                if(img) parent.removeChild(img);
            }
        }

        this.hide();
    };

    CreateUser.prototype.hide = function() {
        this.modalEl.el.style.visibility = 'hidden';
        this.el.classList.toggle("show", false);
        this.isShow = false;
    };

    CreateUser.prototype.show = function(id) {
        if(id) this.loadData(id);

        this.el.classList.toggle("show", true);
        this.modalEl.el.style.visibility = 'visible';
        this.isShow = true;
    };

    CreateUser.prototype.render = function() {
        var arr = this.renderOrder;
        var fragment = document.createDocumentFragment();

        for(var i = 0; i < arr.length; i++) {
            var field = arr[i];
            fragment.appendChild(this.fields[field]());
        }

        this.el.appendChild(fragment);
        return this.el;
    };

    App.View.Modal.CreateUser = CreateUser;
})(App, document);