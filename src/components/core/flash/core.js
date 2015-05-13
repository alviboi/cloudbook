var Project = window.Project;
var util = require('util');
var CBobject = CBUtil.req("js/lib/core/components/cbobject.js");
var metadata = require( "./"+__module_path__ + 'metadata.json');

function FlashBox(objectdata){
  objectdata = typeof objectdata !== 'undefined' ? objectdata : {"resourcepath":null, "position" : [200,200], "size":[640,480]};
  objectdata.idtype = metadata['idtype'];
  FlashBox.super_.call(this,objectdata);
  this.resourcepath = objectdata.resourcepath;
}

util.inherits(FlashBox,CBobject);

FlashBox.prototype.editorView = function editorView() {
  var aux = FlashBox.super_.prototype.editorView.call(this);
  var flashelement = $(window.document.createElement('object')).attr('type','application/x-shockwave-flash').attr('data',Project.Info.projectpath + "/rsrc/"+ this.resourcepath);
  var params = [];
  params.push($(window.document.createElement('param')).attr('name','movie').attr('value',this.resourcepath));
  params.push($(window.document.createElement('param')).attr('name','quality').attr('value','high'));
  params.push($(window.document.createElement('param')).attr('name','scale').attr('value','exactfit'));
  params.push($(window.document.createElement('param')).attr('name','base').attr('value','.'));

  flashelement.css('height','100%');
  flashelement.css('width','100%');
  flashelement.append(params);
  var cliclayer = $(window.document.createElement('div')).addClass('cbcliclayer');
  aux.children('.cbcontainer').append([flashelement,cliclayer]);
  return aux;
};

FlashBox.prototype.htmlView = function htmlView() {
  var aux = FlashBox.super_.prototype.editorView.call(this);
  // Bug, Firefox flash don't support transform attribute
  aux.css('transform','');
  var flashelement = $(window.document.createElement('object')).attr('type','application/x-shockwave-flash').attr('data',"rsrc/"+ this.resourcepath);
  var params = [];
  params.push($(window.document.createElement('param')).attr('name','movie').attr('value',this.resourcepath));
  params.push($(window.document.createElement('param')).attr('name','quality').attr('value','high'));
  params.push($(window.document.createElement('param')).attr('name','scale').attr('value','exactfit'));
  params.push($(window.document.createElement('param')).attr('name','base').attr('value','.'));

  flashelement.css('height',this.size[1]);
  flashelement.css('width',this.size[0]);
  flashelement.append(params);
  aux.children('.cbcontainer').append(flashelement);
  return aux;
}

FlashBox.prototype.pdfView = function pdfView() {
  var aux = FlashBox.super_.prototype.pdfView.call(this);
  var fsextra = require('fs-extra');
  var pathtosavefile = Project.Info.projectpath + "/pdfextrafiles/"+this.uniqueid + "/";
  var linktopdf = "pdfextrafiles/"+this.uniqueid+"/"+this.resourcepath;
  var stringtopdf = CBI18n.gettext("Click to view interactive Flash resource");
  /**
   * Create folder to resources and copy inside these
   */
  fsextra.mkdirsSync(pathtosavefile);
  fsextra.copySync(Project.Info.projectpath + "/rsrc/"+ this.resourcepath,pathtosavefile+this.resourcepath);

  aux.append("<a href='"+linktopdf+"'>"+stringtopdf+"</a>");
  return aux;
}

FlashBox.prototype.epubView=function epubView(){
  return this.pdfView();
 }

FlashBox.prototype.clickButton = function clickButton(controllerClass) {
  var that = this;
  var dialog = $("<div id='flashdialog'><input id='flashpath' type='file' accept='.swf,.flv' /><button id='action'>"+ CBI18n.gettext("Insert") +"</button></div>");
  dialog.children('#action').click(function(){
    updateFlashPath(dialog,that);
  });
  dialog.dialog({modal:true,close:function(){$(this).remove()}});
  $("#flashdialog button").on('click',function(){controllerClass.addCBObjectIntoSelectedSection(that.editorView(),that);dialog.dialog('close')});
};

FlashBox.prototype.HTMLtags = function HTMLtags(node){
  var score = 0;
  var tagTypes = [{'OBJECT':['application/x-shockwave-flash', 'video/flv']}, {'EMBED':['application/x-shockwave-flash', 'video/flv']}];

  for(var i=0;i<tagTypes.length;i++){
        var obj = tagTypes[i];
        for(var key in obj){
            if(key == node.tagName){
              score++;
              if(node.hasAttributes() && node.hasAttribute('type'))
                if(node.attributes["type"] != undefined)
                  if(obj[key].indexOf(node.attributes["type"].nodeValue)> -1)
                  score++;
            }
        }
    }
  return score;
}

FlashBox.prototype.importHTML = function importHTML(node, filePath){
  var fs = require('fs-extra');
  var path = require('path');
  var resourcepath = "";
    try{
      
      if(node.tagName == "OBJECT")
        resourcepath = node.hasAttribute("data")? node.attributes['data'].nodeValue:"";

      if(node.tagName == "EMBED")
        resourcepath = node.attributes.getNamedItem("src") != null? node.attributes.getNamedItem("src").value:"";
      FlashBox.super_.prototype.importHTML.call(this,node);
      this.resourcepath = path.basename(this.copyresource(path.join(path.dirname(filePath),resourcepath)));
    }
    catch (err) {
        console.log('Errors in flash ' + err);
    }
}

FlashBox.prototype.triggerAddEditorView = function triggerAddEditorView(jquerycbo,objectcbo) {
  FlashBox.super_.prototype.triggerAddEditorView.call(this,jquerycbo,objectcbo);
};


FlashBox.prototype.editButton = function editButton(e) {
  var that = this;
  var dialog = FlashBox.super_.prototype.editButton.call(this,e);
  dialog.children(".content").append("<div id='flashdialog'><input id='flashpath' type='file' accept='.swf,.flv' /></div>");
  dialog.callbacks.push(function(){updateFlashPath(dialog,that)});
};





function updateFlashPath(dialog,that){
    var fs = window.require('fs');
    var fsextra = window.require('fs-extra');
    var path = window.require('path');
    /*
     * get new file path
     */
    var dialogHTMLRaw = dialog.get()[0];
    var result = dialogHTMLRaw.querySelectorAll('#flashpath');
    var originalpath = result[0].value;

    /*
     * Copy file to workspace
     */

    var originalbasename = path.basename(originalpath);
    var finalpath = Project.Info.projectpath +"/rsrc/"+originalbasename;
    while(true){
      try{
        fs.accessSync(finalpath);
        originalbasename = "0"+originalbasename;
        finalpath = Project.Info.projectpath + "/rsrc/"+ originalbasename;
      }
      catch(e){
        break;
      }
    }
    fsextra.copySync(originalpath,finalpath);
    /*
     * update component file
     */
    that.resourcepath = originalbasename;
}



//FlashBox.triggerAddEditorView =  CBobject.triggerAddEditorView;
/*
exports.add = function add() {
  return new FlashBox();
};

exports.restore = function restore(objectdata) {
  return new FlashBox(objectdata);
};
*/

module.exports = FlashBox;
//@ sourceURL=flash_core.js
