/**
 * Created by s.evdokimov on 10.11.2016.
 */

(function(App, document) {

    function Pagination(option) {
        this.el = document.createElement('div');
        this.el.className = 'pagination';

        this.container = App.serviceContainer;
        this.blockEl = option.blockEl;
        this.collection = option.collection;
        this.pagination = App.pagination;
        this.pages = [];

        // listeners
        this.el.addEventListener('click', this.changePage.bind(this, this));

        // put to container
        App.serviceContainer.pagination = this;
    }

    Pagination.prototype.changePage = function(self, event) {
        var el = event.target;

        if(!el.classList.contains('page')) {
            return false;
        }

        var currentPage = el.dataset.page;
        self.pages.forEach(function(item) {
            item.classList.remove('active');
            if(currentPage == item.dataset.page) {
                item.classList.add('active');
            }
        });

        this.pagination.currentPage = currentPage;
        this.container.userTableTbody.render();
    };

    Pagination.prototype.afterCRUD  = function() {
        var newPage = Math.ceil(this.collection.user.length / this.pagination.perPage);

        if(this.pagination.currentPage != newPage) {
            this.pagination.currentPage = newPage;
            this.reRender();
        }
    };

    Pagination.prototype.render = function() {
        var len = Math.ceil(this.collection.user.length / this.pagination.perPage);
        var fragment = document.createDocumentFragment();

        if(len == 1) {
            return this.el;
        }

        for(var i = 1; i <= len; i++) {
            var el = document.createElement('div');
            el.textContent = i;
            el.dataset.page = i;
            el.className = 'page';

            if(this.pagination.currentPage == i) {
                el.classList.add('active');
            }

            this.pages.push(el);
            fragment.appendChild(el);
        }

        this.el.appendChild(fragment);
        return this.el;
    };

    Pagination.prototype.reRender = function() {
        this.el.innerHTML = '';
        this.pages = [];

        var res = this.render();
        this.el.replaceWith(res);
    };

    App.View.Option.Pagination = Pagination;
})(App, document);