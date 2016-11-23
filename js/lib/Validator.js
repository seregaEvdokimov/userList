/**
 * Created by s.evdokimov on 17.11.2016.
 */

(function(App) {

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
            return this.pattern.image.test(type)
                ? {valid: true, className: 'success'}
                : {valid: false, className: 'error'};
        },
        checkName: function(str) {
            return this.pattern.name.test(str)
                ? {valid: true, className: 'success'}
                : {valid: false, className: 'error'};
        },
        checkEmail: function(str) {
            return this.pattern.email.test(str)
                ? {valid: true, className: 'success'}
                : {valid: false, className: 'error'};
        },
        checkStartDate: function(data) {
            var date = data.date || '';
            var time = data.time || '';
            var strTime = date + ' ' + time;

            var startDate = new Date(strTime).getTime();
            var currentDate = new Date().getTime();

            return startDate < currentDate
                ? {valid: true, className: 'success'}
                : {valid: false, className: 'error'};
        },
        checkFinishDate: function(data) {
            var date = data.date || '';
            var time = data.time || '';
            var strTime = date + ' ' + time;

            var finishDate = new Date(strTime).getTime();
            var currentDate = new Date().getTime();

            return finishDate > currentDate
                ? {valid: true, className: 'success'}
                : {valid: false, className: 'error'};
        }
    };

    App.serviceContainer.lib.validator = Validator;
    App.Lib.Validator = Validator;
})(App);