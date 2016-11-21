/**
 * Created by s.evdokimov on 08.11.2016.
 */

(function(App, document) {

    function initApp() { // TODO refactor ServiceContainer
        var user = new App.Model.User();

        user.load().then(function() {
            var view = new App.View({users: user.records});
            view.render();
        });
    }

    document.addEventListener('DOMContentLoaded', function() {
        App.container = document.getElementById('app');
        initApp();
    });
})(App, document);