/**
 * Created by s.evdokimov on 15.11.2016.
 */

(function(App, document) {

    function Header(option) {
        this.el = document.createElement('div');
        this.el.className = 'header';
        this.container = App.serviceContainer;

        this.collection = {
            user: option.userCollection
        };

        // components
        this.search = new App.View.Header.Search({
            collection: this.collection,
            headerEl: this
        });

        // put to container
        App.serviceContainer.header = this;
    }

    Header.prototype.render = function() {
        this.el.appendChild(this.search.render());
        return this.el;
    };

    App.View.Header = Header;
})(App, document);