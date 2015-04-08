/**
 * This class contain all commons and generic functions to call other specific functions from other class. 
 * For example, updateSectionName function is a function to update section name. For this purpose must call
 * methods from backend and ui. With this method, on application only call this method and this will call
 *  all needed functions  
 *  @class Controller
 */
function Controller(){

}

/**
 * Update section name 
 * @param  {String} name        New section name
 * @param  {String} cbsectionid Section id to rename
 */
Controller.prototype.updateSectionName = function(name,cbsectionid) {
	var backend = application.backend.core.getInstance();
	var ui = application.ui.core.getInstance();
	backend.updateSectionName(name,cbsectionid);
	ui.sectionmanager.updateSectionName(name,cbsectionid);
};

/**
 * Create new project on pro view.
 * @param  {String} name Project name
 */
Controller.prototype.createProProject = function createProProject(name) {
	CBUtil.include("js/lib/gui/menu.js");
 	var backend = application.backend.core.getInstance()
 	var ui = application.ui.core.getInstance()
 	backend.createProject(name);
 	backend.loadSectionsObjects();
 	backend.initSections();
 	ui.setSectionManager('Pro');
 	ui.renderActionsButtons();
 	ui.emptyTargetContent();
 	ui.sectionmanager.initSections();
 	ui.sectionmanager.createFirstSection();
 	this.saveProject(Project.Info.projectpath);
};

/**
 * Delete section indicate. This method delete all files contained into sections and subsections
 * @param  {String} cbsectionid Section id to delete
 */
Controller.prototype.deleteSection = function(cbsectionid) {
	var backend = application.backend.core.getInstance();
	var ui = application.ui.core.getInstance();
	backend.deleteSection(cbsectionid);
	ui.sectionmanager.deleteSection(cbsectionid);
};

Controller.prototype.createSimpleProject = function createSimpleProject(name) {
	var dialog = $("<div>Este tipo de proyecto aun no esta implementado</div>");
	dialog.dialog({modal:true,close:function(event,ui)
		{
			$(this).remove();
		}})


};

Controller.prototype.loadProject = function loadProject(path) {
	CBUtil.include("js/lib/gui/menu.js");
	var backend = application.backend.core.getInstance();
	var ui = application.ui.core.getInstance();
	backend.loadSectionsObjects();
	ui.renderActionsButtons();
	ui.emptyTargetContent();
	backend.loadProject(path);
	ui.loadProject(path);
};

Controller.prototype.saveProject = function(path) {
	var backend = application.backend.core.getInstance();
	var ui = application.ui.core.getInstance();
	backend.saveProject(path);
};



Controller.prototype.popSubsection = function popSubsection(cbsectionid,sonid) {
	var backend = application.backend.core.getInstance();
	backend.popSubsection(cbsectionid,sonid);
};


Controller.prototype.addCBObjectIntoSection = function addCBObjectIntoSection(jquerycbo,objectcbo) {
  var CBStorage = application.storagemanager.getInstance();	
  $(Cloudbook.UI.targetcontent).append(jquerycbo);
  objectcbo.add_callback(jquerycbo,objectcbo);
  var sectionWhereAppend = CBStorage.getSectionById(Cloudbook.UI.selected.attr('data-cbsectionid'));
  sectionWhereAppend.content.push(objectcbo.uniqueid);
  CBStorage.setCBObjectById(objectcbo,objectcbo.uniqueid);
  CBStorage.setSectionById(sectionWhereAppend,Cloudbook.UI.selected.attr('data-cbsectionid'));
};

Controller.prototype.deleteCBObjectById = function deleteCBObjectById(cbsectionid,cbobjectid) {
	var backend = application.backend.core.getInstance();
	var ui = application.ui.core.getInstance();
	backend.removeCBObjectById(cbsectionid,cbobjectid);
	ui.removeCBObjectById(cbobjectid);
};
/**
 * This namespace has singleton instance of Controller class
 * @namespace controller
 * @memberOf application
 */
CBUtil.createNameSpace('application.controller');
application.controller = CBUtil.singleton(Controller);