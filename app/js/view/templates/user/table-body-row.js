!function(e,t){"use strict";function n(n){var i=this;this.el=t.createElement("tr"),this.id=n.collection.id,this.container=e.serviceContainer,this.collection=n.collection,this.tbodyEl=n.tbodyEl,this.dictionary=this.container.lib.dictionary,this.nodes={},this.renderOrder=["id","name","email","birth","date","del","edit"],this.fields={id:function(e){return i.nodes.id=t.createElement("td"),i.nodes.id.className="id",i.nodes.id.textContent=e.id,i.nodes.id},name:function(e){return i.nodes.name=t.createElement("td"),i.nodes.name.className="name",i.nodes.name.textContent=e.name,i.nodes.name.dataset.tooltip="name",i.nodes.name},email:function(e){return i.nodes.email=t.createElement("td"),i.nodes.email.className="email",i.nodes.email.textContent=e.email,i.nodes.email.dataset.tooltip="email",i.nodes.email},birth:function(e){var n=new Date(e.birth);return i.nodes.birt=t.createElement("td"),i.nodes.birt.className="birth",i.nodes.birt.textContent=n.getDate()+". "+(n.getMonth()+1)+". "+n.getFullYear(),i.nodes.birt},date:function(n){i.nodes.date=t.createElement("td"),i.nodes.date.className="date";var a=t.createElement("div");a.className="left-time",a.textContent=i.calculateTime(n.date);var r=t.createElement("div");return r.className="overlay",i.progress=new e.Lib.ProgressBarTimer({start:n.birth,end:n.date},r),i.nodes.date.appendChild(a),i.nodes.date.appendChild(r),i.nodes.date},del:function(){i.nodes.del=t.createElement("td"),i.nodes.del.className="del";var e=t.createElement("a");return e.dataset.languageKey="delete",e.textContent=i.dictionary.t(["userTable","tBody","delete"]),e.className="delete-btn",i.nodes.del.appendChild(e),i.nodes.del},edit:function(){i.nodes.edit=t.createElement("td"),i.nodes.edit.className="edit";var e=t.createElement("a");return e.dataset.languageKey="edit",e.textContent=i.dictionary.t(["userTable","tBody","edit"]),e.className="edit-btn",i.nodes.edit.appendChild(e),i.nodes.edit}},this.timer=new e.Lib.Timer({start:i.collection.birth,end:i.collection.date},this.timerCb.bind(this)),this.render()}n.prototype.update=function(e){var t={},n={};for(var i in e)if("timePassed"!=i){var a=e[i];"birth"==i||"date"==i?t[i]=a:"avatar"==i?(n.img=a,n.name=e.name):this.nodes[i].textContent=a}this.progress.update({start:t.birth,end:t.date}),this.timer.update({start:t.birth,end:t.date})},n.prototype.timerCb=function(){var e=this.nodes.date.querySelector(".left-time");e.textContent=this.calculateTime(this.timer.finishTime)},n.prototype.init=function(){return this.timer.start(),this.progress.start(),this.el},n.prototype.destroy=function(){this.stop(),this.tbodyEl.el.removeChild(this.el)},n.prototype.stop=function(){this.timer.stop(),this.progress.stop()},n.prototype.render=function(){for(var e=this.renderOrder,n=t.createDocumentFragment(),i=0;i<e.length;i++){var a=e[i],r=this.fields[a](this.collection);n.appendChild(r)}return this.el.appendChild(n),this.el},n.prototype.calculateTime=function(e){var t=(new Date).getTime();e=new Date(e).getTime();var n=e-t,i=n/1e3,a=Math.floor(i%60);i/=60;var r=Math.floor(i%60);i/=60;var o=Math.floor(i%24);i/=24;var d=Math.floor(i%30);i/=30;var s=Math.floor(i%12),l=Math.floor(i/12),c={years:l,months:s,days:d,hours:o,minutes:r,seconds:a},m="";for(var h in c)m+=h+": "+c[h]+", ";return m},e.View.UserTable.Body.Row=n}(App,document);