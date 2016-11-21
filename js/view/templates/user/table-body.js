/**
 * Created by s.evdokimov on 08.11.2016.
 */

(function(App, document) {

    function Body(options) {
        var self = this;

        this.el = document.createElement('tbody');
        this.el.className = 'tBody';
        this.container = App.serviceContainer;
        this.collection = options.collection;
        this.tableEl = options.tableEl;
        this.pagination = App.pagination;
        this.tRows = [];

        // components
        this.collection.user.forEach(function(item) {
            var row = new App.View.UserTable.Body.Row({
                collection: item,
                tbodyEl: self
            });

            self.tRows.push(row);
        });

        // listeners
        this.el.addEventListener('click', this.handlerModal.bind(this, this));

        // put to container
        App.serviceContainer.userTableTbody = this;
    }

    Body.prototype.handlerModal = function(self, event) {
        var el = event.target;

        if(el.tagName != 'A') {
            return false;
        }

        var id = el.parentNode.parentNode.querySelector('.id').textContent;

        switch (el.className) {
            case 'edit-btn':
                self.container.modalEdit.show(id);
                break;
            case 'delete-btn':
                self.removeRow(id);
                break;
        }
    };

    Body.prototype.sort = function(config, result) {
        var sorted = result.sort(function(a, b) {
            var item1 = (config.param == 'date' || config.param == 'birth') ? new Date(a[config.param]).getTime() : a[config.param];
            var item2 = (config.param == 'date' || config.param == 'birth') ? new Date(b[config.param]).getTime() : b[config.param];
            var res = 0;

            if (config.direction == 'asc') {
                res = (item1 > item2) ? 1 : -1;
            } else {
                res = (item1 > item2) ? -1 : 1;
            }

            return res;
        });

        return sorted;
    };

    Body.prototype.search = function(config) {
        var find = this.tRows.filter(function(item) {
            var name = item.collection.name;
            return name.indexOf(config.find) != -1;
        });

        return find;
    };

    Body.prototype.removeRow = function(id) {
        var self = this;
        var user = this.container.user;

        var findRow;
        var findRowIndx;

        this.tRows.forEach(function(row, index) {
            if(row.id == id) {
                findRow = row;
                findRowIndx = index;
            }
        });

        user.delete(id).then(function(res) {
            if(res) {
                self.tRows.splice(findRowIndx, 1);
                self.container.pagination.afterCRUD();

                findRow.destroy();
                self.render();
            }
        });
    };

    Body.prototype.updateRow = function(res) {
        var row;
        this.tRows.forEach(function(item) {
            if(item.id == res.id) {
                row = item;
            }
        });

        row.update(res);
    };

    Body.prototype.createRow = function(res) {
        var row = new App.View.UserTable.Body.Row({
            collection: res,
            tbodyEl: this
        });

        this.tRows.push(row);
        this.render();
    };

    Body.prototype.render = function(config) {
        this.el.innerHTML = '';
        var fragment = document.createDocumentFragment();
        var result = [];

        var start = (this.pagination.currentPage == 1) ? -1
            : (this.pagination.currentPage * this.pagination.perPage) - this.pagination.perPage - 1;

        var limit = start + this.pagination.perPage;

        this.tRows.forEach(function(row, index) {
            row.stop();
            if(index > start && index <= limit) {
                result.push(row);
            }
        });

        if(config && config.type == 'sort') {
            result = this.sort(config, result);
        } else if(config && config.type == 'search') {
            result = this.search(config);
        }

        result.forEach(function(row) {
            fragment.appendChild(row.init());
        });

        this.el.appendChild(fragment);
        return this.el;
    };

    App.View.UserTable.Body = Body;
})(App, document);