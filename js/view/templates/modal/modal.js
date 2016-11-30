/**
 * Created by s.evdokimov on 09.11.2016.
 */

(function(App, document) {

    function Modal(option) {
        this.el = document.createElement('div');
        this.el.className = 'modal';
        this.el.dataset.languageKey = 'modal';
        this.el.style.visibility = 'hidden';

        this.container = App.serviceContainer;
        this.collection = {
            user: option.userCollection
        };

        // components
        this.modalEdit = new App.View.Modal.EditUser({
            collection: this.collection,
            modalEl: this
        });

        this.modalCreate = new App.View.Modal.CreateUser({
            collection: this.collection,
            modalEl: this
        });

        this.modalConfirm = new App.View.Modal.Confirm();

        // listeners
        this.el.addEventListener('click', this.hideAllModal.bind(this, this));

        // put to container
        App.serviceContainer.template.modalWindow = this;
    }

    Modal.prototype.hideAllModal = function(self, event) {
        var el = event.target;

        if(el.tagName == 'DIV' && el.className == 'modal') {
            var create = this.container.template.modalCreate;
            var edit = this.container.template.modalEdit;

            if(create.isShow) create.beforeHide('cancel');
            if(edit.isShow) edit.beforeHide('cancel');
        }
    };

    Modal.prototype.render = function() {
        this.el.appendChild(this.modalCreate.render());
        this.el.appendChild(this.modalEdit.render());
        this.el.appendChild(this.modalConfirm.render());
        return this.el;
    };

    App.View.Modal = Modal
})(App, document);