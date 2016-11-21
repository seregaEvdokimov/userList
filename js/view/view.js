/**
 * Created by s.evdokimov on 08.11.2016.
 */

(function(App, document){

    function View(collection) {
        this.container = App.serviceContainer;

        // components
        this.header = new App.View.Header({
            userCollection: collection.users,
            rootView: this
        });

        this.usersTable = new App.View.UserTable({
            userCollection: collection.users,
            rootView: this
        });

        this.modalWindow = new App.View.Modal({
            userCollection: collection.users,
            rootView: this
        });

        this.optionBlock = new App.View.Option({
            userCollection: collection.users,
            rootView: this
        });

        // listeners
        document.addEventListener('keydown', this.handlerKeyPress.bind(this, this));

        // put to container
        App.serviceContainer.view = this;
    }

    View.prototype.handlerKeyPress = function(self, event) {
        if(event.which != 27) {
            return false;
        }

        self.modalWindow.el.click();
    };

    View.prototype.render = function() {
        App.container.appendChild(this.header.render());
        App.container.appendChild(this.usersTable.render());
        App.container.appendChild(this.modalWindow.render());
        App.container.appendChild(this.optionBlock.render());
    };

    App.View = View;
})(App, document);