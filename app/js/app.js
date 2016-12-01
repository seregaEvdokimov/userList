/**
 * Created by s.evdokimov on 08.11.2016.
 */

(function (w) {
    'use strict';

    w.App = { // TODO render app into App.container
        container: null,
        Model: {},
        Lib: {},
        View: {},
        currentLanguage: 'ru',
        showNotify: true,
        serviceContainer: {
            template: {},
            lib: {},
            model: {}
        },
        pagination: {
            type: 'lazyLoad', // pagination
            currentPage: 1,
            perPage: 8
        }
    };

})(window);
/**
 * Created by s.evdokimov on 28.11.2016.
 */

(function() {
    'use strict';

    var Dictionary = {
        ru: {
            header: {
                settings: {
                    label: 'Выключить оповещение'
                },
                languages: {},
                search: {
                    button: 'Поиск'
                }
            },
            userTable: {
                tHead: {
                    id: '№',
                    name: 'Имя',
                    email: 'Email',
                    birth: 'День рождения',
                    time: 'Расчетное время',
                    delete: 'Удалить',
                    edit: 'Редактировать'
                },
                tBody: {
                    delete: 'Удалить',
                    edit: 'Редактировать'
                }
            },
            modal: {
                create: {
                    caption: 'Добавить нового клиента',
                    avatar: 'Загрузить аватар',
                    name: 'Введите имя',
                    email: 'Введите email',
                    birth: 'Укажите день рождения',
                    time: 'Укажите расчётное время',
                    save: 'Сохранить',
                    cancel: 'Отмена'
                },
                edit: {
                    caption: 'Редактировать клиента',
                    avatar: 'Загрузить аватар',
                    name: 'Введите новое имя',
                    email: 'Введите новый email',
                    birth: 'Изменить день рождения',
                    time: 'Изменить расчётное время',
                    save: 'Сохранить',
                    cancel: 'Отмена'
                },
                confirm: {
                    message: 'Есть изменения. Сохранить?',
                    save: 'Сохранить',
                    cancel: 'Отмена'
                }
            },
            option: {
                adduser: 'Добавить клиента'
            },
            notify: {
                createUser: 'Добавлен пользователь: %name',
                timePassed: 'У пользователя %name (№ %id) вышло время!',
                deleteUser: 'Удалён пользователь: %name (№ %id)'
            }
        },
        en: {
            header: {
                settings: {
                    label: 'Turn off notifications'
                },
                languages: {},
                search: {
                    button: 'Search'
                }
            },
            userTable: {
                tHead: {
                    id: 'ID',
                    name: 'Name',
                    email: 'Email',
                    birth: 'Date of birth',
                    time: 'Estimated time',
                    delete: 'Delete',
                    edit: 'Edit'
                },
                tBody: {
                    delete: 'Delete',
                    edit: 'Edit'
                }
            },
            modal: {
                create: {
                    caption: 'Add new client',
                    avatar: 'Upload Avatar',
                    name: 'Enter name',
                    email: 'Enter email',
                    birth: 'Enter birthday',
                    time: 'Enter the estimated time',
                    save: 'Save',
                    cancel: 'Cancel'
                },
                edit: {
                    caption: 'Edit client',
                    avatar: 'Upload Avatar',
                    name: 'Enter name',
                    email: 'Enter email',
                    birth: 'Enter birthday',
                    time: 'Enter the estimated time',
                    save: 'Save',
                    cancel: 'Cancel'
                },
                confirm: {
                    message: 'There are changes. Save?',
                    save: 'save',
                    cancel: 'cancel'
                }
            },
            option: {
                adduser: 'Add client'
            },
            notify: {
                createUser: 'User added: %name',
                timePassed: 'User Name %name (№ %id) came time!',
                deleteUser: 'Deleted user: %name (№ %id)'
            }
        },
        patterns: {
            name: /(%name)/g,
            id: /(%id)/g
        },
        event: App.Lib.Event,
        t: function(keys) { // translate
            var words = this[App.currentLanguage];

            var iter = function(list, acc) {
                if(list.length <= 1) return acc[list[0]];

                if(list.length > 1) acc = acc[list.shift()];
                return iter(list, acc);
            };

            return iter(keys, words);
        },
        getMessage: function(params, keys) {
            var str = this.t(keys);
            for(var index in params) {
                str = str.replace(this.patterns[index], params[index]);
            }

            return str;
        },
        selectLang: function(lang) {
            App.currentLanguage = lang;
            this.event.dispatch('languageChange');
        }
    };

    App.serviceContainer.lib.dictionary = Dictionary;
    App.Lib.Dictionary = Dictionary;
})(App);
/**
 * Created by s.evdokimov on 22.11.2016.
 */

