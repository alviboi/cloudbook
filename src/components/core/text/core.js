var Project = window.Project;  
var util = require('util');
var CBobject = CBUtil.req("js/lib/core/components/cbobject.js");
var metadata = require( "./"+__module_path__ + 'metadata.json');

/**
 * Class textbox 
 * @class TextBox
 * @extends CBObject
 * @param {Object} objectdata 
 * @param {String} objectdata.text Text object
 */

function TextBox(objectdata){
  objectdata = typeof objectdata !== 'undefined' ? objectdata : {"text":"Lorem ipsum", "position" : [200,200],'size':[100,50]};
  objectdata.idtype = metadata['idtype'];
  TextBox.super_.call(this,objectdata);
  this.text = objectdata.text;
}

util.inherits(TextBox,CBobject);

TextBox.prototype.editorView = function editorView() {
  var aux = TextBox.super_.prototype.editorView.call(this);
  var textarea = $(window.document.createElement('div'))
  					.val(this.text)
  					.addClass('cbtextbox')
  					.css('height','100%')
  					.css('width','100%');
  aux.children('.cbcontainer').append(textarea);
  return aux;
};

TextBox.prototype.importHTML = function importHTML(){
	return ['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'P', 'SPAN', 'UL', 'OL', 'A', 'SPAN', 'LABEL', 'BUTTON', 'INPUT', 'ADDRESS', 'BLOCKQUOTE', 'DL', 'TABLE',
	'BR','DT', 'FORM', 'DETAILS', 'SELECT', 'Q', 'RUBY', 'TEXTAREA'];
}

TextBox.prototype.add_callback = function add_callback(jquerycbo,objectcbo) {
	TextBox.super_.prototype.add_callback.call(this,jquerycbo,objectcbo);
	$(".raptor").raptor({
		plugins:{
			insertFile: false, 
			languageMenu: false, 
			clearFormatting: false, 
			textSub: false, 
			textSuper: false, 
			guides: false, 
			floatLeft: false, 
			floatNone: false, 
			floatRight: false, 
			logo: false, 
			dockToElement: false, 
			dockToScreen: false, 
			snippetMenu: false, 
			specialCharacters: false, 
			embed: false, 
			classMenu: false, 
			statistics: false 
		}
	});
};
/*
TextBox.add_callback = CBobject.add_callback + '; $( ".raptor" ).raptor({  \
										plugins:{ \
											insertFile: false, \
											languageMenu: false, \
											clearFormatting: false, \
											textSub: false, \
											textSuper: false, \
											guides: false, \
											floatLeft: false, \
											floatNone: false, \
											floatRight: false, \
											logo: false, \
											dockToElement: false, \
											dockToScreen: false, \
											snippetMenu: false, \
											specialCharacters: false, \
											embed: false, \
											classMenu: false, \
											statistics: false \
											} \
										});';
/*
function add (){
  return new TextBoxEditor();
}

function restore (objectdata){
  return new TextBoxEditor(objectdata);
}

exports.add = add;
exports.restore = restore;
*/
module.exports = TextBox;
