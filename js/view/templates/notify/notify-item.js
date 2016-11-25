/**
 * Created by s.evdokimov on 25.11.2016.
 */

(function(App, document) {

    function Item(option) {
        this.el = document.createElement('div');

        this.notifyEl = option.notifyEl;
        this.message = option.msg;
        this.id = Date.now();
        this.timeoutId = null;

        this.create();
    }

    Item.prototype.create = function() {
        this.render();
    };

    Item.prototype.remove = function() {
        this.notifyEl.el.removeChild(this.el);
    };

    Item.prototype.show = function() {
        var self = this;
        this.el.style.opacity = 1;
        this.timeoutId = setTimeout(function() {
            self.hide();
        }, 15000);

        return this.el;
    };

    Item.prototype.hide = function() {
        clearTimeout(this.timeoutId);
        this.el.style.opacity = 0;
    };

    Item.prototype.render = function() {
        this.el.className = 'notify';
        this.el.dataset.notifyId = this.id;
        this.el.textContent = this.message;

        return this.el;
    };

    App.View.Notify.Item = Item;
})(App, document);