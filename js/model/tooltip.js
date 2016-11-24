/**
 * Created by s.evdokimov on 21.11.2016.
 */

(function(App){

    function Tooltip() {
        this.entity = 'tooltip';
        this.container = App.serviceContainer;

        // put to container
        App.serviceContainer.model.tooltip = this;
    }

    Tooltip.prototype = new App.Model();

    Tooltip.prototype.onLoadTooltipSuccess = function(result) {
        this.records = result;
        return this.records;
    };

    Tooltip.prototype.onLoadTooltipError = function(error) {
        console.warn('ERROR', error);
        return error;
    };

    Tooltip.prototype.load = function(data) {
        var self = this;
        return this.xhrLoad({
            entity: this.entity,
            payload: data,
            success: this.onLoadTooltipSuccess.bind(self),
            error: this.onLoadTooltipError.bind(self)
        });
    };

    App.Model.Tooltip = Tooltip;
})(App);