/**
 * Created by s.evdokimov on 10.11.2016.
 */

(function() {

    function AddUser(option) {
        this.el = document.createElement('button');
        this.el.textContent = 'Add User';
        this.el.className = 'add-user';

        this.container = App.serviceContainer;
        this.blockEl = option.blockEl;
        this.collection = option.userCollection;

        // components

        // listeners
        this.el.addEventListener('click', this.showModal.bind(this, this));

        // put to container
        App.serviceContainer.template.addUser = this;
    }

    AddUser.prototype.showModal = function(self, event) {
        self.container.template.modalCreate.show();
    };

    AddUser.prototype.render = function() {
        return this.el;
    };

    App.View.Option.AddUser = AddUser;
})();