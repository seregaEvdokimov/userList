!function(t,e){"use strict";function i(i){var a=this;t.View.Modal.CreateUser.call(this,i),this.el.className="modal-window modal-edit",this.el.dataset.languageKey="edit",this.findItem=[],this.modalType="edit",this.renderOrder.push("id"),this.fields.id=function(){var t=e.createElement("input");return t.setAttribute("type","hidden"),t.setAttribute("name","id"),t.className="id-input",a.inputs.id=t,t},this.event=t.Lib.Event,this.event.addListener("makeChoice",this.makeChoice.bind(this)),t.serviceContainer.template.modalEdit=this}i.prototype=Object.create(t.View.Modal.CreateUser.prototype),i.prototype.loadData=function(t){var i=this.collection.user.filter(function(e){return e.id==t});this.findItem=i[0];var a=this.inputs.avatar.parentNode,s=a.querySelector("img"),n=e.createElement("img");n.setAttribute("src",this.findItem.avatar),s?s.replaceWith(n):a.insertBefore(n,this.inputs.avatar),this.avatar=this.findItem.avatar,this.inputs.avatar.dataset.img=this.findItem.avatar,this.inputs.id.value=this.findItem.id,this.inputs.name.value=this.findItem.name,this.inputs.email.value=this.findItem.email,this.inputs.birth.valueAsNumber=new Date(this.findItem.birth).getTime(),this.inputs.date.valueAsNumber=new Date(this.findItem.date).getTime(),this.inputs.time.valueAsNumber=new Date(this.findItem.date).getTime()+108e5},i.prototype.compareData=function(t){var e=!1;for(var i in t){var a=t[i],s=this.findItem[i];if(a!=s){e=!0;break}}return e},i.prototype.beforeHide=function(t){if("cancel"==t){var e=this.pickData(),i=this.compareData(e);i?(this.el.classList.add("disable"),this.container.template.modalConfirm.confirm()):this.hide()}else this.hide()},i.prototype.makeChoice=function(t){if(this.el.classList.remove("disable"),t){var e=this.pickData();this.send(e)}this.hide()},i.prototype.send=function(t){var e=this.compareData(t);if(!e)return!1;var i=this,a=this.container.model.user;a.update(t).then(function(t){i.container.template.userTableTbody.updateRow(t)})},t.View.Modal.EditUser=i}(App,document);