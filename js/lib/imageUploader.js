/**
 * Created by s.evdokimov on 17.11.2016.
 */

(function(App, document) {

    function ImageUploader() {
        this.fileReader = new FileReader();
        this.callback = null;
        this.element = null;
        this.currentImg = null;
    }

    ImageUploader.prototype.read = function(node, callback) {
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
        var parent = this.element.parentNode;

        var newImg = document.createElement('img');
        newImg.setAttribute('src', file);

       this.currentImg
           ? parent.replaceChild(newImg, this.currentImg)
           : parent.insertBefore(newImg, this.element);

        this.currentImg = newImg;
        this.callback(file);
    };

    App.Lib.ImageUploader = ImageUploader;
})(App, document);