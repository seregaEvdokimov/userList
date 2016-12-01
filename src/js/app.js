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