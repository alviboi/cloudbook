(function(){
    var gui = require('nw.gui');

    // get the window object
    var win = gui.Window.get();
    var menubar = new gui.Menu({
        type: 'menubar'
      });
    var controller = application.controller.getInstance();
    /**
     * Actions for menu
     */

    function newProject(){
      var initialwizard = application.ui.initialwizard.core.getInstance();
      initialwizard.initializeWizardDiv();
      initialwizard.showTypeProject({data:{that:initialwizard}});
      $("#wzrdgoback").unbind('click');
      $("#wzrdgoback").click(function(){$("#wizardnewopenproject").dialog('close');$("#wizardnewopenproject").remove()});
    }

    function importProject(){
      var initialwizard = application.ui.initialwizard.core.getInstance();
      initialwizard.initializeWizardDiv();
      initialwizard.showImportProject({data:{that:initialwizard}});
      $("#wzrdgoback").unbind('click');
      $("#wzrdgoback").click(function(){$("#wizardnewopenproject").dialog('close');$("#wizardnewopenproject").remove()});
    }

    function saveAs() {
        var pathelement = $(document.createElement('input')).attr('type','file').attr('nwdirectory','');
        pathelement.change(function(evt) {
              CBUtil.createNameSpace('Project.Info');
              Project.Info.projectname = $(this).val();
              controller.saveProject($(this).val());
            });
        pathelement.trigger('click');
      }

    var new_project = {
      label: CBI18n.gettext('New project'),
      click: newProject
    };

    var save_project = {
      label: CBI18n.gettext('Save Project'),
      click: function saveProject() {
        if ( Project.Info.hasOwnProperty('projectpath')){
          controller.saveProject(Project.Info.projectpath);
        }
        else{
          saveAs();
        }
      }
    };

    var save_as_project = {
      label: CBI18n.gettext('Save Project as ...'),
      click: saveAs
    };


    var load_project = {
      label: CBI18n.gettext('Load Project'),
      click: function load_project() {
        var pathelement = $(document.createElement('input')).attr('type','file');
        pathelement.change(function(evt) {
              controller.loadProject($(this).val());
            });
        pathelement.trigger('click');
      }
    };

    var quit = {
      label: CBI18n.gettext('Quit'),
      click: function quit() {
        window.close();
    }};

    var load_metadata = {
      label: CBI18n.gettext('Metadata'),
      click: function load_metadata(){
        CBDialogMetadata = new DialogMetadata();
        CBDialogMetadata.showDialog();
      }
    };

    var import_html5 = {
      label: CBI18n.gettext('HTML5'),
      click: function import_html5(){
      var pathelement = $(document.createElement('input')).attr('type','file').attr('accept', 'text/html');
              pathelement.change(function(evt) {
                  var importation = application.importation.getInstance();
                  importation.loadFile($(this).val(), 'HTML');
              });
      pathelement.trigger('click');      
      }
    };

    var import_odt_doc_docx = {
      label: CBI18n.gettext('ODT/DOC/DOCX'),
      click: function import_odt_doc_docx(){
      var pathelement = $(document.createElement('input')).attr('type','file').attr('accept', '.doc,.docx,.odt');
              pathelement.change(function(evt) {
                  var importation = application.importation.getInstance();
                  importation.loadFile($(this).val(), 'ODT_DOC_DOCX');
              });
      pathelement.trigger('click');      
      }
    };

    var import_scorm = {
      label: CBI18n.gettext('SCORM'),
      click: function import_scorm(){
      var pathelement = $(document.createElement('input')).attr('type','file').attr('accept', '.zip');
              pathelement.change(function(evt) {
                   var importation = application.importation.getInstance();
                    importation.loadFile($(this).val(), 'SCORM');
              });
      pathelement.trigger('click');      
      }
    };

    var import_metadata = {
      label: CBI18n.gettext('Metadata LOM-ES'),
      click: function import_metadata(){
      var pathelement = $(document.createElement('input')).attr('type','file').attr('accept', '.xml');
              pathelement.change(function(evt) {
                  var importation = application.importation.getInstance();
                  importation.loadFile($(this).val(), 'METADATA');
              });
      pathelement.trigger('click');      
      }
    };

    var import_project = {
      label: CBI18n.gettext('Import...'),
      click: importProject
    };

    /**
     * Generate menubar
     */
    var file = new gui.Menu();
    var project = new gui.Menu();
    //var import_project_menu = new gui.Menu();
    // import_project_menu.append(new gui.MenuItem(import_html5));
    // //import_project_menu.append(new gui.MenuItem(import_odt_doc_docx));
    // import_project_menu.append(new gui.MenuItem(import_scorm));
    // import_project_menu.append(new gui.MenuItem(import_metadata));
    // import_project.submenu = import_project_menu;
    
    file.append(new gui.MenuItem(new_project));
    file.append(new gui.MenuItem(load_project));
    file.append(new gui.MenuItem(save_as_project));
    file.append(new gui.MenuItem(save_project));
    file.append(new gui.MenuItem({type:'separator'}));
    file.append(new gui.MenuItem(import_project));
    file.append(new gui.MenuItem({type:'separator'}));
    file.append(new gui.MenuItem(quit));
    project.append(new gui.MenuItem(load_metadata));


    /**
     *  Generate Insert menu 
     */
    
    var actions = new gui.Menu();

    Object.keys(Cloudbook.Actions).forEach(function (component) {
      var path = require('path');
      var componentpath = Cloudbook.Actions[component]['path'];
      var description = require("./" + path.join(componentpath,"metadata.json"));
      var backend = application.backend.core.getInstance();
      backend.loadComponentExtraCss(componentpath,description);
      var aux = {
        label : CBI18n.gettext(description.label),
        click : function generateElement(){
          var fullobject = new Cloudbook.Actions[component]['component']();
          var controller = application.controller.getInstance();
          fullobject.clickButton(controller);
        }
      }
      actions.append(new gui.MenuItem(aux));
    });

    menubar.append(new gui.MenuItem({ label: CBI18n.gettext('File'), submenu: file}));
    menubar.append(new gui.MenuItem({ label: CBI18n.gettext('Project'), submenu: project}));
    menubar.append(new gui.MenuItem({ label: CBI18n.gettext('Insert'), submenu: actions}));





    win.menu = menubar;
})();