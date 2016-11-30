/**
 * Created by s.evdokimov on 25.11.2016.
 */


(function(App, document) {

    function Notify(option) {
        this.el = document.createElement('div');
        this.el.className = 'notify-wrapper';

        this.items = [];
        this.container = App.serviceContainer;
        this.rootView = option.rootView;
        this.collection = {
            user: option.userCollection
        };

        // components

        // listeners
        this.el.addEventListener('click', this.hideNotify.bind(this, this));
        this.el.addEventListener('transitionend', this.notifyAnimate.bind(this, this));

        // put to container
        App.serviceContainer.template.notify = this;
    }

    Notify.prototype.create = function(params, type) {
        if(!App.showNotify) return false;

        var notify = new App.View.Notify.Item({
            notifyEl: this,
            params: params,
            type: type
        });

        this.items.push(notify);
        this.el.appendChild(notify.show());
    };

    Notify.prototype.hideNotify = function(self, event) {
        var el = event.target;

        if(el.className != 'notify') return false;

        var find = self.items.filter(function(item) {
            return item.id == el.dataset.notifyId;
        });

        find[0].hide();
    };

    Notify.prototype.notifyAnimate = function(self, event) {
        var el = event.target;

        self.items = self.items.reduce(function(acc, item) {
            item.id == parseInt(el.dataset.notifyId) ? item.remove() : acc.push(item);
            return acc;
        }, []);

        console.log(self.items.length);
        if(!self.items.length) self.el.innerHTML = '';
    };

    Notify.prototype.render = function() {
        return this.el;
    };

    App.View.Notify = Notify;
})(App, document);