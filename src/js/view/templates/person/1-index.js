/**
 * Created by s.evdokimov on 02.12.2016.
 */

(function(App, document) {

    function Person(option, params) {
        var self = this;
        this.el = document.createElement('div');
        this.el.className = 'person-wrapper';

        this.nodes = {};
        this.renderOrder = ['id', 'name', 'email'];
        this.fields = {
            id: function(data) {
                self.nodes.id = document.createElement('p');
                self.nodes.id.className = 'id';
                self.nodes.id.textContent = '№ ' + data.id;
                return self.nodes.id;
            },
            name: function(data) {
                self.nodes.name = document.createElement('p');
                self.nodes.name.className = 'id';
                self.nodes.name.textContent = data.name;
                return self.nodes.name;
            },
            email: function(data) {
                self.nodes.email = document.createElement('p');
                self.nodes.email.className = 'id';
                self.nodes.email.textContent = data.email;
                return self.nodes.email;
            }
        };

        this.layoutEl = option.layoutEl;
        this.collection = option.collection;
        this.params = params;
    }

    Person.prototype.render = function() {
        var self = this;
        var find = this.collection.user.filter(function(item) {
            return item.id == self.params.id
        });
        find = find[0];

        var avatar = document.createElement('img');
        avatar.setAttribute('src', find.avatar);

        var infoBlock = document.createElement('div');
        infoBlock.className = 'info';

        var fragment = document.createDocumentFragment();
        var arr = this.renderOrder;
        for(var i = 0; i < arr.length; i++) {
            var field = arr[i];
            var el = this.fields[field](find);
            fragment.appendChild(el);
        }

        infoBlock.appendChild(fragment);
        this.el.appendChild(avatar);
        this.el.appendChild(infoBlock);
        return this.el;
    };

    Person.prototype.destroy = function() {
        this.layoutEl.el.removeChild(this.el);
    };


    App.View.Person = Person;
})(App, document);
