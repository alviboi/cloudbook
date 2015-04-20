/**
 * Base object to components. This object include position, size, type and others common elemens
 * @param {Object} objectdata Object base definition
 * @param {Array} objectdata.position Object position on page
 * @param {Array} objectdata.size Object size 
 * @param {String} objectdata.type Object type . This is used to restore object when load project  
 * @class CBObject
 */
function CBObject(objectdata){
	this.position = typeof objectdata.position !== 'undefined' ? objectdata.position : [200,200];
	this.size = typeof objectdata.size !== 'undefined' ? objectdata.size : [200,50];
	this.idtype = typeof objectdata.idtype !== 'undefined' ? objectdata.idtype : "CBObject";
	this.uniqueid = typeof objectdata.uniqueid !== 'undefined' ? objectdata.uniqueid : CBUtil.uniqueId();
	this.levellayer = typeof objectdata.levellayer !== 'undefined' ? objectdata.levellayer : 0;
	this.degree = typeof objectdata.degree !== 'undefined' ? objectdata.degree : 0;
}


/**
 * Render object to jQuery object to be included on page
 * @return {jQuery}
 */
CBObject.prototype.editorView = function editorView() {
	var aux = $(window.document.createElement('div'));
	var cbcontainer = $(window.document.createElement('div')).addClass('cbcontainer');
	var that = this;
	aux.css('left', this.position[0])
	   .css('top', this.position[1])
	   .addClass('cbobject')
	   .addClass('cbobject-editable')
	   .attr('tabindex','-1')
	   .attr('data-cbobjectid',this.uniqueid)
	   .css('position','absolute')
	   .css('z-index',this.levellayer)
	   .css('transform',"rotate("+this.degree+"deg)")
	   .css('width',this.size[0].toString() + "px")
	   .css('height',this.size[1].toString() + "px" );
	var bar = $(window.document.createElement('div'));
	bar.css('background-color','#4c4c4c')
		.addClass('draggable')
		.addClass('cbobject-bar');
	var edit = $(window.document.createElement('img')).attr('src',Cloudbook.UI.themeeditorpath + '/img/edit.png');
	var del = $(window.document.createElement('img')).attr('src',Cloudbook.UI.themeeditorpath + '/img/delete.png');
	var forward = $(window.document.createElement('img')).attr('src',Cloudbook.UI.themeeditorpath + '/img/forward.png');
	var backward = $(window.document.createElement('img')).attr('src',Cloudbook.UI.themeeditorpath + '/img/backward.png');
	var rotate = $(window.document.createElement('img')).attr('src',Cloudbook.UI.themeeditorpath + '/img/rotate.png');
	edit.click({that:this},that.editButton);
	del.click({that:this},that.deleteButton);
	forward.click({that:this},that.forwardButton);
	backward.click({that:this},that.backwardButton);
	rotate.on('mousedown',{that:this},that.rotateButton);
	bar.append([edit,del,forward,backward,rotate]);
	aux.append([bar,cbcontainer]);
	//aux.click(enableEditable);
	return aux;
};

/**
 * Render object to jQuery object to be exported to html
 * @return {jQuery}
 */
CBObject.prototype.htmlView = function htmlView() {
	var editView=this.editorView();
	editView.children('.cbobject-bar').remove();
	return editView;
}
/**
 * This string is return core to bind on button click event on editor view
 * @param {jQuery} jquerycbo jQuery representation object that is included on targetcontent
 * @param {CBOjbect} objectcbo CBObject that is stored on the project to later load project or export to other format.
 * @return {String} Function string.
 */
CBObject.prototype.triggerAddEditorView = function triggerAddEditorView(jquerycbo,objectcbo) {
	//var x = jquerycbo.get()[0];
	//x.addEventListener('click',enableEditable);
	jquerycbo.draggable( {
		stop: function(event,ui){ objectcbo.position = [ui.position.left,ui.position.top]; ui.helper.focus(); }, 
		scroll:true,handle:".draggable",
		drag: function(event,ui){ if(ui.position.left<0) ui.position.left = 0; if(ui.position.top<0) ui.position.top = 0; }
	});
	jquerycbo.resizable({stop: function(event,ui){ objectcbo.size = [ui.size.width,ui.size.height]} });
};


