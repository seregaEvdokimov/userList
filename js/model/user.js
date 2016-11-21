/**
 * Created by s.evdokimov on 08.11.2016.
 */

(function(App){

    function User() {
        this.entity = 'user';
        this.container = App.serviceContainer;

        // put to container
        App.serviceContainer.user = this;
    }

    User.prototype = new App.Model();

    User.prototype.onLoadUserSuccess = function(result) {
        this.records = result;
        return this.records;
    };

    User.prototype.onLoadUserError = function(error) {
        console.warn('ERROR', error);
        return error;
    };

    User.prototype.onUpdateUserSuccess = function(result) {
        var findIndex;

        this.records.forEach(function (item, index) {
            if(item.id === result.id) {
                findIndex = index;
            }
        });

        this.records.splice(findIndex, 1, result);
        return result;
    };

    User.prototype.onUpdateUserError = function(error) {
        console.warn('ERROR', error);
        return error;
    };

    User.prototype.onDeleteUserSuccess = function(result) {
        var findIndex;

        this.records.forEach(function (item, index) {
            if(item.id === result.id) {
                findIndex = index;
            }
        });

        this.records.splice(findIndex, 1);
        return result;
    };

    User.prototype.onDeleteUserError = function(error) {
        console.warn('ERROR', error);
        return error;
    };

    User.prototype.onCreateUserSuccess = function(result) {
        this.records.push(result);
        return result;
    };

    User.prototype.onCreateUserError = function(error) {
        return error;
    };

    User.prototype.load = function() {
        var self = this;
        return this.xhrLoad({
            entity: this.entity,
            success: this.onLoadUserSuccess.bind(self),
            error: this.onLoadUserError.bind(self)
        });
    };

    User.prototype.update = function(data) {
        var self = this;
        return this.xhrUpdate({
            entity: this.entity,
            payload: data,
            success: this.onUpdateUserSuccess.bind(self),
            error: this.onUpdateUserError.bind(self)
        });
    };

    User.prototype.delete = function(id) {
        var self = this;
        return this.xhrDelete({
            entity: this.entity,
            payload: {id: id},
            success: this.onDeleteUserSuccess.bind(self),
            error: this.onDeleteUserError.bind(self)
        });
    };

    User.prototype.create = function(data) {
        var self = this;
        return this.xhrCreate({
            entity: this.entity,
            payload: data,
            success: this.onCreateUserSuccess.bind(self),
            error: this.onCreateUserError.bind(self)
        });
    };

    App.Model.User = User;
})(App);