/**
 * Created by s.evdokimov on 08.11.2016.
 */

(function (w) {

    w.App = {
        container: null,
        Model: {},
        Lib: {},
        View: {},
        serviceContainer: {},
        pagination: {
            type: 'lazyLoad', //pagination
            currentPage: 1,
            perPage: 6
        }
    };

})(window);