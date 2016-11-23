/**
 * Created by s.evdokimov on 10.11.2016.
 */

(function(App, document) {

    function Option(option) {
        this.el = document.createElement('div');
        this.el.className = 'option';

        this.container = App.serviceContainer;
        this.rootView = option.rootView;
        this.pagination = App.pagination;
        this.collection = {
            user: option.userCollection
        };

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

    App.View.Option = Option;
})(App, document);