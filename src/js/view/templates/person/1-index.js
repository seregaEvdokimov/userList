/**
 * Created by s.evdokimov on 02.12.2016.
 */

(function(App, document) {

    function Person(option, params) {
        var self = this;
        this.el = document.createElement('div');
        this.el.className = 'person-wrapper';
        this.userModel = new App.Model.User();

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

        var infoBlock = document.createElement('div');
        var avatar = document.createElement('img');
        var fragment = document.createDocumentFragment();

        self.userModel.load({type: 'findById', id: self.params.id}).then(function(res) {
            var user = res.user;

            avatar.setAttribute('src', user.avatar);
            infoBlock.className = 'info';

            var arr = self.renderOrder;
            for(var i = 0; i < arr.length; i++) {
                var field = arr[i];
                var el = self.fields[field](user);
                fragment.appendChild(el);
            }

            infoBlock.appendChild(fragment);
        });


        this.el.appendChild(avatar);
        this.el.appendChild(infoBlock);
        return this.el;
    };

    Person.prototype.destroy = function() {
        this.layoutEl.el.removeChild(this.el);
    };


    App.View.Person = Person;
})(App, document);
