/**
 * Created by s.evdokimov on 08.11.2016.
 */

(function(App, document) {
    'use strict';

    function Head(options) {
        var self = this;

        this.el = document.createElement('thead');
        this.el.className = 'tHead';
        this.el.dataset.languageKey = 'tHead';
        this.container = App.serviceContainer;
        this.collection = options.collection;
        this.tableEl = options.tableEl;
        this.dictionary = this.container.lib.dictionary;
        this.nodes = {};
        this.renderOrder = ['id', 'name', 'email', 'birth', 'date', 'del', 'edit'];
        this.fields = {
            id: function() {
                self.nodes.id = document.createElement('th');
                self.nodes.id.className = 'id';
                self.nodes.id.dataset.sortBy = 'id';
                self.nodes.id.dataset.orderBy = 'asc';
                self.nodes.id.dataset.languageKey = 'id';
                self.nodes.id.textContent = self.dictionary.t(['userTable', 'tHead', 'id']);
                return self.nodes.id;
            },
            name: function() {
                self.nodes.name = document.createElement('th');
                self.nodes.name.className = 'name';
                self.nodes.name.dataset.sortBy = 'name';
                self.nodes.name.dataset.orderBy = 'asc';
                self.nodes.name.dataset.languageKey = 'name';
                self.nodes.name.textContent = self.dictionary.t(['userTable', 'tHead', 'name']);
                return self.nodes.name;
            },
            email: function() {
                self.nodes.email = document.createElement('th');
                self.nodes.email.className = 'email';
                self.nodes.email.dataset.sortBy = 'email';
                self.nodes.email.dataset.orderBy = 'asc';
                self.nodes.email.dataset.languageKey = 'email';
                self.nodes.email.textContent = self.dictionary.t(['userTable', 'tHead', 'email']);
                return self.nodes.email;
            },
            birth: function() {
                self.nodes.birth = document.createElement('th');
                self.nodes.birth.className = 'birth';
                self.nodes.birth.dataset.sortBy = 'birth';
                self.nodes.birth.dataset.orderBy = 'asc';
                self.nodes.birth.dataset.languageKey = 'birth';
                self.nodes.birth.textContent = self.dictionary.t(['userTable', 'tHead', 'birth']);
                return self.nodes.birth;
            },
            date: function() {
                self.nodes.time = document.createElement('th');
                self.nodes.time.className = 'date';
                self.nodes.time.dataset.sortBy = 'date';
                self.nodes.time.dataset.orderBy = 'asc';
                self.nodes.time.dataset.languageKey = 'time';
                self.nodes.time.textContent = self.dictionary.t(['userTable', 'tHead', 'time']);
                return self.nodes.time;
            },
            del: function(){
                self.nodes.delete = document.createElement('th');
                self.nodes.delete.className = 'delete';
                self.nodes.delete.dataset.languageKey = 'delete';
                self.nodes.delete.textContent = self.dictionary.t(['userTable', 'tHead', 'delete']);
                return self.nodes.delete;
            },
            edit: function() {
                self.nodes.edit = document.createElement('th');
                self.nodes.edit.className = 'edit';
                self.nodes.edit.dataset.languageKey = 'edit';
                self.nodes.edit.textContent = self.dictionary.t(['userTable', 'tHead', 'edit']);
                return self.nodes.edit;
            }
        };

        // listeners
        this.el.addEventListener('click', this.handlerSort.bind(this, this));

        // put to container
        App.serviceContainer.template.userTableThead = this;
    }

    Head.prototype.handlerSort = function(self, event) {
        var el = event.target;

        if(el.className === 'delete' || el.className === 'edit') return false;

        var direction = el.dataset.orderBy;
        var param = el.dataset.sortBy;

        for(var index in self.nodes) {
            var item = self.nodes[index];
            var sort = item.dataset.sortBy;

            item.classList.remove('active');
            item.classList.remove('desc');
            item.classList.remove('asc');

            if(sort === param) {
                item.classList.add('active');

                if(direction === 'asc') {
                    item.classList.add('asc');
                } else {
                    item.classList.add('desc');
                }

                item.dataset.orderBy = (direction === 'desc') ? 'asc' : 'desc';
            }
        }

        self.sortCollection(direction, param);
    };

    Head.prototype.sortCollection = function(direction, param) {
        var tBody = this.container.template.userTableTbody;
        tBody.render({type: 'sort', direction: direction, param: param});
    };

    Head.prototype.render = function() {
        var row = document.createElement('tr');
        var fragment = document.createDocumentFragment();
        var arr = this.renderOrder;

        for(var i = 0; i < arr.length; i++) {
            var field = arr[i];
            var el = this.fields[field]();
            fragment.appendChild(el);
        }

        row.appendChild(fragment);
        this.el.appendChild(row);
        return this.el;
    };

    Head.prototype.destroy = function() {
        this.tableEl.el.removeChild(this.el);
    };

    App.View.UserTable.Head = Head;
})(App, document);