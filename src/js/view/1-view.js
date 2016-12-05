/**
 * Created by s.evdokimov on 08.11.2016.
 */

(function(App, document){
    'use strict';

    function View(collection) {
        this.container = App.serviceContainer;
        this.event = App.Lib.Event;
        this.dictionary = this.container.lib.dictionary;

        // components
        this.header = new App.View.Header({
            userCollection: collection.users,
            rootView: this
        });

        this.layout = new App.View.Layout({
            userCollection: collection.users,
            rootView: this
        });

        this.modalWindow = new App.View.Modal({
            userCollection: collection.users,
            rootView: this
        });

        this.notifyBlock = new App.View.Notify({
            userCollection: collection.users,
            rootView: this
        });


        // listeners
        document.addEventListener('keydown', this.handlerKeyPress.bind(this, this));
        this.event.addListener('languageChange', this.localization.bind(this));

        // put to container
        App.serviceContainer.template.rootView = this;
    }

    View.prototype.handlerKeyPress = function(self, event) {
        if(event.which != 27) {
            return false;
        }

        self.modalWindow.el.click();
    };

    View.prototype.render = function() {
        App.container.appendChild(this.header.render());
        App.container.appendChild(this.modalWindow.render());
        App.container.appendChild(this.notifyBlock.render());
        App.container.appendChild(this.layout.render());
    };

    View.prototype.localization = function() {
        var ast = this.createAST(App.container);
        this.translate(ast, '');

        return true;
    };

    View.prototype.translate = function(node, acc) {
        var self = this;
        acc += node.key + '|';

        if(node.children.length) {
            node.children.forEach(function(item) {
                return self.translate(item, acc);
            });
        } else {
            var keys = acc.substring(0, acc.length - 1).split('|');
            var params = keys.reduce(function(acc, item) {
                if(item !== '') acc.push(item);
                return acc;
            }, []);

            var str = self.dictionary.t(params);
            if('string' == typeof str) node.el.textContent = str;
        }

        return true;
    };

    View.prototype.createAST = function(element) {
        var self = this;
        var item = {};
        item.key = '';
        item.el = null;
        item.children = [];

        if(element.dataset.languageKey) item.key = element.dataset.languageKey;
        item.el = element;

        var elements = [];
        if(element.childNodes) elements = [].slice.apply(element.childNodes);

        elements = elements.reduce(function(acc, el) {
            if(el.nodeType == 1) acc.push(el);
            return acc;
        }, []);

        item.children = elements.map(function(el) {
            if(el.childNodes) return self.createAST(el);
        });

        return item;
    };

    App.View = View;
})(App, document);