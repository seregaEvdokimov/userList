/**
 * Created by s.evdokimov on 08.11.2016.
 */

(function(App){
    'use strict';

    function Model() {
        this.entity = '';
        this.records = [];
    }

    Model.prototype.xhrLoad = function(options) {
        return App.Request.load(options);
    };

    Model.prototype.xhrUpdate = function(options) {
        return App.Request.update(options);
    };

    Model.prototype.xhrDelete = function(options) {
        return App.Request.delete(options);
    };

    Model.prototype.xhrCreate = function(options) {
        return App.Request.create(options);
    };

    App.Model = Model;
})(App);