CBObject.prototype.clickButton = function clickButton(controllerClass) {
	controllerClass.addCBObjectIntoSelectedSection(this.editorView(),this);
};

CBObject.prototype.editButton = function editButton(e) {
	var that = e.data.that;
	var dialog = $("<div></div>");
	dialog.callbacks = [];
	dialog.dialog({
		modal:true,
		close:function(){
			
			var savedialog = $("<div id='savedialog'><button id='save'>Save</button><button id='cancel'>Cancel</button></div>");
			savedialog.children('#save').click(function(){
				dialog.callbacks.forEach(function lanzador(e){e()});
				var viewobject = $("[data-cbobjectid='"+that.uniqueid+"']");
				viewobject.replaceWith(that.editorView());
				that.triggerAddEditorView($("[data-cbobjectid='"+that.uniqueid+"']"),that);
				var CBStorage = application.storagemanager.getInstance();
    			CBStorage.setCBObjectById(that,that.uniqueid);
				dialog.remove() ;
				$('#savedialog').dialog('destroy'); });
			savedialog.children('#cancel').click(function(){dialog.remove() ; $('#savedialog').dialog('destroy');});
			savedialog.dialog({
				modal:true,
				close:function(){
					$(this).remove();
					dialog.dialog('open')}
			});
			
		}
	});
	return dialog;
};


CBObject.prototype.forwardButton = function forwardButton(e) {
	var that = e.data.that;
	var controller = application.controller.getInstance();
	controller.modifyObjectLevelLayer(that.uniqueid,that.levellayer + 1);
};

CBObject.prototype.backwardButton = function backwardButton(e) {
	var that = e.data.that;
	var controller = application.controller.getInstance();
	controller.modifyObjectLevelLayer(that.uniqueid,that.levellayer - 1);
};

CBObject.prototype.rotateButton = function rotateButton(e) {
	var that = e.data.that;
	var controller = application.controller.getInstance();
	controller.modifyObjectRotation(that.uniqueid,e);
};


CBObject.prototype.deleteButton = function deleteButton(e) {
	var that = e.data.that;
	var dialog = $('<div><button id="delete">Delete</button><button id="cancel">Cancel</button></div>');
	dialog.children('#delete').click(function(){
		var controller = application.controller.getInstance();
		controller.deleteCBObjectById(Cloudbook.UI.selected.attr('data-cbsectionid'),that.uniqueid);
		dialog.dialog('close');
	});
	dialog.children('#cancel').click(function(){dialog.dialog('close');});
	dialog.dialog({modal:true,close:function(){$(this).remove()}});
};


CBObject.prototype.exportHTML = function exportHTML() {
	var aux = $("<div></div>");
	aux.css('top', this.position[1])
	   .attr('tabindex','-1')
	   .css('position','absolute')
	   .css('z-index',this.levellayer)
	   .css('transform',"rotate("+this.degree+"deg)")
	   .css('width',this.size[0].toString() + "px")
	   .css('height',this.size[1].toString() + "px" );
	   return aux;
};


function enableEditable(e){
	var newid = this.dataset.cbobjectid;
	if(Cloudbook.UI.cbobjectselected !== newid ){
		if(Cloudbook.UI.cbobjectselected !== null)
			$("[data-cbobjectid='"+Cloudbook.UI.cbobjectselected+"']").removeClass('selected');
		Cloudbook.UI.cbobjectselected = newid;
		var actual = $("[data-cbobjectid='"+Cloudbook.UI.cbobjectselected+"']");
		actual.addClass('selected');

	}
}

module.exports = CBObject;
