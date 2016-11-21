/**
 * Created by s.evdokimov on 21.11.2016.
 */

(function(App){

    function Tooltip() {
        this.entity = 'tooltip';
        this.container = App.serviceContainer;

        // put to container
        App.serviceContainer.tooltip = this;
    }

    Tooltip.prototype = new App.Model();

    Tooltip.prototype.onCreateTooltipSuccess = function(result) {
        this.records = result;
        return this.records;
    };

    Tooltip.prototype.onCreateTooltipError = function(error) {
        console.warn('ERROR', error);
        return error;
    };

    Tooltip.prototype.create = function(data) {
        var self = this;
        return this.xhrCreate({
            entity: this.entity,
            payload: data,
            success: this.onCreateTooltipSuccess.bind(self),
            error: this.onCreateTooltipError.bind(self)
        });
    };

    App.Model.Tooltip = Tooltip;
})(App);