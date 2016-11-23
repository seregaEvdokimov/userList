/**
 * Created by s.evdokimov on 22.11.2016.
 */

(function() {

    var Event = {
        eventCollection: [],

        addListener: function(eventType, eventHandler) {
            this.eventCollection.push({
                eventType: eventType,
                eventHandler: eventHandler
            });
        },

        dispatch: function(eventType, args) {
            this.eventCollection.forEach(function(event) {
                if(eventType === event.eventType) {
                    event.eventHandler(args);
                }
            });
        }
    };

    App.serviceContainer.lib.event = Event;
    App.Lib.Event = Event;
})(App);