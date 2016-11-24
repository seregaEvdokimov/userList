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
        this.tRows = [];
        this.sortConfig = {
            param: 'id',
            direction: 'asc'
        };

        // components
        this.event = App.Lib.Event;
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
        App.serviceContainer.template.userTableTbody = this;
    }

    Body.prototype.handlerModal = function(self, event) {
        var el = event.target;

        if(el.tagName != 'A') {
            return false;
        }

        var id = el.parentNode.parentNode.querySelector('.id').textContent;
        switch (el.className) {
            case 'edit-btn':
                self.container.template.modalEdit.show(id);
                break;
            case 'delete-btn':
                self.removeRow(id);
                break;
        }
    };

    Body.prototype.sort = function(result) {
        var config = this.sortConfig;
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
        var user = this.container.model.user;

        var findRow;
        var findRowIndx;

        this.tRows.forEach(function(row, index) {
            if(row.id == id) {
                findRow = row;
                findRowIndx = index;
            }
        });

        user.delete(id).then(function() {
            findRow.el.classList.add('deleting');

            setTimeout(function() {
                self.tRows.splice(findRowIndx, 1);
                findRow.destroy();
                self.event.dispatch('deleteRow');
            }, 350);
        });
    };

    Body.prototype.updateRow = function(res) {
        this.tRows.forEach(function(item) {
            if(item.id == res.id) item.update(res);
        });
    };

    Body.prototype.createRow = function() {
        this.event.dispatch('addRow');
    };

    Body.prototype.newRows = function(rows) {
        var self = this;
        var mapperExistingRows = {};

        this.tRows.forEach(function(item) {
            mapperExistingRows[item.id] = true;
        });

        rows.forEach(function(item) {
            if(!mapperExistingRows.hasOwnProperty(item.id)) {
                var row = new App.View.UserTable.Body.Row({
                    collection: item,
                    tbodyEl: self
                });
                self.tRows.push(row);
            }
        });

        this.render();
    };

    Body.prototype.clearRows = function(newRows) {
        this.tRows = this.tRows.reduce(function(acc, oldItem) {
            var filtered = newRows.filter(function(newItem) {
                return newItem.id == oldItem.id;
            });

            filtered.length
                ? acc.push(oldItem)
                : oldItem.destroy();

            return acc;
        }, []);
    };

    Body.prototype.render = function(config) {
        if(config && config.type == 'sort') this.sortConfig = config;

        this.el.innerHTML = '';
        var fragment = document.createDocumentFragment();

        var result = this.sort(this.tRows);
        if(config && config.type == 'search') {
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