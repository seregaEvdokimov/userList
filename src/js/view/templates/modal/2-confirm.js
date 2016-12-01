/**
 * Created by s.evdokimov on 24.11.2016.
 */

(function(App, document) {
    'use strict';

    function Confirm(option) {
        this.el = document.createElement('div');
        this.el.className = 'modal-window modal-confirm';
        this.el.dataset.languageKey = 'confirm';
        this.container = App.serviceContainer;
        this.dictionary = this.container.lib.dictionary;
        this.nodes = {};

        // components
        this.event = App.Lib.Event;

        // listeners
        this.el.addEventListener('click', this.makeChoice.bind(this, this));

        // put to container
        App.serviceContainer.template.modalConfirm = this;
    }

    Confirm.prototype.makeChoice = function(self, event) {
        var el = event.target;

        if(el.tagName != 'BUTTON') {
            return false;
        }

        var choise = null;
        switch(el.className) {
            case 'ok':
                choise = true;
                break;
            case 'cancel':
                choise = false;
                break;
        }

        self.event.dispatch('makeChoice', choise);
        self.hide();
    };

    Confirm.prototype.confirm = function() {
        this.show();
    };

    Confirm.prototype.show = function() {
        this.el.classList.toggle("show", true);
    };

    Confirm.prototype.hide = function() {
        this.el.classList.toggle("show", false);
    };

    Confirm.prototype.controlsButton = function() {
        this.nodes.wrapperButtons = document.createElement('div');
        this.nodes.wrapperButtons.className = 'control-group';

        var yesBtn = document.createElement('button');
        yesBtn.dataset.languageKey = 'save';
        yesBtn.textContent = this.dictionary.t(['modal', 'confirm', 'save']);
        yesBtn.className = 'ok';

        var noBtn = document.createElement('Button');
        noBtn.dataset.languageKey = 'cancel';
        noBtn.textContent = this.dictionary.t(['modal', 'confirm', 'cancel']);
        noBtn.className = 'cancel';

        this.nodes.wrapperButtons.appendChild(yesBtn);
        this.nodes.wrapperButtons.appendChild(noBtn);

        return this.nodes.wrapperButtons;
    };

    Confirm.prototype.render = function() {
        var controlEl = this.controlsButton();
        var titleEl = document.createElement('h3');
        titleEl.dataset.languageKey = 'message';
        titleEl.textContent = this.dictionary.t(['modal', 'confirm', 'message']);
        titleEl.className = 'caption';

        this.el.appendChild(titleEl);
        this.el.appendChild(controlEl);
        return this.el;
    };

    App.View.Modal.Confirm = Confirm;
})(App, document);