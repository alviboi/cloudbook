function InitialWizard(){}

/**
 * Initialize wizard that show open or create new project
 */
InitialWizard.prototype.showIntro = function showIntro() {
	this.initializeWizardDiv();
	this.showNewOpenProject({data:{that:this}});
};

InitialWizard.prototype.initializeWizardDiv = function() {
  var container = $(document.createElement('div')).attr('id','wizard');
  container.dialog({modal:true,dialogClass: "no-close",closeOnEscape: false});
};

/**
 * Show wizard with recent projects to open, create new project or open other project
 * @param {event} e to send this object reference
 */
InitialWizard.prototype.showNewOpenProject = function showNewOpenProject(e) {
    var that = e.data.that;
    var userconfig = application.config.user.getInstance();
    var backend = application.backend.core.getInstance();
    var fs = require('fs');
    var wizarddiv = $("#wizard") ;
    wizarddiv.empty();

    var datainfo = userconfig.getLastProjects();
    var template = fs.readFileSync('./templates/initialwizard.step1.hbs',{encoding:'utf8'});
    var templatecompiled = application.util.template.compile(template);
    var data = {
        projects : datainfo.slice(-5)
    };
    wizarddiv.append(templatecompiled(data));
    $('#newproject').click({that:that},that.showTypeProject);
    $('#listProjects button').click({that:that},that.launcherloadProject);
};

/**
 * Load dialog on #wizard div to create new project.
 * @param  {event} e to send this object reference
 */
InitialWizard.prototype.showTypeProject = function(e) {
	var that = e.data.that;
	var fs = require('fs');
	$("#wizard").empty();
	var template = fs.readFileSync('./templates/initialwizard.step2.hbs',{encoding:'utf8'});
	var templatecompiled = application.util.template.compile(template);
	$("#wizard").append(templatecompiled());

	$("#advprojbtn").click(function(){
		var controller = application.controller.getInstance();
		controller.createProProject($("#projectname").val());
		$('#wizard').dialog('close');
		$('#wizard').remove();
	});
	$("#smplprojbtn").click(function(){
		var controller = application.controller.getInstance();
		controller.createSimpleProject($("#projectname").val());
		$('#wizard').dialog('close');
		$('#wizard').remove();
	});
	$("#wzrdgoback").click({that:that},that.showNewOpenProject);

	$("#projectname").keyup(function(e){
		var backend = application.backend.core.getInstance();
		if(backend.checkProjectExists(this.value)){
			$("#projectnamecontainer").removeClass("has-success").addClass("has-error");
			$("#validateindicator").removeClass("glyphicon-ok").addClass("glyphicon-remove");
			$("#advprojbtn").attr("disabled","disabled");
			$("#smplprojbtn").attr("disabled","disabled");

		}
		else{
			$("#projectnamecontainer").addClass("has-success").removeClass("has-error");
			$("#validateindicator").addClass("glyphicon-ok").removeClass("glyphicon-remove");
			$("#advprojbtn").removeAttr("disabled");
			$("#smplprojbtn").removeAttr("disabled");
		}
	})
	.focus();

};

InitialWizard.prototype.launcherloadProject = function launcherloadProject(e) {
  var that = e.data.that;
  var element = e.currentTarget;
  var path = element.dataset.path;
  var controller = application.controller.getInstance();
  controller.loadProject(path + "/project.cloudbook");
  $("#wizard").dialog('close');
  $("#wizard").remove();
};


CBUtil.createNameSpace('application.ui.initialwizard.core');
application.ui.initialwizard.core = CBUtil.singleton(InitialWizard);