(function() {
    'use strict';

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
/**
 * Created by s.evdokimov on 15.11.2016.
 */

(function() {
    'use strict';

    function ProgressBarTimer(data, element) {
        this.element = element;
        this.startTime = new Date(data.start).getTime();
        this.finishTime = new Date(data.end).getTime();
        this.className = '';
        this.percent = null;
        this.timer = new App.Lib.Timer({start: data.start, end: data.end}, this.timerCb.bind(this));

        this.progressCalc();
        this.showProgress();
    }

    ProgressBarTimer.prototype.start = function() {
        this.timer.start();
    };

    ProgressBarTimer.prototype.stop = function() {
        this.timer.stop();
    };

    ProgressBarTimer.prototype.timerCb = function() {
        this.progressCalc();
        this.showProgress();
    };

    ProgressBarTimer.prototype.getClassName = function() {
        return this.className;
    };

    ProgressBarTimer.prototype.getPercent = function() {
        return this.percent;
    };

    ProgressBarTimer.prototype.update = function(data) {
        this.startTime = new Date(data.start).getTime();
        this.finishTime = new Date(data.end).getTime();

        this.progressCalc();
        this.showProgress();
    };

    ProgressBarTimer.prototype.showProgress = function() {
        this.getClassName() == 'positive' ? this.element.classList.remove('negative') : this.element.classList.remove('positive');

        this.element.style.width = this.getPercent() + '%';
        this.element.classList.add(this.getClassName());
    };

    ProgressBarTimer.prototype.progressCalc = function() {
        var difference = this.finishTime - this.startTime;
        var current = Date.now() - this.startTime;
        this.percent = current * 100 / difference;

        this.className = (this.percent >= 0 && this.percent <= 100) ? 'positive': 'negative';
        this.percent = (this.percent >= 0 && this.percent <= 100) ? this.percent : 100;
    };

    App.Lib.ProgressBarTimer = ProgressBarTimer;
})(App);
/**
 * Created by s.evdokimov on 14.11.2016.
 */

(function(App) {
    'use strict';

    function Timer(data, cb) {
        this.startTime = new Date(data.start).getTime();
        this.finishTime = new Date(data.end).getTime();
        this.intervalId = null;
        this.active = false;
        this.cb = cb;
    }

    Timer.prototype.update = function(data) {
        this.startTime = new Date(data.start).getTime();
        this.finishTime = new Date(data.end).getTime();
    };

    Timer.prototype.start = function() {
        var self = this;

        if(this.active === true) {
            return false;
        }

        this.active = true;
        this.intervalId = setInterval(function() {
            self.cb();
        }, 1000);
    };

    Timer.prototype.stop = function() {
        this.active = false;
        clearInterval(this.intervalId);
    };

    App.Lib.Timer = Timer;
})(App);
/**
 * Created by s.evdokimov on 16.11.2016.
 */

(function(App, document, window) {
    'use strict';

    function Tooltip() {
        this.el = document.createElement('div');
        this.el.className = 'tooltip';
        this.tooltipModel = new App.Model.Tooltip();
        this.intervalId = null;

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
        var widthPage = window.innerWidth < document.body.clientWidth ? window.innerWidth : document.body.clientWidth;

        if((x + widthEl) > widthPage) {
            x = (x - widthEl < 0) ? 0: x - widthEl;
        }

        return x;
    };

    Tooltip.prototype.getY = function (y) {
        var heightEl = this.el.clientHeight;
        var heightPage = window.innerHeight < document.body.clientHeight ? window.innerHeight : document.body.clientHeight;

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

        this.intervalId = setTimeout(function(){
            self.tooltipModel.load({id: id, type: type}).then(function(res) {
                self.render(type, res);
                self.show(cords);
            });
        }, 500);

        return this;
    };

    Tooltip.prototype.remove = function() {
        var elements = Array.prototype.slice.apply(document.body.querySelectorAll('.tooltip'));

        elements.map(function(item) {
            document.body.removeChild(item);
        });

        clearInterval(this.intervalId);
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


/**
 * Created by s.evdokimov on 17.11.2016.
 */

(function(App) {
    'use strict';

    var Validator = {

        pattern: {
            name: /^\w+\s*\w*$/i,
            email: /^[\w\.]+@\w+\.\w+$/i,
            image: /^image.+$/i
        },

        checkImage: function(node) {
            var nameImg = node.dataset.img;
            if(nameImg) return {valid: true, className: 'success'};

            var fileList = node.files;
            if(!fileList[0]) return {valid: false, className: 'error'};

            var type = fileList[0].type;
            return this.pattern.image.test(type) ? {valid: true, className: 'success'} : {valid: false, className: 'error'};
        },
        checkName: function(str) {
            return this.pattern.name.test(str) ? {valid: true, className: 'success'} : {valid: false, className: 'error'};
        },
        checkEmail: function(str) {
            return this.pattern.email.test(str) ? {valid: true, className: 'success'} : {valid: false, className: 'error'};
        },
        checkStartDate: function(data) {
            var date = data.date || '';
            var time = data.time || '';
            var strTime = date + ' ' + time;

            var startDate = new Date(strTime).getTime();
            var currentDate = new Date().getTime();

            return startDate < currentDate ? {valid: true, className: 'success'} : {valid: false, className: 'error'};
        },
        checkFinishDate: function(data) {
            var date = data.date || '';
            var time = data.time || '';
            var strTime = date + ' ' + time;

            var finishDate = new Date(strTime).getTime();
            var currentDate = new Date().getTime();

            return finishDate > currentDate ? {valid: true, className: 'success'} : {valid: false, className: 'error'};
        }
    };

    App.serviceContainer.lib.validator = Validator;
    App.Lib.Validator = Validator;
})(App);
/**
 * Created by s.evdokimov on 17.11.2016.
 */

(function(App, document) {
    'use strict';

    function ImageUploader() {
        this.fileReader = new FileReader();
        this.callback = null;
        this.element = null;
    }

    ImageUploader.prototype.read = function(node, callback) {
        node.dataset.img = null;
        var result = App.Lib.Validator.checkImage(node);

        node.classList.add(result.className);
        if(!result.valid) return false;

        this.callback = callback;
        this.element = node;

        var fileList = node.files;
        this.fileReader.readAsDataURL(fileList[0]);
        this.fileReader.onload = this.insertImage.bind(this);
    };

    ImageUploader.prototype.insertImage = function(event) {
        var file = event.target.result;
        file = this.drawImage(file);

        var parent = this.element.parentNode;
        var images = parent.querySelector('img');

        var img = document.createElement('img');
        img.setAttribute('src', file);
        this.element.dataset.img = file;

        images ? images.replaceWith(img) : parent.insertBefore(img, this.element);
        this.callback(file);
    };

    ImageUploader.prototype.drawImage = function(file) {

        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');

        var img = new Image();
        img.src = file;

        var width = 195;
        var height = 135;

        var x_ratio = width / img.width;
        var y_ratio = height / img.height;

        var ratio = Math.min(x_ratio, y_ratio);
        var use_ratio = x_ratio < y_ratio ? 1 : 0;

        var w = use_ratio ? width : Math.ceil(img.width * ratio);
        var h = !use_ratio ? height : Math.ceil(img.height * ratio);

        canvas.setAttribute('width', w + 'px');
        canvas.setAttribute('height', h + 'px');
        ctx.drawImage(img, 0, 0,  w, h);

        file = canvas.toDataURL();
        return file;
    };

    App.Lib.ImageUploader = ImageUploader;
})(App, document);
/**
 * Created by s.evdokimov on 08.11.2016.
 */

(function(App) {
    'use strict';

    var baseUrl = 'http://localhost:4000/';

    App.Request = {
        load: function(options) {
            var URL = this.generateFullUrl(options.entity, options.payload);
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

        generateFullUrl: function(entity, params) {
            var queryString = this.createQueryString(params);
            var fragmentUrl = '';
            switch (entity) {
                case 'user':
                    fragmentUrl = 'user';
                    break;
                case 'tooltip':
                    fragmentUrl = 'tooltip';
                    break;
            }

            return baseUrl + fragmentUrl + queryString;
        },

        createQueryString: function(params) {
            if(!params) return '';

            var str = '?';
            for(var index in params) {
                str += index + '=' + params[index] + '&';
            }

            str = str.slice(0, -1);
            return str;
        }
    };

})(App);
/**
 * Created by s.evdokimov on 08.11.2016.
 */

(function(App) {
    'use strict';

    function XHR(config) {
        this.xhr = new XMLHttpRequest();
        this.method = config.method;
        this.URL = config.URL;
        this.config = config.options;
        this.paramsBody = '';

        if('payload' in this.config) {
            this.paramsBody = this.createParamsBody(this.config.payload);
        }
    }

    XHR.prototype.sendRequest = function() {
        var self = this;
        return new Promise(function(resolve, reject) {
            self.xhr.open(self.method, self.URL, true);
            self.xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            self.xhr.addEventListener('readystatechange', self.readyStateChangeHandler.bind(self, resolve, reject));
            self.xhr.send(self.paramsBody);
        });
    };

    XHR.prototype.createParamsBody = function(data) {
        var str = '';
        for (var key in data) {
            str += key + '=' + encodeURIComponent(data[key] + '') + '&';
        }
        return str;
    };

    XHR.prototype.readyStateChangeHandler = function (resolve, reject) {
        if (this.xhr.readyState !== 4) {
            return;
        }
        if (this.xhr.status >= 200 && this.xhr.status < 300) {
            var pageResult = JSON.parse(this.xhr.responseText);
            resolve(this.config.success(pageResult));
        } else {
            var errorText = 'error: ' + (this.xhr.status ? this.xhr.statusText : 'problems with request');
            reject(this.config.error(errorText));
        }
    };

    App.Request.XHR = XHR;
})(App);

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
/**
 * Created by s.evdokimov on 21.11.2016.
 */

(function(App){
    'use strict';

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
/**
 * Created by s.evdokimov on 08.11.2016.
 */

(function(App){
    'use strict';

    function User() {
        this.entity = 'user';
        this.container = App.serviceContainer;

        // put to container
        App.serviceContainer.model.user = this;
    }

    User.prototype = new App.Model();

    User.prototype.onLoadUserSuccess = function(result) {
        var self = this;

        if(result.length) {
            result.forEach(function(item) {
                self.records.push(item);
            });
        }

        return result;
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

    User.prototype.load = function(data) {
        var self = this;
        return this.xhrLoad({
            entity: this.entity,
            payload: data,
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
/**
 * Created by s.evdokimov on 08.11.2016.
 */

(function(App, document){
    'use strict';

    function View(collection) {
        this.container = App.serviceContainer;
        this.event = App.Lib.Event;
        this.dictionary = this.container.lib.dictionary;

        // components
        this.header = new App.View.Header({
            userCollection: collection.users,
            rootView: this
        });

        this.usersTable = new App.View.UserTable({
            userCollection: collection.users,
            rootView: this
        });

        this.modalWindow = new App.View.Modal({
            userCollection: collection.users,
            rootView: this
        });

        this.optionBlock = new App.View.Option({
            userCollection: collection.users,
            rootView: this
        });

        this.notifyBlock = new App.View.Notify({
            userCollection: collection.users,
            rootView: this
        });


        // listeners
        document.addEventListener('keydown', this.handlerKeyPress.bind(this, this));
        this.event.addListener('languageChange', this.localization.bind(this));

        // put to container
        App.serviceContainer.template.rootView = this;
    }

    View.prototype.handlerKeyPress = function(self, event) {
        if(event.which != 27) {
            return false;
        }

        self.modalWindow.el.click();
    };

    View.prototype.render = function() {
        App.container.appendChild(this.header.render());
        App.container.appendChild(this.usersTable.render());
        App.container.appendChild(this.modalWindow.render());
        App.container.appendChild(this.optionBlock.render());
        App.container.appendChild(this.notifyBlock.render());
    };

    View.prototype.localization = function() {
        var ast = this.createAST(App.container);
        this.translate(ast, '');

        return true;
    };

    View.prototype.translate = function(node, acc) {
        var self = this;
        acc += node.key + '|';

        if(node.children.length) {
            node.children.forEach(function(item) {
                return self.translate(item, acc);
            });
        } else {
            var keys = acc.substring(0, acc.length - 1).split('|');

            var params = keys.reduce(function(acc, item) {
                if(item !== '') acc.push(item);
                return acc;
            }, []);

            var str = self.dictionary.t(params);
            if('string' == typeof str) node.el.textContent = str;
        }

        return true;
    };

    View.prototype.createAST = function(element) {
        var self = this;
        var item = {};
        item.key = '';
        item.el = null;
        item.children = [];

        if(element.dataset.languageKey) item.key = element.dataset.languageKey;
        item.el = element;

        var elements = [];
        if(element.childNodes) elements = [].slice.apply(element.childNodes);

        elements = elements.reduce(function(acc, el) {
            if(el.nodeType == 1) acc.push(el);
            return acc;
        }, []);

        item.children = elements.map(function(el) {
            if(el.childNodes) return self.createAST(el);
        });

        return item;
    };

    App.View = View;
})(App, document);
/**
 * Created by s.evdokimov on 15.11.2016.
 */

(function(App, document) {
    'use strict';

    function Header(option) {
        this.el = document.createElement('div');
        this.el.className = 'header';
        this.el.dataset.languageKey = 'header';
        this.container = App.serviceContainer;

        this.collection = {
            user: option.userCollection
        };

        // components
        this.search = new App.View.Header.Search({
            collection: this.collection,
            headerEl: this
        });

        this.setting = new App.View.Header.Settings({
            collection: this.collection,
            headerEl: this
        });

        this.languages = new App.View.Header.Languages({
            collection: this.collection,
            headerEl: this
        });

        // put to container
        App.serviceContainer.template.header = this;
    }

    Header.prototype.render = function() {
        this.el.appendChild(this.setting.render());
        this.el.appendChild(this.languages.render());
        this.el.appendChild(this.search.render());
        return this.el;
    };

    App.View.Header = Header;
})(App, document);
/**
 * Created by s.evdokimov on 28.11.2016.
 */

(function(App, document) {
    'use strict';

    function Languages(option) {
        this.el = document.createElement('div');
        this.el.className = 'languages-wrapper';
        this.container = App.serviceContainer;
        this.collection = option.collection;
        this.headerEl = option.headerEl;

        // listeners
        this.el.addEventListener('click', this.switch.bind(this, this));

        // put to container
        App.serviceContainer.template.laguages = this;
    }

    Languages.prototype.switch = function(self, event) {
        var el = event.target;
        if(el.tagName != 'A') return false;

        self.container.lib.dictionary.selectLang(el.dataset.language);
        self.backlight();
    };

    Languages.prototype.backlight = function() {
        var languageList = [].slice.apply(this.el.querySelectorAll('a'));
        var currentLanguage = App.currentLanguage;

        languageList.forEach(function(item) {
            item.classList.remove('active');
            if(item.dataset.language == currentLanguage) item.classList.add('active');
        });
    };

    Languages.prototype.render = function() {
        var enLink = document.createElement('a');
        enLink.textContent = 'EN';
        enLink.dataset.language = 'en';

        var ruLink = document.createElement('a');
        ruLink.textContent = 'RU';
        ruLink.dataset.language = 'ru';

        this.el.appendChild(enLink);
        this.el.appendChild(ruLink);
        this.backlight();
        return this.el;
    };

    App.View.Header.Languages = Languages;
})(App, document);
/**
 * Created by s.evdokimov on 15.11.2016.
 */

(function (App, document) {
    'use strict';

    function Search(option) {
        this.el = document.createElement('div');
        this.el.className = 'search';
        this.el.dataset.languageKey = 'search';
        this.container = App.serviceContainer;
        this.collection = option.collection;
        this.headerEl = option.headerEl;
        this.dictionary = this.container.lib.dictionary;
        this.nodes = {};

        // put to container
        App.serviceContainer.template.search = this;
    }

    Search.prototype.handlerSearch = function(self, event) {
        var searchStr = self.nodes.input.value;
        self.container.template.userTableTbody.render({type: 'search', find: searchStr});
    };

    Search.prototype.render = function() {
        this.nodes.input = document.createElement('input');
        this.nodes.input.setAttribute('name', 'search');

        this.nodes.button = document.createElement('button');
        this.nodes.button.dataset.languageKey = 'button';
        this.nodes.button.textContent = this.dictionary.t(['header', 'search', 'button']);
        this.nodes.button.addEventListener('click', this.handlerSearch.bind(this, this));

        for (var index in this.nodes) {
            this.el.appendChild(this.nodes[index]);
        }

        return this.el;
    };

    App.View.Header.Search = Search;
})(App, document);

/**
 * Created by s.evdokimov on 28.11.2016.
 */

(function(App, document) {
    'use strict';

    function Settings(option) {
        this.el = document.createElement('div');
        this.el.className = 'switch-notify';
        this.el.dataset.languageKey = 'settings';
        this.container = App.serviceContainer;
        this.collection = option.collection;
        this.headerEl = option.headerEl;
        this.dictionary = this.container.lib.dictionary;
        this.nodes = {};

        // listeners

        // put to container
        App.serviceContainer.template.switchNotify = this;
    }

    Settings.prototype.switch = function(event) {
        var isShow = (event.target.checked) ? false : true ;
        App.showNotify = isShow;
    };

    Settings.prototype.render = function() {
        this.nodes.switchEl = document.createElement('input');
        this.nodes.switchEl.setAttribute('type', 'checkbox');
        this.nodes.switchEl.setAttribute('id', 'switch');
        this.nodes.switchEl.checked = App.showNotify ? false : true;
        this.nodes.switchEl.addEventListener('change', this.switch);

        this.nodes.labelEl = document.createElement('label');
        this.nodes.labelEl.setAttribute('for', 'switch');
        this.nodes.labelEl.dataset.languageKey = 'label';
        this.nodes.labelEl.textContent = this.dictionary.t(['header', 'settings', 'label']);

        for (var index in this.nodes) {
            this.el.appendChild(this.nodes[index]);
        }

        return this.el;
    };

    App.View.Header.Settings = Settings;
})(App, document);
/**
 * Created by s.evdokimov on 09.11.2016.
 */

(function(App, document) {
    'use strict';

    function Modal(option) {
        this.el = document.createElement('div');
        this.el.className = 'modal';
        this.el.dataset.languageKey = 'modal';
        this.el.style.visibility = 'hidden';

        this.container = App.serviceContainer;
        this.collection = {
            user: option.userCollection
        };

        // components
        this.modalEdit = new App.View.Modal.EditUser({
            collection: this.collection,
            modalEl: this
        });

        this.modalCreate = new App.View.Modal.CreateUser({
            collection: this.collection,
            modalEl: this
        });

        this.modalConfirm = new App.View.Modal.Confirm();

        // listeners
        this.el.addEventListener('click', this.hideAllModal.bind(this, this));

        // put to container
        App.serviceContainer.template.modalWindow = this;
    }

    Modal.prototype.hideAllModal = function(self, event) {
        var el = event.target;

        if(el.tagName == 'DIV' && el.className == 'modal') {
            var create = this.container.template.modalCreate;
            var edit = this.container.template.modalEdit;

            if(create.isShow) create.beforeHide('cancel');
            if(edit.isShow) edit.beforeHide('cancel');
        }
    };

    Modal.prototype.render = function() {
        this.el.appendChild(this.modalCreate.render());
        this.el.appendChild(this.modalEdit.render());
        this.el.appendChild(this.modalConfirm.render());
        return this.el;
    };

    App.View.Modal = Modal;
})(App, document);
/**
 * Created by s.evdokimov on 24.11.2016.
 */

(function(App, document) {
    'use strict';

    function Confirm(option) {
        this.el = document.createElement('div');
        this.el.className = 'modal-window modal-confirm';
        this.el.dataset.languageKey = 'confirm';
        this.container = App.serviceContainer;
        this.dictionary = this.container.lib.dictionary;
        this.nodes = {};

        // components
        this.event = App.Lib.Event;

        // listeners
        this.el.addEventListener('click', this.makeChoice.bind(this, this));

        // put to container
        App.serviceContainer.template.modalConfirm = this;
    }

    Confirm.prototype.makeChoice = function(self, event) {
        var el = event.target;

        if(el.tagName != 'BUTTON') {
            return false;
        }

        var choise = null;
        switch(el.className) {
            case 'ok':
                choise = true;
                break;
            case 'cancel':
                choise = false;
                break;
        }

        self.event.dispatch('makeChoice', choise);
        self.hide();
    };

    Confirm.prototype.confirm = function() {
        this.show();
    };

    Confirm.prototype.show = function() {
        this.el.classList.toggle("show", true);
    };

    Confirm.prototype.hide = function() {
        this.el.classList.toggle("show", false);
    };

    Confirm.prototype.controlsButton = function() {
        this.nodes.wrapperButtons = document.createElement('div');
        this.nodes.wrapperButtons.className = 'control-group';

        var yesBtn = document.createElement('button');
        yesBtn.dataset.languageKey = 'save';
        yesBtn.textContent = this.dictionary.t(['modal', 'confirm', 'save']);
        yesBtn.className = 'ok';

        var noBtn = document.createElement('Button');
        noBtn.dataset.languageKey = 'cancel';
        noBtn.textContent = this.dictionary.t(['modal', 'confirm', 'cancel']);
        noBtn.className = 'cancel';

        this.nodes.wrapperButtons.appendChild(yesBtn);
        this.nodes.wrapperButtons.appendChild(noBtn);

        return this.nodes.wrapperButtons;
    };

    Confirm.prototype.render = function() {
        var controlEl = this.controlsButton();
        var titleEl = document.createElement('h3');
        titleEl.dataset.languageKey = 'message';
        titleEl.textContent = this.dictionary.t(['modal', 'confirm', 'message']);
        titleEl.className = 'caption';

        this.el.appendChild(titleEl);
        this.el.appendChild(controlEl);
        return this.el;
    };

    App.View.Modal.Confirm = Confirm;
})(App, document);
/**
 * Created by s.evdokimov on 09.11.2016.
 */

(function(App, document) {
    'use strict';

    function CreateUser(option) {
        var self = this;

        this.el = document.createElement('div');
        this.el.className = 'modal-window modal-create';
        this.el.dataset.languageKey = 'create';
        this.modalEl = option.modalEl;
        this.collection = option.collection;
        this.container = App.serviceContainer;
        this.modalType = 'create';
        this.isShow = false;
        this.dictionary = this.container.lib.dictionary;
        this.nodes = {};
        this.renderOrder = ['caption', 'avatar', 'name', 'email', 'birth', 'date', 'control'];
        this.fields = {
            caption: function(){
                self.nodes.caption = document.createElement('h3');
                self.nodes.caption.className = 'caption';
                self.nodes.caption.dataset.languageKey = 'caption';
                self.nodes.caption.textContent = self.dictionary.t(['modal', self.modalType, 'caption']);
                return self.nodes.caption;
            },
            avatar: function(){
                self.nodes.avatar = document.createElement('div');
                self.nodes.avatar.className = 'group avatar-group';

                var nameLabel = document.createElement('label');
                nameLabel.dataset.languageKey = 'avatar';
                nameLabel.textContent = self.dictionary.t(['modal', self.modalType, 'avatar']);
                nameLabel.className = 'avatar-label';

                var nameInput = document.createElement('input');
                nameInput.setAttribute('type', 'file');
                nameInput.setAttribute('name', 'avatar');
                nameInput.addEventListener('change', self.imageUpload.bind(self, self));
                nameInput.className = 'file-input';
                self.inputs.avatar = nameInput;

                self.nodes.avatar.appendChild(nameLabel);
                self.nodes.avatar.appendChild(nameInput);
                return self.nodes.avatar;
            },
            name: function(){
                self.nodes.name = document.createElement('div');
                self.nodes.name.className = 'group name-group';

                var nameLabel = document.createElement('label');
                nameLabel.dataset.languageKey = 'name';
                nameLabel.textContent = self.dictionary.t(['modal', self.modalType, 'name']);
                nameLabel.className = 'name-label';

                var nameInput = document.createElement('input');
                nameInput.setAttribute('type', 'text');
                nameInput.setAttribute('name', 'name');
                nameInput.className = 'name-input';
                self.inputs.name = nameInput;

                self.nodes.name.appendChild(nameLabel);
                self.nodes.name.appendChild(nameInput);
                return self.nodes.name;
            },
            email: function(){
                self.nodes.email = document.createElement('div');
                self.nodes.email.className = 'group email-group';

                var nameLabel = document.createElement('label');
                nameLabel.dataset.languageKey = 'email';
                nameLabel.textContent = self.dictionary.t(['modal', self.modalType, 'email']);
                nameLabel.className = 'email-label';

                var nameInput = document.createElement('input');
                nameInput.setAttribute('type', 'text');
                nameInput.setAttribute('name', 'email');
                nameInput.className = 'email-input';
                self.inputs.email = nameInput;

                self.nodes.email.appendChild(nameLabel);
                self.nodes.email.appendChild(nameInput);
                return self.nodes.email;
            },
            birth: function(){
                self.nodes.birth = document.createElement('div');
                self.nodes.birth.className = 'group date-group';

                var nameLabel = document.createElement('label');
                nameLabel.dataset.languageKey = 'birth';
                nameLabel.textContent = self.dictionary.t(['modal', self.modalType, 'birth']);
                nameLabel.className = 'date-label';

                var dateInput = document.createElement('input');
                dateInput.setAttribute('type', 'date');
                dateInput.setAttribute('name', 'birth');
                dateInput.className = 'birth-input';
                self.inputs.birth = dateInput;

                self.nodes.birth.appendChild(nameLabel);
                self.nodes.birth.appendChild(dateInput);
                return self.nodes.birth;
            },
            date: function(){
                self.nodes.time = document.createElement('div');
                self.nodes.time.className = 'group date-group';

                var nameLabel = document.createElement('label');
                nameLabel.dataset.languageKey = 'time';
                nameLabel.textContent = self.dictionary.t(['modal', self.modalType, 'time']);
                nameLabel.className = 'date-label';

                var dateInput = document.createElement('input');
                dateInput.setAttribute('type', 'date');
                dateInput.setAttribute('name', 'date');
                dateInput.className = 'date-input';
                self.inputs.date = dateInput;

                var timeInput = document.createElement('input');
                timeInput.setAttribute('type', 'time');
                timeInput.setAttribute('name', 'time');
                timeInput.className = 'time-input';
                self.inputs.time = timeInput;

                self.nodes.time.appendChild(nameLabel);
                self.nodes.time.appendChild(dateInput);
                self.nodes.time.appendChild(timeInput);
                return self.nodes.time;
            },
            control: function(){
                self.nodes.control = document.createElement('div');
                self.nodes.control.className = 'group control-group';

                var addBtn = document.createElement('button');
                addBtn.className = 'add-btn';
                addBtn.dataset.languageKey = 'save';
                addBtn.textContent = self.dictionary.t(['modal', self.modalType, 'save']);

                var cancelBtn = document.createElement('button');
                cancelBtn.className = 'cancel-btn';
                cancelBtn.dataset.languageKey = 'cancel';
                cancelBtn.textContent = self.dictionary.t(['modal', self.modalType, 'cancel']);

                self.nodes.control.appendChild(addBtn);
                self.nodes.control.appendChild(cancelBtn);
                return self.nodes.control;
            }
        };
        this.inputs = {};
        this.avatar = null;

        // components
        this.uploader = new App.Lib.ImageUploader();

        // listeners
        this.el.addEventListener('click', this.handlerControlBtn.bind(this, this));

        // put to container
        App.serviceContainer.template.modalCreate = this;
    }

    CreateUser.prototype.handlerControlBtn = function(self, event) {
        var el = event.target;

        if(el.tagName != 'BUTTON') {
            return false;
        }

        switch(el.className) {
            case 'cancel-btn':
                self.beforeHide('cancel');
                break;
            case 'add-btn':
                self.chekForm();
                break;
        }
    };

    CreateUser.prototype.imageUpload = function(self, event) {
        var el = event.target;
        el.classList.remove('error');
        el.classList.remove('success');

        this.uploader.read(el, this.onImageUploadSuccess.bind(self));
    };

    CreateUser.prototype.onImageUploadSuccess = function(file) {
        this.avatar = file;
    };

    CreateUser.prototype.chekForm = function() {
        var validator = App.Lib.Validator;
        var dateTimeFinish = {};
        var valid = true;

        for(var index in this.inputs) {
            var result;
            var node = this.inputs[index];
            var value = this.inputs[index].value;

            node.classList.remove('success');
            node.classList.remove('error');

            switch(index) {
                case 'id':
                    continue;
                case 'avatar':
                    result = validator.checkImage(node);
                break;
                case 'name':
                    result = validator.checkName(value);
                break;
                case 'email':
                    result = validator.checkEmail(value);
                break;
                case 'birth':
                    result = validator.checkStartDate({date: value});
                break;
                case 'date':
                    dateTimeFinish.date = value;
                break;
                case 'time':
                    dateTimeFinish.time = value;
                break;
                default:
                    console.warn('Unknown type of validator');
                break;
            }

            node.classList.add(result.className);
            valid = result.valid;

            if(!valid) break;
        }

        valid = (valid) ? this.chekDate(dateTimeFinish) : false;
        if(!valid) return false;

        var pick = this.pickData();
        this.send(pick);
        this.beforeHide('save');
    };

    CreateUser.prototype.chekDate = function(data) {
        var result = App.Lib.Validator.checkFinishDate(data);

        this.inputs.date.classList.add(result.className);
        this.inputs.time.classList.add(result.className);

        return result.valid;
    };

    CreateUser.prototype.pickData = function() {
        var strTime = this.inputs.date.value + ' ' + this.inputs.time.value;
        var data = {
            id: (this.inputs.id) ? this.inputs.id.value : null,
            name: this.inputs.name.value,
            email: this.inputs.email.value,
            date: new Date(strTime),
            birth: new Date(this.inputs.birth.value),
            avatar: this.avatar,
            timePassed: false
        };

        return data;
    };

    CreateUser.prototype.send = function(data) {
        var self = this;
        var user = this.container.model.user;
        user.create(data).then(function(res) {
            self.container.template.userTableTbody.createRow(res);
        });
    };

    CreateUser.prototype.beforeHide = function(status) {
        for(var index in this.inputs) {
            var input = this.inputs[index];

            input.classList.remove('error');
            input.classList.remove('success');
            input.value = '';

            if(index == 'avatar') {
                var parent = input.parentNode;
                var img = parent.querySelector('img');
                if(img) parent.removeChild(img);
            }
        }

        this.hide();
    };

    CreateUser.prototype.hide = function() {
        this.modalEl.el.style.visibility = 'hidden';
        this.el.classList.toggle("show", false);
        this.isShow = false;
    };

    CreateUser.prototype.show = function(id) {
        if(id) this.loadData(id);

        this.el.classList.toggle("show", true);
        this.modalEl.el.style.visibility = 'visible';
        this.isShow = true;
    };

    CreateUser.prototype.render = function() {
        var arr = this.renderOrder;
        var fragment = document.createDocumentFragment();

        for(var i = 0; i < arr.length; i++) {
            var field = arr[i];
            fragment.appendChild(this.fields[field]());
        }

        this.el.appendChild(fragment);
        return this.el;
    };

    App.View.Modal.CreateUser = CreateUser;
})(App, document);
/**
 * Created by s.evdokimov on 09.11.2016.
 */

(function(App, document) {
    'use strict';

    function EditUser(option) {
        var self = this;
        App.View.Modal.CreateUser.call(this, option);

        this.el.className = 'modal-window modal-edit';
        this.el.dataset.languageKey = 'edit';
        this.findItem = [];
        this.modalType = 'edit';
        this.renderOrder.push('id');
        this.fields.id = function() {
            var nameInput = document.createElement('input');
            nameInput.setAttribute('type', 'hidden');
            nameInput.setAttribute('name', 'id');
            nameInput.className = 'id-input';
            self.inputs.id = nameInput;

            return nameInput;
        };

        // components
        this.event = App.Lib.Event;

        // listeners
        this.event.addListener('makeChoice', this.makeChoice.bind(this));

        // put to container
        App.serviceContainer.template.modalEdit = this;
    }

    EditUser.prototype = Object.create(App.View.Modal.CreateUser.prototype);

    EditUser.prototype.loadData = function(id) {
        var find = this.collection.user.filter(function(item) {
            return item.id == id;
        });

        this.findItem = find[0];

        var avatarContainer = this.inputs.avatar.parentNode;
        var images = avatarContainer.querySelector('img');

        var avatar = document.createElement('img');
        avatar.setAttribute('src', this.findItem.avatar);

        images ? images.replaceWith(avatar) : avatarContainer.insertBefore(avatar, this.inputs.avatar);

        this.avatar = this.findItem.avatar;
        this.inputs.avatar.dataset.img = this.findItem.avatar;
        this.inputs.id.value = this.findItem.id;
        this.inputs.name.value = this.findItem.name;
        this.inputs.email.value = this.findItem.email;
        this.inputs.birth.valueAsNumber = new Date(this.findItem.birth).getTime();
        this.inputs.date.valueAsNumber = new Date(this.findItem.date).getTime();
        this.inputs.time.valueAsNumber = new Date(this.findItem.date).getTime() + 10800000; // + 3 hours
    };

    EditUser.prototype.compareData = function(data) {
        var toUpdate = false;

        for(var index in data) {
            var newItem = data[index];
            var oldItem = this.findItem[index];

            if(newItem != oldItem) {
                toUpdate = true;
                break;
            }
        }

        return toUpdate;
    };

    EditUser.prototype.beforeHide = function(status) {
        if(status == 'cancel') {
            var data = this.pickData();
            var toUpdate = this.compareData(data);

            if(toUpdate) {
                this.el.classList.add("disable");
                this.container.template.modalConfirm.confirm();
            } else {
                this.hide();
            }
        } else {
            this.hide();
        }
    };

    EditUser.prototype.makeChoice = function(status) {
        this.el.classList.remove("disable");
        if(status) {
            var data = this.pickData();
            this.send(data);
        }

        this.hide();
    };

    EditUser.prototype.send = function(data) {
        var status = this.compareData(data);
        if(!status) return false;

        var self = this;
        var user = this.container.model.user;
        user.update(data).then(function(res) {
            self.container.template.userTableTbody.updateRow(res);
        });
    };

    App.View.Modal.EditUser = EditUser;
})(App, document);
/**
 * Created by s.evdokimov on 25.11.2016.
 */


(function(App, document) {
    'use strict';

    function Notify(option) {
        this.el = document.createElement('div');
        this.el.className = 'notify-wrapper';

        this.items = [];
        this.container = App.serviceContainer;
        this.rootView = option.rootView;
        this.collection = {
            user: option.userCollection
        };

        // components

        // listeners
        this.el.addEventListener('click', this.hideNotify.bind(this, this));
        this.el.addEventListener('transitionend', this.notifyAnimate.bind(this, this));

        // put to container
        App.serviceContainer.template.notify = this;
    }

    Notify.prototype.create = function(params, key) {
        if(!App.showNotify) return false;

        var notify = new App.View.Notify.Item({
            notifyEl: this,
            params: params,
            key: key
        });

        this.items.push(notify);
        this.el.appendChild(notify.show());
    };

    Notify.prototype.hideNotify = function(self, event) {
        var el = event.target;

        if(el.className != 'notify') return false;

        var find = self.items.filter(function(item) {
            return item.id == el.dataset.notifyId;
        });

        find[0].hide();
    };

    Notify.prototype.notifyAnimate = function(self, event) {
        var timestamp = Date.now();
        self.items = self.items.reduce(function(acc, item) {
            item.id < timestamp ? item.remove() : acc.push(item);
            return acc;
        }, []);
    };

    Notify.prototype.render = function() {
        return this.el;
    };

    App.View.Notify = Notify;
})(App, document);
/**
 * Created by s.evdokimov on 25.11.2016.
 */

(function(App, document) {
    'use strict';

    function Item(option) {
        this.el = document.createElement('div');
        this.container = App.serviceContainer;
        this.dictionary = this.container.lib.dictionary;
        this.notifyEl = option.notifyEl;
        this.params = option.params;
        this.keys = ['notify'];
        this.id = Date.now() + 15000;
        this.timeoutId = null;

        this.keys.push(option.key);
        this.create();
    }

    Item.prototype.create = function() {
        this.render();
    };

    Item.prototype.remove = function() {
        this.notifyEl.el.removeChild(this.el);
    };

    Item.prototype.show = function() {
        var self = this;
        this.el.style.opacity = 1;
        this.timeoutId = setTimeout(function() {
            self.hide();
        }, 15000);

        return this.el;
    };

    Item.prototype.hide = function() {
        clearTimeout(this.timeoutId);
        this.el.style.opacity = 0;
    };

    Item.prototype.render = function() {
        this.el.className = 'notify';
        this.el.dataset.notifyId = this.id;

        var str = this.dictionary.getMessage(this.params, this.keys);
        this.el.textContent = str;

        return this.el;
    };

    App.View.Notify.Item = Item;
})(App, document);
/**
 * Created by s.evdokimov on 10.11.2016.
 */

(function(App, document) {
    'use strict';

    function Option(option) {
        this.el = document.createElement('div');
        this.el.className = 'option';
        this.el.dataset.languageKey = 'option';

        this.container = App.serviceContainer;
        this.rootView = option.rootView;
        this.pagination = App.pagination;
        this.collection = {
            user: option.userCollection
        };

        // components
        this.addUser = new App.View.Option.AddUser({
            collection: this.collection,
            blockEl: this
        });


        this.pagination = new App.View.Option.Pagination({
            collection: this.collection,
            blockEl: this
        });

        // listeners

        // put to container
        App.serviceContainer.template.optionBlock = this;
    }

    Option.prototype.render = function() {
        this.el.appendChild(this.addUser.render());
        this.el.appendChild(this.pagination.render());
        return this.el;
    };

    App.View.Option = Option;
})(App, document);
/**
 * Created by s.evdokimov on 10.11.2016.
 */

(function() {
    'use strict';

    function AddUser(option) {
        this.el = document.createElement('button');
        this.el.className = 'add-user';
        this.el.dataset.languageKey = 'adduser';

        this.container = App.serviceContainer;
        this.dictionary = this.container.lib.dictionary;
        this.blockEl = option.blockEl;
        this.collection = option.userCollection;
        this.el.textContent = this.dictionary.t(['option', 'adduser']);
        // components

        // listeners
        this.el.addEventListener('click', this.showModal.bind(this, this));

        // put to container
        App.serviceContainer.template.addUser = this;
    }

    AddUser.prototype.showModal = function(self, event) {
        self.container.template.modalCreate.show();
    };

    AddUser.prototype.render = function() {
        return this.el;
    };

    App.View.Option.AddUser = AddUser;
})();
/**
 * Created by s.evdokimov on 10.11.2016.
 */

(function(App, document) {
    'use strict';

    function Pagination(option) {
        this.el = document.createElement('div');
        this.el.className = 'pagination';

        this.blockEl = option.blockEl;
        this.collection = option.collection;

        this.container = App.serviceContainer;
        this.pagination = App.pagination;
        this.behaviourPagination = this.pagination.type;

        // components
        this.event = App.Lib.Event;

        // lazyload
        this.count = 0;

        // pagination
        this.pages = [];

        this.behaviourPagination == 'lazyLoad' ? this.lazyInit() : this.paginationInit();

        // put to container
        App.serviceContainer.template.pagination = this;
    }

    Pagination.prototype.lazyInit = function() {
        var self = this;
        var table = this.container.template.userTable;
        var tbody = this.container.template.userTableTbody;


        this.container.model.user.load({count: true}).then(function(res) {
            self.count = res.count;

            table.el.classList.add('lazyLoad');
            tbody.el.addEventListener('scroll', self.lazyHandlerScroll.bind(self, tbody, self.count, self.loadData.bind(self)));
        });
    };

    Pagination.prototype.lazyHandlerScroll = function(self, count, callback, event) {
        var el = event.target;
        var currentScroll = self.el.scrollTop + self.el.clientHeight;
        var maxScroll = self.el.scrollHeight;

        if(currentScroll == maxScroll) {
            var start = el.childNodes.length;
            var limit = start + App.pagination.perPage;

            if(start < count) this.container.model.user.load({start: start, limit: limit}).then(callback);
        }
    };

    Pagination.prototype.paginationInit = function() {
        var self = this;
        this.currentPage = this.pagination.currentPage;

        this.calculateQuantityPages().then(function(res) {
            self.drawPages(res.quantity);
            self.backlightPage();

            self.el.addEventListener('click', self.changePage.bind(self, self, self.loadData.bind(self)));
        });

        this.event.addListener('deleteRow', this.deleteRow.bind(this));
        this.event.addListener('addRow', this.addRow.bind(this));
    };

    Pagination.prototype.deleteRow = function() {
        var self = this;
        this.calculateQuantityPages().then(function(res) {

            if(res.mod === false) {
                self.currentPage = self.currentPage == 1 ? 1
                    : (self.currentPage == (res.quantity + 1)) ? res.quantity
                    :  self.currentPage;

                self.drawPages(res.quantity);
                self.backlightPage();

                var result = self.getStartAndLimitRecords();
                self.getData(result.start, result.limit, self.loadData.bind(self));
            }
        });
    };

    Pagination.prototype.addRow = function() {
        var self = this;
        this.calculateQuantityPages().then(function(res) {

            self.currentPage = res.quantity;
            self.drawPages(res.quantity);
            self.backlightPage();

            var result = self.getStartAndLimitRecords();
            self.getData(result.start, result.limit, self.loadData.bind(self));
        });
    };

    Pagination.prototype.calculateQuantityPages = function() {
        var self = this;
        return this.container.model.user.load({count: true}).then(function(res){

            var out = {};
            if(res.count % self.pagination.perPage === 0) {
                out.quantity = res.count / self.pagination.perPage;
                out.mod = false;
            } else {
                out.quantity =  Math.ceil(res.count / self.pagination.perPage);
                out.mod = true;
            }

            return out;
        });
    };

    Pagination.prototype.drawPages = function(quantity) {
        var fragment = document.createDocumentFragment();

        if(this.pages.length != quantity) {
            this.pages = [];
            this.el.innerHTML = '';

            for(var i = 1; i <= quantity; i++) {
                var el = document.createElement('div');
                el.textContent = i;
                el.dataset.page = i;
                el.className = 'page';

                this.pages.push(el);
                fragment.appendChild(el);
            }
            this.el.appendChild(fragment);
        }
    };

    Pagination.prototype.backlightPage = function() {
        var self = this;
        this.pages.forEach(function(page) {
            var pageNum = page.dataset.page;
            page.classList.remove('active');
            if(pageNum == self.currentPage) page.classList.add('active');
        });
    };

    Pagination.prototype.changePage = function(self, callback, event) {
        var el = event.target;

        if(!el.classList.contains('page')) return false;

        var currentPage = el.dataset.page;
        if(currentPage == this.currentPage) return false;

        this.currentPage = currentPage;
        self.backlightPage();

        var result = self.getStartAndLimitRecords();
        self.getData(result.start, result.limit, callback);
    };

    Pagination.prototype.getStartAndLimitRecords = function() {
        var start = (this.currentPage == 1) ? 0
            : (this.currentPage * this.pagination.perPage) - this.pagination.perPage;

        var limit = start + this.pagination.perPage;
        return {start: start, limit: limit};
    };

    Pagination.prototype.getData = function(start, limit, callback) {
        var self = this;
        this.container.model.user.load({start: start, limit: limit}).then(function(res) {
            callback(res);
            self.container.template.userTableTbody.clearRows(res);
        });
    };

    Pagination.prototype.loadData = function(res) {
        var tbody = this.container.template.userTableTbody;
        if(res.length) tbody.newRows(res);
    };


    Pagination.prototype.render = function() {
        return this.el;
    };

    App.View.Option.Pagination = Pagination;
})(App, document);
/**
 * Created by s.evdokimov on 08.11.2016.
 */

(function(App) {
    'use strict';

    function Table(options) {
        this.el = document.createElement('table');
        this.el.className = 'table';
        this.el.dataset.languageKey = 'userTable';
        this.rootView = options.rootView;
        this.container = App.serviceContainer;
        this.tooltip = null;
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
/**
 * Created by s.evdokimov on 08.11.2016.
 */

(function(App, document) {
    'use strict';

    function Body(options) {
        var self = this;

        this.el = document.createElement('tbody');
        this.el.className = 'tBody';
        this.el.dataset.languageKey = 'tBody';
        this.container = App.serviceContainer;
        this.dictionary = this.container.lib.dictionary;
        this.collection = options.collection;
        this.tableEl = options.tableEl;
        this.tRows = [];
        this.sortConfig = {
            param: 'id',
            direction: 'asc'
        };

        // components
        this.event = App.Lib.Event;
        this.collection.user.forEach(function(item) {
            var row = new App.View.UserTable.Body.Row({
                collection: item,
                tbodyEl: self
            });

            self.tRows.push(row);
        });

        // listeners
        this.el.addEventListener('click', this.handlerCotrolsBtn.bind(this, this));
        this.el.addEventListener('transitionend', this.transitionend.bind(this, this));

        // put to container
        App.serviceContainer.template.userTableTbody = this;
    }

    Body.prototype.handlerCotrolsBtn = function(self, event) {
        var el = event.target;

        if(el.tagName != 'A') return false;

        var id = el.parentNode.parentNode.querySelector('.id').textContent;
        switch (el.className) {
            case 'edit-btn':
                self.container.template.modalEdit.show(id);
                break;
            case 'delete-btn':
                self.tRows.forEach(function(row) {
                    if(row.id == id) row.el.classList.add('deleting');
                });
                break;
        }
    };

    Body.prototype.transitionend = function (self, event) {
        var el = event.target;
        var className = el.className;

        switch (className) {
            case 'deleting':
                self.removeRow(el);
                break;
        }
    };

    Body.prototype.sort = function(result) {
        var config = this.sortConfig;
        var sorted = result.sort(function(a, b) {
            var item1 = (config.param == 'date' || config.param == 'birth') ? new Date(a[config.param]).getTime() : a[config.param];
            var item2 = (config.param == 'date' || config.param == 'birth') ? new Date(b[config.param]).getTime() : b[config.param];
            var res = 0;

            if (config.direction == 'asc') {
                res = (item1 > item2) ? 1 : -1;
            } else {
                res = (item1 > item2) ? -1 : 1;
            }

            return res;
        });

        return sorted;
    };

    Body.prototype.search = function(config) {
        var find = this.tRows.filter(function(item) {
            var name = item.collection.name;
            return name.indexOf(config.find) != -1;
        });

        return find;
    };

    Body.prototype.removeRow = function(row) {
        var self = this;
        var user = this.container.model.user;
        var id = row.querySelector('.id').textContent;

        self.tRows = self.tRows.reduce(function(acc, item) {
            item.el.className != 'deleting' ? acc.push(item) :  item.destroy();
            return acc;
        }, []);

        user.delete(id).then(function(res) {
            self.event.dispatch('deleteRow');
            self.container.template.notify.create(res, 'deleteUser');
        });
    };

    Body.prototype.updateRow = function(res) {
        this.tRows.forEach(function(item) {
            if(item.id == res.id) item.update(res);
        });
    };

    Body.prototype.createRow = function(res) {
        this.collection.user.push(res);
        var row = new App.View.UserTable.Body.Row({
            collection: res,
            tbodyEl: this
        });

        row.el.classList.add('addition');
        this.tRows.push(row);
        this.el.insertBefore(row.init(), this.el.firstChild);

        setTimeout(function() {
            row.el.classList.remove('addition');
        }, 100);

        this.event.dispatch('addRow');
    };

    Body.prototype.newRows = function(rows) {
        var self = this;
        var mapperExistingRows = {};

        this.tRows.forEach(function(item) {
            mapperExistingRows[item.id] = true;
        });

        rows.forEach(function(item) {
            if(!mapperExistingRows.hasOwnProperty(item.id)) {
                var row = new App.View.UserTable.Body.Row({
                    collection: item,
                    tbodyEl: self
                });
                self.tRows.push(row);
            }
        });

        this.render();
    };

    Body.prototype.clearRows = function(newRows) {
        this.tRows = this.tRows.reduce(function(acc, oldItem) {
            var filtered = newRows.filter(function(newItem) {
                return newItem.id == oldItem.id;
            });

            filtered.length ? acc.push(oldItem) : oldItem.destroy();

            return acc;
        }, []);
    };

    Body.prototype.render = function(config) {
        if(config && config.type == 'sort') this.sortConfig = config;

        this.el.innerHTML = '';
        var fragment = document.createDocumentFragment();

        var result = this.sort(this.tRows);
        if(config && config.type == 'search') {
            result = this.search(config);
        }

        result.forEach(function(row) {
            fragment.appendChild(row.init());
        });

        this.el.appendChild(fragment);
        return this.el;
    };

    App.View.UserTable.Body = Body;
})(App, document);
/**
 * Created by s.evdokimov on 09.11.2016.
 */


(function(App, document) {
    'use strict';

    function Row(options) {
        var self = this;

        this.el = document.createElement('tr');
        this.id = options.collection.id;
        this.container = App.serviceContainer;
        this.collection = options.collection;
        this.tbodyEl = options.tbodyEl;
        this.dictionary = this.container.lib.dictionary;
        this.nodes = {};
        this.renderOrder = ['id', 'name' , 'email' , 'birth', 'date', 'del', 'edit'];
        this.fields = {
            id: function(user) {
                self.nodes.id = document.createElement('td');
                self.nodes.id.className = 'id';
                self.nodes.id.textContent = user.id;
                return self.nodes.id;
            },
            name: function(user) {
                self.nodes.name = document.createElement('td');
                self.nodes.name.className = 'name';
                self.nodes.name.textContent = user.name;
                self.nodes.name.dataset.tooltip = 'name';
                return self.nodes.name;
            },
            email: function(user) {
                self.nodes.email = document.createElement('td');
                self.nodes.email.className = 'email';
                self.nodes.email.textContent = user.email;
                self.nodes.email.dataset.tooltip = 'email';
                return self.nodes.email;
            },
            birth: function(user) {
                var date = new Date(user.birth);
                self.nodes.birt = document.createElement('td');
                self.nodes.birt.className = 'birth';
                self.nodes.birt.textContent = date.getDate() + '. ' + (date.getMonth() + 1) + '. ' + date.getFullYear();
                return self.nodes.birt;
            },
            date: function(user){
                self.nodes.date = document.createElement('td');
                self.nodes.date.className = 'date';

                var leftTimeElement = document.createElement('div');
                leftTimeElement.className = 'left-time';
                leftTimeElement.textContent = self.calculateTime(user.date);

                var overlayElement = document.createElement('div');
                overlayElement.className = 'overlay';
                self.progress = new App.Lib.ProgressBarTimer({start: user.birth, end: user.date}, overlayElement);

                self.nodes.date.appendChild(leftTimeElement);
                self.nodes.date.appendChild(overlayElement);
                return self.nodes.date;
            },
            del: function() {
                self.nodes.del = document.createElement('td');
                self.nodes.del.className = 'del';

                var delButton = document.createElement('a');
                delButton.dataset.languageKey = 'delete';
                delButton.textContent = self.dictionary.t(['userTable', 'tBody', 'delete']);
                delButton.className = 'delete-btn';

                self.nodes.del.appendChild(delButton);
                return self.nodes.del;
            },
            edit: function() {
                self.nodes.edit = document.createElement('td');
                self.nodes.edit.className = 'edit';

                var editButton = document.createElement('a');
                editButton.dataset.languageKey = 'edit';
                editButton.textContent = self.dictionary.t(['userTable', 'tBody', 'edit']);
                editButton.className = 'edit-btn';

                self.nodes.edit.appendChild(editButton);
                return self.nodes.edit;
            }
        };

        // components
        this.timer = new App.Lib.Timer({start: self.collection.birth, end: self.collection.date}, this.timerCb.bind(this));
        this.render();
    }

    Row.prototype.update = function(data) {
        var timerData = {};
        var avatar = {};

        for(var index in data) {
            if(index == 'timePassed') continue;

            var val = data[index];
            if(index == 'birth' || index == 'date') {
                timerData[index] = val;
            } else if(index == 'avatar') {
                avatar.img = val;
                avatar.name = data.name;
            } else {
                this.nodes[index].textContent = val;
            }
        }

        this.progress.update({start: timerData.birth, end: timerData.date});
        this.timer.update({start: timerData.birth, end: timerData.date});
    };

    Row.prototype.timerCb = function() {
        var leftTime = this.nodes.date.querySelector('.left-time');
        leftTime.textContent = this.calculateTime(this.timer.finishTime);
    };

    Row.prototype.init = function() {
        this.timer.start();
        this.progress.start();
        return this.el;
    };

    Row.prototype.destroy = function() {
        this.stop();
        this.tbodyEl.el.removeChild(this.el);
    };

    Row.prototype.stop = function() {
        this.timer.stop();
        this.progress.stop();
    };

    Row.prototype.render = function() {
        var arr = this.renderOrder;
        var fragment = document.createDocumentFragment();

        for(var i = 0; i < arr.length; i++){
            var field = arr[i];
            var el = this.fields[field](this.collection);
            fragment.appendChild(el);
        }

        this.el.appendChild(fragment);
        return this.el;
    };

    Row.prototype.calculateTime = function(endTime) {
        var currentDate = new Date().getTime();
        endTime = new Date(endTime).getTime();

        var difference = endTime - currentDate;
        var time =  difference / 1000; // to second

        var seconds = Math.floor(time % 60);
        time = time / 60;

        var minutes = Math.floor(time % 60);
        time = time / 60;

        var hours = Math.floor(time % 24);
        time = time / 24;

        var days = Math.floor(time % 30);
        time = time / 30;

        var month = Math.floor(time % 12);
        var years = Math.floor(time / 12);

        var timeLeft = {
            years: years,
            months: month,
            days: days,
            hours: hours,
            minutes: minutes,
            seconds: seconds
        };

        var dateString = '';
        for (var key in timeLeft) {
            dateString += key + ': ' + timeLeft[key] + ', ';
        }

        return dateString;
    };

    App.View.UserTable.Body.Row = Row;
})(App, document);
/**
 * Created by s.evdokimov on 08.11.2016.
 */

(function(App, document) {
    'use strict';

    function Head(options) {
        var self = this;

        this.el = document.createElement('thead');
        this.el.className = 'tHead';
        this.el.dataset.languageKey = 'tHead';
        this.container = App.serviceContainer;
        this.collection = options.collection;
        this.tableEl = options.tableEl;
        this.dictionary = this.container.lib.dictionary;
        this.nodes = {};
        this.renderOrder = ['id', 'name', 'email', 'birth', 'date', 'del', 'edit'];
        this.fields = {
            id: function() {
                self.nodes.id = document.createElement('th');
                self.nodes.id.className = 'id';
                self.nodes.id.dataset.sortBy = 'id';
                self.nodes.id.dataset.orderBy = 'asc';
                self.nodes.id.dataset.languageKey = 'id';
                self.nodes.id.textContent = self.dictionary.t(['userTable', 'tHead', 'id']);
                return self.nodes.id;
            },
            name: function() {
                self.nodes.name = document.createElement('th');
                self.nodes.name.className = 'name';
                self.nodes.name.dataset.sortBy = 'name';
                self.nodes.name.dataset.orderBy = 'asc';
                self.nodes.name.dataset.languageKey = 'name';
                self.nodes.name.textContent = self.dictionary.t(['userTable', 'tHead', 'name']);
                return self.nodes.name;
            },
            email: function() {
                self.nodes.email = document.createElement('th');
                self.nodes.email.className = 'email';
                self.nodes.email.dataset.sortBy = 'email';
                self.nodes.email.dataset.orderBy = 'asc';
                self.nodes.email.dataset.languageKey = 'email';
                self.nodes.email.textContent = self.dictionary.t(['userTable', 'tHead', 'email']);
                return self.nodes.email;
            },
            birth: function() {
                self.nodes.birth = document.createElement('th');
                self.nodes.birth.className = 'birth';
                self.nodes.birth.dataset.sortBy = 'birth';
                self.nodes.birth.dataset.orderBy = 'asc';
                self.nodes.birth.dataset.languageKey = 'birth';
                self.nodes.birth.textContent = self.dictionary.t(['userTable', 'tHead', 'birth']);
                return self.nodes.birth;
            },
            date: function() {
                self.nodes.time = document.createElement('th');
                self.nodes.time.className = 'date';
                self.nodes.time.dataset.sortBy = 'date';
                self.nodes.time.dataset.orderBy = 'asc';
                self.nodes.time.dataset.languageKey = 'time';
                self.nodes.time.textContent = self.dictionary.t(['userTable', 'tHead', 'time']);
                return self.nodes.time;
            },
            del: function(){
                self.nodes.delete = document.createElement('th');
                self.nodes.delete.className = 'delete';
                self.nodes.delete.dataset.languageKey = 'delete';
                self.nodes.delete.textContent = self.dictionary.t(['userTable', 'tHead', 'delete']);
                return self.nodes.delete;
            },
            edit: function() {
                self.nodes.edit = document.createElement('th');
                self.nodes.edit.className = 'edit';
                self.nodes.edit.dataset.languageKey = 'edit';
                self.nodes.edit.textContent = self.dictionary.t(['userTable', 'tHead', 'edit']);
                return self.nodes.edit;
            }
        };

        // listeners
        this.el.addEventListener('click', this.handlerSort.bind(this, this));

        // put to container
        App.serviceContainer.template.userTableThead = this;
    }

    Head.prototype.handlerSort = function(self, event) {
        var el = event.target;

        if(el.className === 'delete' || el.className === 'edit') {
            return false;
        }

        var direction = el.dataset.orderBy;
        var param = el.dataset.sortBy;

        self.tdEl.forEach(function(item) {
            var sort = item.dataset.sortBy;

            item.classList.remove('active');
            if(sort === param) {
                item.classList.add('active');

                if(item.dataset.orderBy == 'asc') {
                    item.classList.remove('asc');
                    item.classList.add('desc');
                    item.dataset.orderBy = 'desc';
                } else {
                    item.classList.remove('desc');
                    item.classList.add('asc');
                    item.dataset.orderBy = 'asc';
                }
            }
        });

        self.sortCollection(direction, param);
    };

    Head.prototype.sortCollection = function(direction, param) {
        var tBody = this.container.template.userTableTbody;
        tBody.render({type: 'sort', direction: direction, param: param});
    };

    Head.prototype.render = function() {
        this.tdEl = [];
        var row = document.createElement('tr');
        var fragment = document.createDocumentFragment();
        var arr = this.renderOrder;

        for(var i = 0; i < arr.length; i++) {
            var field = arr[i];
            var el = this.fields[field]();
            this.tdEl.push(el);
            fragment.appendChild(el);
        }

        row.appendChild(fragment);
        this.el.appendChild(row);

        return this.el;
    };

    App.View.UserTable.Head = Head;
})(App, document);
/**
 * Created by s.evdokimov on 08.11.2016.
 */

(function(App, document) {
    'use strict';

    function initApp() {
        var user = new App.Model.User();
        var pagination = {
            start: App.pagination.currentPage,
            limit: App.pagination.perPage
        };

        user.load(pagination).then(function() {
            var view = new App.View({users: user.records});
            view.render();
        });
    }

    document.addEventListener('DOMContentLoaded', function() {
        App.container = document.getElementById('app');
        initApp();
    });
})(App, document);