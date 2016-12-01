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