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

        images
            ? images.replaceWith(img)
            : parent.insertBefore(img, this.element);

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