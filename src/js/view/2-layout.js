/**
 * Created by s.evdokimov on 02.12.2016.
 */

(function(App, document){
    'use strict';

    function Layout(options) {
        this.el = document.createElement('div');
        this.el.className = 'layout-wrapper';

        this.container = App.serviceContainer;
        this.rootView = options.rootView;
        this.collection = {
            user: options.userCollection
        };

        this.options = options;
        this.options.collection = this.collection;
        this.options.layoutEl = this;

        // components
        this.state = {};
        this.state.usersTable = new App.View.UserTable(this.options);
        this.state.optionBlock = new App.View.Option(this.options);

        // put to container
        App.serviceContainer.template.layout = this;
    }

    Layout.prototype.change = function(state) {
        var type = state.route.slice(1);

        // очищаем предыдущее состояние
        for(var index in this.state) {
            this.state[index].destroy();
            delete this.state[index];
        }

        // определяем тип слоя и подключаем нужные компонеты
        switch(type) {
            case 'index':
                this.state.usersTable = new App.View.UserTable(this.options);
                this.state.optionBlock = new App.View.Option(this.options);
                break;
            case 'user':
                this.state.person = new App.View.Person(this.options, state);
                break;
        }

        // рендерим компоненты
        this.render();
    };

    Layout.prototype.render = function() {
        for(var component in this.state) {
            this.el.appendChild(this.state[component].render());
        }
        return this.el;
    };

    App.View.Layout = Layout;
})(App, document);