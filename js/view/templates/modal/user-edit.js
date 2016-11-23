/**
 * Created by s.evdokimov on 09.11.2016.
 */

(function(App, document) {

    function EditUser(option) {
        var self = this;
        App.View.Modal.CreateUser.call(this, option);

        this.el.className = 'modal-window modal-edit';
        this.CRUDType = 'update';
        this.renderOrder.push('id');
        this.fields.id = function() {
            var nameInput = document.createElement('input');
            nameInput.setAttribute('type', 'hidden');
            nameInput.setAttribute('name', 'id');
            nameInput.className = 'id-input';
            self.inputs.id = nameInput;

            return nameInput;
        };

        // put to container
        App.serviceContainer.template.modalEdit = this;
    }

    EditUser.prototype = Object.create(App.View.Modal.CreateUser.prototype);

    EditUser.prototype.loadData = function(id) {
        var find = this.collection.user.filter(function(item) {
            return item.id == id;
        });

        var avatarContainer = this.inputs.avatar.parentNode;
        var images = avatarContainer.querySelector('img');

        var avatar = document.createElement('img');
        avatar.setAttribute('src', find[0].avatar);

        images
            ? images.replaceWith(avatar)
            : avatarContainer.insertBefore(avatar, this.inputs.avatar);

        this.inputs.id.value = find[0].id;
        this.inputs.avatar.dataset.img = find[0].avatar;
        this.inputs.name.value = find[0].name;
        this.inputs.email.value = find[0].email;
        this.inputs.birth.valueAsNumber = new Date(find[0].birth).getTime();
        this.inputs.date.valueAsNumber = new Date(find[0].date).getTime();
        this.inputs.time.valueAsNumber = new Date(find[0].date).getTime();
    };

    App.View.Modal.EditUser = EditUser;
})(App, document);