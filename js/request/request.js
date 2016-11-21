/**
 * Created by s.evdokimov on 08.11.2016.
 */

(function(App) {

    var baseUrl = 'http://localhost:4000/';

    App.Request = {
        load: function(options) {
            var URL = this.generateFullUrl(options.entity);
            var xhr = new App.Request.XHR({
                method: 'GET',
                URL: URL,
                options: options
            });

            return xhr.sendRequest();
        },

        update: function(options) {
            var URL = this.generateFullUrl(options.entity);
            var xhr = new App.Request.XHR({
                method: 'PUT',
                URL: URL,
                options: options
            });

            return xhr.sendRequest();
        },

        delete: function(options) {
            var URL = this.generateFullUrl(options.entity);
            var xhr = new App.Request.XHR({
                method: 'DELETE',
                URL: URL,
                options: options
            });

            return xhr.sendRequest();
        },

        create: function(options) {
            var URL = this.generateFullUrl(options.entity);
            var xhr = new App.Request.XHR({
                method: 'POST',
                URL: URL,
                options: options
            });

            return xhr.sendRequest();
        },

        generateFullUrl: function(entity) {
            var fragmentUrl = '';
            switch (entity) {
                case 'user':
                    fragmentUrl = 'user';
                    break;
                case 'tooltip':
                    fragmentUrl = 'tooltip';
                    break;
            }

            return baseUrl + fragmentUrl;
        }
    };

})(App);