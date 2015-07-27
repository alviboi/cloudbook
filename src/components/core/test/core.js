var Project = window.Project;
var util = require('util');
var CBobject = CBUtil.req("js/lib/core/components/cbobject.js");
var metadata = require( "./"+__module_path__ + 'metadata.json');

function TestBox(objectdata){
  objectdata = typeof objectdata !== 'undefined' ? objectdata : {"position" : [200,200], "size":[300,0]};
  objectdata.idtype = metadata['idtype'];
  TestBox.super_.call(this,objectdata);
  this.testidentifier = typeof objectdata.testidentifier !== 'undefined' ? objectdata.testidentifier : "test_" + this.uniqueid ; 
  this.legend = typeof objectdata.legend !== 'undefined' ? objectdata.legend : CBI18n.gettext("Test exam") ; 
  this.description = typeof objectdata.description !== 'undefined' ? objectdata.description : CBI18n.gettext("Description of your test") ; 
  this.questions = typeof objectdata.questions !== 'undefined' ? objectdata.questions : [] ;
  this.order = typeof objectdata.order !== 'undefined' ? objectdata.order : CBI18n.gettext("Answer all questions before clicking button") ; 
  this.percentage = typeof objectdata.percentage !== 'undefined' ? objectdata.percentage : 50 ;
  this.group =  typeof objectdata.group !== 'undefined' ? objectdata.group : 1 ;
  this.caption = typeof objectdata.caption !== 'undefined' ? objectdata.caption : CBI18n.gettext("Name of your test");
}

util.inherits(TestBox,CBobject);

TestBox.prototype.editorView = function editorView() {
  var aux = TestBox.super_.prototype.editorView.call(this);
  var fs = require('fs');
  var template = fs.readFileSync("./"+__module_path__ + 'rsrc/templates/activityview.hbs',{encoding:'utf8'});
  var templatecompiled = application.util.template.compile(template);
  options={"identifier":this.testidentifier,"description":this.description,questions:this.questions,"order":this.order, "okmessage": CBI18n.gettext("Test passed"), 
  "failmessage": CBI18n.gettext("Test failed"), "group":this.group};
  aux.children('.cbcontainer').append($(templatecompiled(options)));
  return aux;
};

TestBox.prototype.htmlView = function htmlView() {
  var aux = TestBox.super_.prototype.htmlView.call(this);
  var fs = require('fs');
  var template = fs.readFileSync("./"+__module_path__ + 'rsrc/templates/activityview.hbs',{encoding:'utf8'});
  var templatecompiled = application.util.template.compile(template);
  options={"identifier":this.testidentifier,"description":this.description,questions:this.questions,"order":this.order, "okmessage": CBI18n.gettext("Test passed"), 
  "failmessage": CBI18n.gettext("Test failed"), "group":this.group};
  aux.children('.cbcontainer').append($(templatecompiled(options)));
  return aux;
}

TestBox.prototype.pdfView = function pdfView() {
  var aux = TestBox.super_.prototype.pdfView.call(this);
  var fs = require('fs');
  var template = fs.readFileSync("./"+__module_path__ + 'rsrc/templates/activityview.hbs',{encoding:'utf8'});
  var templatecompiled = application.util.template.compile(template);
  options={"identifier":this.testidentifier,"description":this.description,questions:this.questions,"order":this.order, "okmessage": CBI18n.gettext("Test passed"), 
  "failmessage": CBI18n.gettext("Test failed"), "group":this.group};
  aux.children('.cbcontainer').append($(templatecompiled(options)));
  return aux;
}

TestBox.prototype.epubView = function epubView() {
  var aux = TestBox.super_.prototype.htmlView.call(this);
  var fs = require('fs');
  var template = fs.readFileSync("./"+__module_path__ + 'rsrc/templates/activityepub.hbs',{encoding:'utf8'});
  var templatecompiled = application.util.template.compile(template);
  options={"description":this.description,questions:this.questions,"order":this.order, "okmessage": CBI18n.gettext("Test passed"), 
  "failmessage": CBI18n.gettext("Test failed"), "group":this.group};
  aux.css("height","auto");
  aux.children('.cbcontainer').append($(templatecompiled(options)));
 return aux;
  
}

function getObjectsByGroup(groupNumber){
  var CBStorage = application.storagemanager.getInstance(); 
    var objectsFiltered = CBStorage.getCBObjectsBySectionAndType(Cloudbook.UI.selected.attr('data-cbsectionid'), 
      ["ad2a6410-8dcd-4ca7-9bf7-73043dcd5771", "87d7b00a-a296-4cd9-af13-f8d9685a6dec"]);
    var j = 1;
    var activities = [];
    objectsFiltered.forEach(function(element){
      if(element.group == groupNumber){
        activities.push(element);
      };
    });

    return activities;
}

function filterObjects(object, idGroup)
{
    var CBStorage = application.storagemanager.getInstance(); 
    var objectsFiltered = CBStorage.getCBObjectsBySectionAndType(Cloudbook.UI.selected.attr('data-cbsectionid'), 
      ["ad2a6410-8dcd-4ca7-9bf7-73043dcd5771", "87d7b00a-a296-4cd9-af13-f8d9685a6dec"]);
    var j = 1;
    object.questions = [];

    objectsFiltered.forEach(function(element){
      if(element.group == idGroup){
        element.pemObject.legend = CBI18n.gettext("Question") + " " + j;
        object.questions.push(element.pemObject);
        j++;
      }
    });
}

