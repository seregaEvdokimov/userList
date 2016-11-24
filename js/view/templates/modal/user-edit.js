/**
 * Created by s.evdokimov on 09.11.2016.
 */

(function(App, document) {

    function EditUser(option) {
        var self = this;
        App.View.Modal.CreateUser.call(this, option);

        this.el.className = 'modal-window modal-edit';
        this.findItem = [];
        this.renderOrder.push('id');
        this.fields.id = function() {
            var nameInput = document.createElement('input');
            nameInput.setAttribute('type', 'hidden');
            nameInput.setAttribute('name', 'id');
            nameInput.className = 'id-input';
            self.inputs.id = nameInput;

            return nameInput;
        };

        // components
        this.event = App.Lib.Event;

        // listeners
        this.event.addListener('makeChoice', this.makeChoice.bind(this));

        // put to container
        App.serviceContainer.template.modalEdit = this;
    }

    EditUser.prototype = Object.create(App.View.Modal.CreateUser.prototype);

    EditUser.prototype.loadData = function(id) {
        var find = this.collection.user.filter(function(item) {
            return item.id == id;
        });

        this.findItem = find[0];

        var avatarContainer = this.inputs.avatar.parentNode;
        var images = avatarContainer.querySelector('img');

        var avatar = document.createElement('img');
        avatar.setAttribute('src', this.findItem.avatar);

        images
            ? images.replaceWith(avatar)
            : avatarContainer.insertBefore(avatar, this.inputs.avatar);

        this.avatar = this.findItem.avatar;
        this.inputs.avatar.dataset.img = this.findItem.avatar;
        this.inputs.id.value = this.findItem.id;
        this.inputs.name.value = this.findItem.name;
        this.inputs.email.value = this.findItem.email;
        this.inputs.birth.valueAsNumber = new Date(this.findItem.birth).getTime();
        this.inputs.date.valueAsNumber = new Date(this.findItem.date).getTime();
        this.inputs.time.valueAsNumber = new Date(this.findItem.date).getTime() + 10800000; // + 3 hours
    };

    EditUser.prototype.compareData = function(data) {
        var toUpdate = false;

        for(var index in data) {
            var newItem = data[index];
            var oldItem = this.findItem[index];

            if(newItem != oldItem) {
                toUpdate = true;
                break;
            }
        }

        return toUpdate;
    };

    EditUser.prototype.beforeHide = function(status) {
        if(status == 'cancel') {
            var data = this.pickData();
            var toUpdate = this.compareData(data);

            if(toUpdate) {
                this.el.classList.add("disable");
                this.container.template.modalConfirm.confirm();
            } else {
                this.hide();
            }
        } else {
            this.hide();
        }
    };

    EditUser.prototype.makeChoice = function(status) {
        this.el.classList.remove("disable");
        if(status) {
            var data = this.pickData();
            this.send(data);
        }

        this.hide();
    };

    EditUser.prototype.send = function(data) {
        var status = this.compareData(data);
        if(!status) return false;

        var self = this;
        var user = this.container.model.user;
        user.update(data).then(function(res) {
            self.container.template.userTableTbody.updateRow(res);
        });
    };

    App.View.Modal.EditUser = EditUser;
})(App, document);