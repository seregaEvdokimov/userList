/**
 * Created by s.evdokimov on 10.11.2016.
 */

(function(App, document) {

    function Pagination(option) {
        this.el = document.createElement('div');
        this.el.className = 'pagination';

        this.blockEl = option.blockEl;
        this.collection = option.collection;

        this.container = App.serviceContainer;
        this.pagination = App.pagination;
        this.behaviourPagination = this.pagination.type;

        // components
        this.event = App.Lib.Event;

        // lazyload
        this.count = 0;

        // pagination
        this.pages = [];

        this.behaviourPagination == 'lazyLoad'
            ? this.lazyInit()
            : this.paginationInit();

        // put to container
        App.serviceContainer.template.pagination = this;
    }

    Pagination.prototype.lazyInit = function() {
        var self = this;
        var table = this.container.template.userTable;
        var tbody = this.container.template.userTableTbody;


        this.container.model.user.load({count: true}).then(function(res) {
            self.count = res.count;

            table.el.classList.add('lazyLoad');
            tbody.el.addEventListener('scroll', self.lazyHandlerScroll.bind(self, tbody, self.count, self.loadData.bind(self)));
        });
    };

    Pagination.prototype.lazyHandlerScroll = function(self, count, callback, event) {
        var el = event.target;
        var currentScroll = self.el.scrollTop + self.el.clientHeight;
        var maxScroll = self.el.scrollHeight;

        if(currentScroll == maxScroll) {
            var start = el.childNodes.length;
            var limit = start + App.pagination.perPage;

            if(start < count) this.container.model.user.load({start: start, limit: limit}).then(callback);
        }
    };

    Pagination.prototype.paginationInit = function() {
        var self = this;
        this.currentPage = this.pagination.currentPage;

        this.calculateQuantityPages().then(function(res) {
            self.drawPages(res.quantity);
            self.backlightPage();

            self.el.addEventListener('click', self.changePage.bind(self, self, self.loadData.bind(self)));
        });

        this.event.addListener('deleteRow', this.deleteRow.bind(this));
        this.event.addListener('addRow', this.addRow.bind(this));
    };

    Pagination.prototype.deleteRow = function() {
        var self = this;
        this.calculateQuantityPages().then(function(res) {

            if(res.mod === false) {
                self.currentPage = self.currentPage == 1 ? 1
                    : (self.currentPage == (res.quantity + 1)) ? res.quantity
                    :  self.currentPage;

                self.drawPages(res.quantity);
                self.backlightPage();

                var result = self.getStartAndLimitRecords();
                self.getData(result.start, result.limit, self.loadData.bind(self));
            }
        });
    };

    Pagination.prototype.addRow = function() {
        var self = this;
        this.calculateQuantityPages().then(function(res) {

            self.currentPage = res.quantity;
            self.drawPages(res.quantity);
            self.backlightPage();

            var result = self.getStartAndLimitRecords();
            self.getData(result.start, result.limit, self.loadData.bind(self));
        });
    };

    Pagination.prototype.calculateQuantityPages = function() {
        var self = this;
        return this.container.model.user.load({count: true}).then(function(res){

            var out = {};
            if(res.count % self.pagination.perPage == 0) {
                out.quantity = res.count / self.pagination.perPage;
                out.mod = false;
            } else {
                out.quantity =  Math.ceil(res.count / self.pagination.perPage);
                out.mod = true;
            }

            return out;
        });
    };

    Pagination.prototype.drawPages = function(quantity) {
        var fragment = document.createDocumentFragment();

        if(this.pages.length != quantity) {
            this.pages = [];
            this.el.innerHTML = '';

            for(var i = 1; i <= quantity; i++) {
                var el = document.createElement('div');
                el.textContent = i;
                el.dataset.page = i;
                el.className = 'page';

                this.pages.push(el);
                fragment.appendChild(el);
            }
            this.el.appendChild(fragment);
        }
    };

    Pagination.prototype.backlightPage = function() {
        var self = this;
        this.pages.forEach(function(page) {
            var pageNum = page.dataset.page;
            page.classList.remove('active');
            if(pageNum == self.currentPage) page.classList.add('active');
        });
    };

    Pagination.prototype.changePage = function(self, callback, event) {
        var el = event.target;

        if(!el.classList.contains('page')) return false;

        var currentPage = el.dataset.page;
        if(currentPage == this.currentPage) return false;

        this.currentPage = currentPage;
        self.backlightPage();

        var result = self.getStartAndLimitRecords();
        self.getData(result.start, result.limit, callback);
    };

    Pagination.prototype.getStartAndLimitRecords = function() {
        var start = (this.currentPage == 1) ? 0
            : (this.currentPage * this.pagination.perPage) - this.pagination.perPage;

        var limit = start + this.pagination.perPage;
        return {start: start, limit: limit};
    };

    Pagination.prototype.getData = function(start, limit, callback) {
        var self = this;
        this.container.model.user.load({start: start, limit: limit}).then(function(res) {
            callback(res);
            self.container.template.userTableTbody.clearRows(res);
        });
    };

    Pagination.prototype.loadData = function(res) {
        var tbody = this.container.template.userTableTbody;
        if(res.length) tbody.newRows(res);
    };


    Pagination.prototype.render = function() {
        return this.el;
    };

    App.View.Option.Pagination = Pagination;
})(App, document);