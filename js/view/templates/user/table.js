/**
 * Created by s.evdokimov on 08.11.2016.
 */

(function(App) {

    function Table(options) {
        this.el = document.createElement('table');
        this.el.className = 'table';
        this.el.dataset.languageKey = 'userTable';
        this.rootView = options.rootView;
        this.container = App.serviceContainer;
        this.tooltip;
        this.collection = {
            user: options.userCollection
        };

        // components
        this.tHead = new App.View.UserTable.Head({
            collection: this.collection,
            tableEl: this
        });
        this.tBody = new App.View.UserTable.Body({
            collection: this.collection,
            tableEl: this
        });

        // listeners
        this.el.addEventListener('mousemove', this.handlerTooltip.bind(this, this));
        this.el.addEventListener('mouseout', this.handlerTooltip.bind(this, this));
        this.el.addEventListener('mouseover', this.handlerTooltip.bind(this, this));

        // put to container
        App.serviceContainer.template.userTable = this;
    }

    Table.prototype.handlerTooltip = function(self, event) {
        var el = event.target;
        var type = event.type;

        if(el.tagName == 'TD' && el.dataset.tooltip) {
            if(!self.tooltip) self.tooltip = new App.Lib.Tooltip();

            var tooltipType = el.dataset.tooltip;
            var id = el.parentNode.querySelector('.id').textContent;

            switch(type) {
                case 'mouseover':
                   self.tooltip.create(tooltipType, id, {x: event.pageX, y: event.pageY});
                break;
                case 'mouseout':
                    self.tooltip.remove();
                    delete self.tooltip;
                break;
                case 'mousemove':
                    self.tooltip.move({x: event.pageX, y: event.pageY});
                break;
            }
        }
    };

    Table.prototype.render = function () {
        this.el.appendChild(this.tHead.render());
        this.el.appendChild(this.tBody.render());
        return this.el;
    };

    App.View.UserTable = Table;
})(App);