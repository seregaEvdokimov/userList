/**
 * Created by s.evdokimov on 10.11.2016.
 */

(function() {
    'use strict';

    function AddUser(option) {
        this.el = document.createElement('button');
        this.el.className = 'add-user';
        this.el.dataset.languageKey = 'adduser';

        this.container = App.serviceContainer;
        this.dictionary = this.container.lib.dictionary;
        this.blockEl = option.blockEl;
        this.collection = option.userCollection;
        this.el.textContent = this.dictionary.t(['option', 'adduser']);
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

    AddUser.prototype.destroy = function() {
        this.blockEl.el.removeChild(this.el);
    };

    App.View.Option.AddUser = AddUser;
})();