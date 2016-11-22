/**
 * Created by s.evdokimov on 16.11.2016.
 */

(function(App, document, window) {
    function Tooltip() {
        this.el = document.createElement('div');
        this.el.className = 'tooltip';
        this.tooltipModel = new App.Model.Tooltip();
        this.hover = false;

        this.types = {
            name: ['image', 'text'],
            email: ['email']
        };
        this.fields = {
            image: function(data) {
                var imgEl = document.createElement('img');
                imgEl.setAttribute('src', data.img);
                return imgEl;
            },
            text: function(data) {
                var nameEl = document.createElement('p');
                nameEl.textContent = data.text;
                return nameEl;
            },
            email: function(data) {
                var nameEl = document.createElement('p');
                var countEl = document.createElement('mark');

                nameEl.textContent = 'Количество непрочитанных писем';
                countEl.textContent = data.text;

                nameEl.appendChild(countEl);
                return nameEl;
            }
        };
    }

    Tooltip.prototype.getX = function (x) {
        var widthEl = this.el.clientWidth;
        var widthPage = window.innerWidth < document.body.clientWidth
            ? window.innerWidth
            : document.body.clientWidth;

        if((x + widthEl) > widthPage) {
            x = (x - widthEl < 0) ? 0: x - widthEl;
        }

        return x;
    };

    Tooltip.prototype.getY = function (y) {
        var heightEl = this.el.clientHeight;
        var heightPage = window.innerHeight < document.body.clientHeight
            ? window.innerHeight
            : document.body.clientHeight;

        if((y + heightEl) > heightPage) {
            y = (y - heightEl < 0) ? 0: y - heightEl;
        }

        return y;
    };

    Tooltip.prototype.calcPosition = function(cords) {
        var x = this.getX(cords.x + 15);
        var y = this.getY(cords.y + 15);

        return {x: x, y: y};
    };

    Tooltip.prototype.show = function(cords) {
        this.el.style.display = 'block';
        var position = this.calcPosition(cords);

        this.el.style.top = position.y + 'px';
        this.el.style.left = position.x + 'px';
    };

    Tooltip.prototype.hide = function() {
        this.el.style.display = 'none';
    };

    Tooltip.prototype.move = function(cords) {
        var position = this.calcPosition(cords);
        this.el.style.top = position.y + 'px';
        this.el.style.left = position.x + 'px';
    };

    Tooltip.prototype.create = function(type, id, cords) {
        var self = this;
        this.hover = true;

        setTimeout(function(){
            if(self.hover) {
                self.tooltipModel.load({id: id, type: type}).then(function(res) {
                    self.render(type, res);
                    self.show(cords);
                });
            }
        }, 500);

        return this;
    };

    Tooltip.prototype.remove = function() {
        var elements = Array.prototype.slice.apply(document.body.querySelectorAll('.tooltip'));

        elements.map(function(item) {
            document.body.removeChild(item);
        });

        this.hover = false;
    };

    Tooltip.prototype.render = function(type, data) {
        var tooltipWrapper = document.createElement('div');
        tooltipWrapper.className = 'tooltip-' + type;

        var fragment = document.createDocumentFragment();
        var tooltipFields = this.types[type];

        for(var i = 0; i < tooltipFields.length; i++) {
            var field = tooltipFields[i];
            var el = this.fields[field](data);
            fragment.appendChild(el);
        }

        tooltipWrapper.appendChild(fragment);
        this.el.appendChild(tooltipWrapper);
        document.body.appendChild(this.el);

        return this.el;
    };

    App.Lib.Tooltip = Tooltip;
})(App, document, window);

