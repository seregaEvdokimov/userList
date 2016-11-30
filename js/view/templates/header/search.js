/**
 * Created by s.evdokimov on 15.11.2016.
 */

(function (App, document) {

    function Search(option) {
        this.el = document.createElement('div');
        this.el.className = 'search';
        this.el.dataset.languageKey = 'search';
        this.container = App.serviceContainer;
        this.collection = option.collection;
        this.headerEl = option.headerEl;
        this.dictionary = this.container.lib.dictionary;
        this.nodes = {};

        // put to container
        App.serviceContainer.template.search = this;
    }

    Search.prototype.handlerSearch = function(self, event) {
        var searchStr = self.nodes.input.value;
        self.container.template.userTableTbody.render({type: 'search', find: searchStr});
    };

    Search.prototype.render = function() {
        this.nodes.input = document.createElement('input');
        this.nodes.input.setAttribute('name', 'search');

        this.nodes.button = document.createElement('button');
        this.nodes.button.dataset.languageKey = 'button';
        this.nodes.button.textContent = this.dictionary.t(['header', 'search', 'button']);
        this.nodes.button.addEventListener('click', this.handlerSearch.bind(this, this));

        for (var index in this.nodes) {
            this.el.appendChild(this.nodes[index]);
        }

        return this.el;
    };

    App.View.Header.Search = Search;
})(App, document);
