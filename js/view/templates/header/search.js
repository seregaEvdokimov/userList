/**
 * Created by s.evdokimov on 15.11.2016.
 */

(function (App, document) {

    function Search(option) {
        this.el = document.createElement('div');
        this.el.className = 'search';
        this.container = App.serviceContainer;
        this.collection = option.collection;

        // put to container
        App.serviceContainer.template.search = this;
    }

    Search.prototype.handlerSearch = function(self, event) {
        var searchStr = self.el.querySelector('input').value;
        self.container.userTableTbody.render({type: 'search', find: searchStr});
    };

    Search.prototype.render = function() {
        var input = document.createElement('input');
        input.setAttribute('name', 'search');

        var button = document.createElement('button');
        button.textContent = 'Search';
        button.addEventListener('click', this.handlerSearch.bind(this, this));

        this.el.appendChild(input);
        this.el.appendChild(button);
        return this.el;
    };

    App.View.Header.Search = Search;
})(App, document);