TestBox.prototype.clickButton = function clickButton(controllerClass) {
  var that = this;
  var dialog = $("<div id='testdialog'>" + CBI18n.gettext("Group") + "<input id='group' type='number' min='1' max='10' value='1'/><button id='action'>"+ CBI18n.gettext("Insert") +"</button></div>");
  dialog.dialog({dialogClass: "cbdialog",modal:true,close:function(){$(this).remove()}});
  
  $("#testdialog button").on('click',function(){
    var idGroup = $("#group").val();
    var questionsAux = {};
    filterObjects(that, idGroup);
    if(that.questions.length > 0)
      controllerClass.addCBObjectIntoSelectedSection(that.editorView(),that);dialog.dialog('close')});
};

TestBox.prototype.HTMLtags = function HTMLtags(node){
  var tagTypes = ['TEST'];
  var score = 0;
  if(tagTypes.indexOf(node.tagName) > -1)
  {
    score ++;
  }
  return score;
}

TestBox.prototype.importHTML = function importHTML(node, filePath){
  var that = this;
  if(node.tagName != null)
    {
      var k = 0;
      that.description = $(node).data("description");
      that.legend = $(node).data("legend");
      that.group = $(node).data("group");
      filterObjects(that, that.group);
      TestBox.super_.prototype.importHTML.call(that,node);
    }
}

TestBox.prototype.triggerAddEditorView = function triggerAddEditorView(jquerycbo,objectcbo) {
  var objects_pem = [], obj_myprefix_pem_identifier = {};

  TestBox.super_.prototype.triggerAddEditorView.call(this,jquerycbo,objectcbo);
 
  var obj_myprefix_test_identifier = {
   "id": this.testidentifier,
   "icons": "csshexent",
   "names": "legend",
   "qbase": 10,
   "threshold": this.percentage,
   "storagekey": "jsgeork",
   "caption": this.caption,
  };
  
  var args = new Array();
  filterObjects(this, this.group);
  args.push(obj_myprefix_test_identifier)
  for(i = 0; i < this.questions.length; i++){
    args.push(this.questions[i]);
  }

  jsGeork.Questions.Eval.apply(obj_myprefix_test_identifier, args);

  var z = jquerycbo.find(".CSSActFieldset");  
  z.css('width','100%');
  var counter = 0;
  var listelements = jquerycbo.find('table').children().each(function(index,element){
      counter += $(element).outerHeight(true);
    });
  counter += $(listelements[0]).outerHeight(true);
  jquerycbo.css('height',counter+"px");
  objectcbo.size[1] = counter;

  var myFunction = function(){
    var idTest = $(this).parent().attr("id").replace("_refresh","").replace("test_","");
    var CBStorage = application.storagemanager.getInstance();
    var groupNumber = CBStorage.getCBObjectById(idTest).group;
    var objectsFiltered = getObjectsByGroup(groupNumber);
    var jqueryObjects = [];
    var cont = 0, aux = 0;

    objectsFiltered.forEach(function(element){
        $("#" + element.pemidentifier).find("button").click();
        var idElement = element.pemidentifier != undefined?element.pemidentifier:element.fgpidentifier;
        jqueryObjects.push($("#" + idElement)[0]);
    });
    $(Cloudbook.UI.selected).find("div[class='divselector']").trigger("click");

    objectsFiltered.forEach(function(element){
        element2 = jqueryObjects[cont];
        $(element2).find("[aria-describedby]").each(function(){
           $("input[data-answer='"  + $(this).attr("data-answer") + "'][name='" + element.pemidentifier + "']").trigger("click");
        })

        $(element2).find("span[data-gap-fill]").each(function(){
           $($("[name='" + element.fgpidentifier + "']").find("input[data-gap]")[aux]).val()
        })
        cont++;
        var idelement = element.pemidentifier!=undefined?element.pemidentifier:element.fgpidentifier;
      $($("#" + idelement).find("button")[0]).click();
    });
  };

  $($("#" + this.testidentifier + "_refresh button")).on('click', myFunction);
};


TestBox.prototype.triggerHTMLView = function triggerHTMLView() {
  return '$(document).ready(function(){\
  var obj_myprefix_test_identifier = {\
   "id": "'+this.testidentifier+'",\
   "icons": "csshexent",\
   "names": "legend",\
   "qbase": 10",\
   "threshold":'+ this.percentage + '",\
   "storagekey": "jsgeork"\
  };\
  //jsGeork.Questions.Eval(obj_myprefix_test_identifier);\
  });';
};

TestBox.prototype.editButton = function editButton(e) {
  var that = e.data.that;
  var dialog = TestBox.super_.prototype.editButton.call(this,e);
  dialog.dialog('option','width',400);
  var template = fs.readFileSync("./"+__module_path__ + 'rsrc/templates/activityedit.hbs',{encoding:'utf8'});
  var templatecompiled = application.util.template.compile(template);
  dialog.children(".content").append(templatecompiled({'group':that.group, 'caption': that.caption, 'questions':that.caption}));
  dialog.callbacks.push(function(){updateQuestions(dialog,that);});
}


function updateQuestions(dialog,objectcbo){
  var group = "";

  var caption = dialog.find("#caption").val();

  if(getObjectsByGroup(dialog.find("#group").val()).length != 0){
    group = dialog.find("#group").val();
    filterObjects(objectcbo, group);
    objectcbo.group = group;
  }
  objectcbo.caption = caption;
}

module.exports = TestBox;
//@ sourceURL=test_core.js
