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