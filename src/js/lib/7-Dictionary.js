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
        event: App.Lib.Event, // TODO translate Error
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