/**
 * Created by s.evdokimov on 15.11.2016.
 */

(function(App, document) {
    'use strict';

    function Header(option) {
        this.el = document.createElement('div');
        this.el.className = 'header';
        this.el.dataset.languageKey = 'header';
        this.container = App.serviceContainer;

        this.collection = {
            user: option.userCollection
        };

        // components
        this.search = new App.View.Header.Search({
            collection: this.collection,
            headerEl: this
        });

        this.setting = new App.View.Header.Settings({
            collection: this.collection,
            headerEl: this
        });

        this.languages = new App.View.Header.Languages({
            collection: this.collection,
            headerEl: this
        });

        // put to container
        App.serviceContainer.template.header = this;
    }

    Header.prototype.render = function() {
        this.el.appendChild(this.setting.render());
        this.el.appendChild(this.languages.render());
        this.el.appendChild(this.search.render());
        return this.el;
    };

    App.View.Header = Header;
})(App, document);