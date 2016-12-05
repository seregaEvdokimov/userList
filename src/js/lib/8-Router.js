/**
 * Created by s.evdokimov on 02.12.2016.
 */

(function(App) {
    'use strict';

    var Router = {
        layout: App.serviceContainer,
        route: function(url, state) {
            var layout = App.serviceContainer.template.layout;

            var search = location.search.split('/')[0];
            state.route = url;

            history.pushState(state, null, search + url);
            layout.change(state);
            localStorage.setItem('routeState', JSON.stringify(state));
        },
        updateState: function(self, event) {
            var layout = App.serviceContainer.template.layout;
            var state = event.state ? event.state: {route: '/index'};

            layout.change(state);
        }
    };

    window.addEventListener('popstate', Router.updateState.bind(window, Router));
    window.addEventListener('load', function() {
        var layout = App.serviceContainer.template.layout;
        var routeState = JSON.parse(localStorage.getItem('routeState'));
        layout.change(routeState);
    });

    App.serviceContainer.lib.router = Router;
    App.Lib.Router = Router;
})(App, window);