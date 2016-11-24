/**
 * Created by s.evdokimov on 24.11.2016.
 */

(function(App, document) {

    function Confirm(option) {
        this.el = document.createElement('div');
        this.el.className = 'modal-window modal-confirm';
        this.text = option.text;

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
        var wrapperButtons = document.createElement('div');
        wrapperButtons.className = 'control-group';

        var yesBtn = document.createElement('button');
        yesBtn.textContent = 'ОК';
        yesBtn.className = 'ok';

        var noBtn = document.createElement('Button');
        noBtn.textContent = 'Отмена';
        noBtn.className = 'cancel';

        wrapperButtons.appendChild(yesBtn);
        wrapperButtons.appendChild(noBtn);

        return wrapperButtons;
    };

    Confirm.prototype.render = function() {
        var controlEl = this.controlsButton();
        var titleEl = document.createElement('h3');
        titleEl.textContent = this.text;
        titleEl.className = 'caption';

        this.el.appendChild(titleEl);
        this.el.appendChild(controlEl);
        return this.el;
    };

    App.View.Modal.Confirm = Confirm;
})(App, document);