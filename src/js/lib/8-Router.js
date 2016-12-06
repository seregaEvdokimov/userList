/**
 * Created by s.evdokimov on 02.12.2016.
 */

(function(App) {
    'use strict';

    var Router = {
        layout: App.serviceContainer,
        route: function(path) {
            var layout = App.serviceContainer.template.layout;
            var search = location.search.split('#')[0];
            history.pushState({}, null, search + path);

            var url = this.parseUrl();
            layout.change(url.type, url.params);
        },
        parseUrl: function() {
            if(location.hash == '') return {type: 'index', params: {}};

            var match = location.hash.match(/#\/(.*)/)[1].split('/');
            var type = match[0];
            var params = {};

            for(var i = 1; i < match.length; i++) {
                i % 2 == 0 ? params[match[i - 1]] = match[i] : params[match[i]] = true;
            }

            return {type: type, params: params};
        },
        updateState: function(self, event) {
            var url = self.parseUrl();
            var layout = App.serviceContainer.template.layout;

            layout.change(url.type, url.params);
        }
    };

    window.addEventListener('popstate', Router.updateState.bind(window, Router));
    window.addEventListener('load', Router.updateState.bind(window, Router));

    App.serviceContainer.lib.router = Router;
    App.Lib.Router = Router;
})(App, window);