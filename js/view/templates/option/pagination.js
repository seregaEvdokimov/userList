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
        this.pages = [];

        // this.behaviourPagination == 'lazyLoad'
        this.lazyInit();
            // : this.paginationInit();

        // put to container
        App.serviceContainer.pagination = this;
    }

    Pagination.prototype.refresh = function() {
        // if(this.behaviourPagination == 'pagination') {
        //     this.drawPages();
        //
        //     var start = (this.currentPage == 1) ? 1 : (this.currentPage * this.pagination.perPage) - this.pagination.perPage;
        //     var limit = start + this.pagination.perPage;
        //     this.getData(start, limit,this.loadData.bind(this));
        // }
    };

    Pagination.prototype.lazyInit = function() {
        var tbody = this.container.userTableTbody;
        tbody.el.addEventListener('scroll', this.lazyHandlerScroll.bind(this, tbody, this.loadData.bind(this)));
    };

    Pagination.prototype.lazyHandlerScroll = function(self, callback, event) {
        var el = event.target;
        var currentScroll = self.el.scrollTop + self.el.clientHeight;
        var maxScroll = self.el.scrollHeight;

        if(currentScroll == maxScroll) {
            var start = el.childNodes.length;
            var limit = start + App.pagination.perPage;

            this.container.user.load({start: start, limit: limit}).then(callback);
        }
    };

    // Pagination.prototype.paginationInit = function() {
    //     this.drawPages();
    //     this.el.addEventListener('click', this.changePage.bind(this, this, this.loadData.bind(this)));
    // };
    //
    // Pagination.prototype.drawPages = function() {
    //     var self = this;
    //     this.currentPage = this.pagination.currentPage;
    //
    //     this.container.user.load({count: true}).then(function(res) {
    //         var len = Math.ceil(res.count / self.pagination.perPage);
    //         var fragment = document.createDocumentFragment();
    //
    //         if(len == 1) {
    //             return this.el;
    //         }
    //
    //         if(self.pages.length != len) {
    //             self.pages = [];
    //             self.el.innerHTML = '';
    //
    //             for(var i = 1; i <= len; i++) {
    //                 var el = document.createElement('div');
    //                 el.textContent = i;
    //                 el.dataset.page = i;
    //                 el.className = 'page';
    //
    //                 if(self.currentPage == i) {
    //                     el.classList.add('active');
    //                 }
    //
    //                 self.pages.push(el);
    //                 fragment.appendChild(el);
    //             }
    //
    //             self.el.appendChild(fragment);
    //         }
    //     });
    // };
    //
    // Pagination.prototype.changePage = function(self, callback, event) {
    //     var el = event.target;
    //
    //     if(!el.classList.contains('page')) {
    //         return false;
    //     }
    //
    //     var currentPage = el.dataset.page;
    //     if(currentPage == this.currentPage) return false;
    //
    //     self.pages.forEach(function(item) {
    //         item.classList.remove('active');
    //         if(currentPage == item.dataset.page) {
    //             item.classList.add('active');
    //         }
    //     });
    //
    //     this.pagination.currentPage = currentPage;
    //     this.currentPage = currentPage;
    //     var start = (currentPage == 1) ? 1 : (currentPage * self.pagination.perPage) - self.pagination.perPage;
    //     var limit = start + self.pagination.perPage;
    //
    //     self.getData(start, limit, callback);
    // };
    //
    // Pagination.prototype.getData = function(start, limit, callback) {
    //     var self = this;
    //     this.container.user.load({start: start, limit: limit}).then(function(res) {
    //         if(!res.length && self.currentPage > 0) {
    //             var page = self.pages[self.pages.length - 1];
    //             page.click();
    //             console.log(page);
    //         }
    //
    //         callback(res);
    //         self.container.userTableTbody.clearRows(res);
    //     });
    // };


    Pagination.prototype.loadData = function(res) {
        var tbody = this.container.userTableTbody;
        tbody.newRows(res);
    };


    Pagination.prototype.render = function() {
        return this.el;
    };

    App.View.Option.Pagination = Pagination;
})(App, document);