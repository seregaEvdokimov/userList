/**
 * Created by s.evdokimov on 09.11.2016.
 */

(function(App, document) {

    function CreateUser(option) {
        var self = this;

        this.el = document.createElement('div');
        this.el.className = 'modal-window modal-create';
        this.el.style.visibility = 'hidden';

        this.modalEl = option.modalEl;
        this.collection = option.collection;
        this.container = App.serviceContainer;
        this.isShow = false;
        this.renderOrder = ['caption', 'avatar', 'name', 'email', 'birth', 'date', 'control'];
        this.fields = {
            caption: function(){
                var captionElement = document.createElement('h3');
                captionElement.className = 'caption';
                captionElement.textContent = 'Add New Client';
                return captionElement;
            },
            avatar: function(){
                var groupInput = document.createElement('div');
                groupInput.className = 'group avatar-group';

                var nameLabel = document.createElement('label');
                nameLabel.textContent = 'Upload Avatar';
                nameLabel.className = 'avatar-label';

                var nameInput = document.createElement('input');
                nameInput.setAttribute('type', 'file');
                nameInput.setAttribute('name', 'avatar');
                nameInput.dataset.validType = 'file';
                nameInput.addEventListener('change', self.imageUpload.bind(self, self));
                nameInput.className = 'file-input';
                self.inputs.avatar = nameInput;

                groupInput.appendChild(nameLabel);
                groupInput.appendChild(nameInput);
                return groupInput;
            },
            name: function(){
                var groupInput = document.createElement('div');
                groupInput.className = 'group name-group';

                var nameLabel = document.createElement('label');
                nameLabel.textContent = 'Enter Name';
                nameLabel.className = 'name-label';

                var nameInput = document.createElement('input');
                nameInput.setAttribute('type', 'text');
                nameInput.setAttribute('name', 'name');
                nameInput.dataset.validType = 'name';
                nameInput.className = 'name-input';
                self.inputs.name = nameInput;

                groupInput.appendChild(nameLabel);
                groupInput.appendChild(nameInput);
                return groupInput;
            },
            email: function(){
                var groupInput = document.createElement('div');
                groupInput.className = 'group email-group';

                var nameLabel = document.createElement('label');
                nameLabel.textContent = 'Enter Email';
                nameLabel.className = 'email-label';

                var nameInput = document.createElement('input');
                nameInput.setAttribute('type', 'text');
                nameInput.setAttribute('name', 'email');
                nameInput.dataset.validType = 'email';
                nameInput.className = 'email-input';
                self.inputs.email = nameInput;

                groupInput.appendChild(nameLabel);
                groupInput.appendChild(nameInput);
                return groupInput;
            },
            birth: function(){
                var groupInput = document.createElement('div');
                groupInput.className = 'group date-group';

                var nameLabel = document.createElement('label');
                nameLabel.textContent = 'Date of birth';
                nameLabel.className = 'date-label';

                var dateInput = document.createElement('input');
                dateInput.setAttribute('type', 'date');
                dateInput.setAttribute('name', 'birth');
                dateInput.dataset.validType = 'birth';
                dateInput.className = 'birth-input';
                self.inputs.birth = dateInput;

                groupInput.appendChild(nameLabel);
                groupInput.appendChild(dateInput);
                return groupInput;
            },
            date: function(){
                var groupInput = document.createElement('div');
                groupInput.className = 'group date-group';

                var nameLabel = document.createElement('label');
                nameLabel.textContent = 'Enter estimated time';
                nameLabel.className = 'date-label';

                var dateInput = document.createElement('input');
                dateInput.setAttribute('type', 'date');
                dateInput.setAttribute('name', 'date');
                dateInput.dataset.validType = 'date';
                dateInput.className = 'date-input';
                self.inputs.date = dateInput;

                var timeInput = document.createElement('input');
                timeInput.setAttribute('type', 'time');
                timeInput.setAttribute('name', 'time');
                timeInput.dataset.validType = 'time';
                timeInput.className = 'time-input';
                self.inputs.time = timeInput;

                groupInput.appendChild(nameLabel);
                groupInput.appendChild(dateInput);
                groupInput.appendChild(timeInput);
                return groupInput;
            },
            control: function(){
                var groupInput = document.createElement('div');
                groupInput.className = 'group control-group';

                var addBtn = document.createElement('button');
                addBtn.className = 'add-btn';
                addBtn.textContent = 'Save';

                var cancelBtn = document.createElement('button');
                cancelBtn.className = 'cancel-btn';
                cancelBtn.textContent = 'Cancel';

                groupInput.appendChild(addBtn);
                groupInput.appendChild(cancelBtn);
                return groupInput;
            }
        };
        this.inputs = {};
        this.CRUDType = 'create';
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
                if(this.CRUDType == 'create') self.clearForm();
                if(this.CRUDType == 'update') self.needToSave();

                self.hide();
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
                break;
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
        if(pick.status) this.send(pick.data);
        this.hide();
    };

    CreateUser.prototype.chekDate = function(data) {
        var result = App.Lib.Validator.checkFinishDate(data);

        this.inputs.date.classList.add(result.className);
        this.inputs.time.classList.add(result.className);

        return result.valid;
    };

    CreateUser.prototype.pickData = function() {
        var status = true;
        var strTime = this.inputs.date.value + ' ' + this.inputs.time.value;
        var data = {
            id: (this.inputs.id) ? this.inputs.id.value : null,
            name: this.inputs.name.value,
            email: this.inputs.email.value,
            date: new Date(strTime),
            birth: new Date(this.inputs.birth.value),
            avatar: this.avatar
        };

        if(this.CRUDType == 'update') {
            status = this.compareData(data);
        }

        return {status: status, data: data};
    };

    CreateUser.prototype.send = function(data) {
        var self = this;
        var user = this.container.model.user;
        user.create(data).then(function(res) {
            self.container.template.userTableTbody.createRow(res);
        });
    };

    CreateUser.prototype.clearForm = function() {
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

        return true;
    };

    CreateUser.prototype.hide = function() {
        this.el.style.visibility = 'hidden';
        this.el.style.top = '-50%';

        this.modalEl.el.style.visibility = 'hidden';
        this.isShow = false;
    };

    CreateUser.prototype.show = function(id) {
        if(id) this.loadData(id);

        this.modalEl.el.style.visibility = 'visible';

        this.el.style.visibility = 'visible';
        this.el.style.top = '50%';
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