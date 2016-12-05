/**
 * Created by s.evdokimov on 10.11.2016.
 */

(function(App, document) {
    'use strict';

    function Option(option) {
        this.el = document.createElement('div');
        this.el.className = 'option';
        this.el.dataset.languageKey = 'option';

        this.container = App.serviceContainer;
        this.layoutEl = option.layoutEl;
        this.pagination = App.pagination;
        this.collection = option.collection;

        // components
        this.addUser = new App.View.Option.AddUser({
            collection: this.collection,
            blockEl: this
        });


        this.pagination = new App.View.Option.Pagination({
            collection: this.collection,
            blockEl: this
        });

        // listeners

        // put to container
        App.serviceContainer.template.optionBlock = this;
    }

    Option.prototype.render = function() {
        this.el.appendChild(this.addUser.render());
        this.el.appendChild(this.pagination.render());
        return this.el;
    };

    Option.prototype.destroy = function() {
        this.addUser.destroy();
        this.pagination.destroy();
        this.layoutEl.el.removeChild(this.el);
    };

    App.View.Option = Option;
})(App, document);