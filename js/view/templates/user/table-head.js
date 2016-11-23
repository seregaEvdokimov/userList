/**
 * Created by s.evdokimov on 08.11.2016.
 */

(function(App, document) {

    function Head(options) {
        this.el = document.createElement('thead');
        this.el.className = 'tHead';
        this.container = App.serviceContainer;
        this.collection = options.collection;
        this.tableEl = options.tableEl;
        this.renderOrder = ['id', 'name', 'email', 'birth', 'date', 'del', 'edit'];
        this.fields = {
            id: function() {
              var idElement = document.createElement('th');
              idElement.className = 'id';
              idElement.dataset.sortBy = 'id';
              idElement.dataset.orderBy = 'asc';
              idElement.textContent = 'ID';
              return idElement;
            },
            name: function() {
                var nameElement = document.createElement('th');
                nameElement.className = 'name';
                nameElement.dataset.sortBy = 'name';
                nameElement.dataset.orderBy = 'asc';
                nameElement.textContent = 'Name';
                return nameElement;
            },
            email: function() {
                var emailElement = document.createElement('th');
                emailElement.className = 'email';
                emailElement.dataset.sortBy = 'email';
                emailElement.dataset.orderBy = 'asc';
                emailElement.textContent = 'Email';
                return emailElement;
            },
            birth: function() {
                var dateElement = document.createElement('th');
                dateElement.className = 'birth';
                dateElement.dataset.sortBy = 'birth';
                dateElement.dataset.orderBy = 'asc';
                dateElement.textContent = 'Date of birth';
                return dateElement;
            },
            date: function() {
                var dateElement = document.createElement('th');
                dateElement.className = 'date';
                dateElement.dataset.sortBy = 'date';
                dateElement.dataset.orderBy = 'asc';
                dateElement.textContent = 'Estimated time';
                return dateElement;
            },
            del: function(){
                var delElement = document.createElement('th');
                delElement.className = 'delete';
                delElement.textContent = 'Delete';
                return delElement;
            },
            edit: function() {
                var editElement = document.createElement('th');
                editElement.className = 'edit';
                editElement.textContent = 'Edit';
                return editElement;
            }
        };

        // listeners
        this.el.addEventListener('click', this.handlerSort.bind(this, this));

        // put to container
        App.serviceContainer.template.userTableThead = this;
    }

    Head.prototype.handlerSort = function(self, event) {
        var el = event.target;

        if(el.className === 'delete' || el.className === 'edit') {
            return false;
        }

        var direction = el.dataset.orderBy;
        var param = el.dataset.sortBy;

        self.tdEl.forEach(function(item) {
            var sort = item.dataset.sortBy;

            item.classList.remove('active');
            if(sort === param) {
                item.classList.add('active');

                if(item.dataset.orderBy == 'asc') {
                    item.classList.remove('asc');
                    item.classList.add('desc');
                    item.dataset.orderBy = 'desc';
                } else {
                    item.classList.remove('desc');
                    item.classList.add('asc');
                    item.dataset.orderBy = 'asc';
                }
            }
        });

        self.sortCollection(direction, param);
    };

    Head.prototype.sortCollection = function(direction, param) {
        var tBody = this.container.template.userTableTbody;
        tBody.render({type: 'sort', direction: direction, param: param});
    };

    Head.prototype.render = function() {
        this.tdEl = [];
        var row = document.createElement('tr');
        var fragment = document.createDocumentFragment();
        var arr = this.renderOrder;

        for(var i = 0; i < arr.length; i++) {
            var field = arr[i];
            var el = this.fields[field]();
            this.tdEl.push(el);
            fragment.appendChild(el);
        }

        row.appendChild(fragment);
        this.el.appendChild(row);

        return this.el;
    };

    App.View.UserTable.Head = Head;
})(App, document);