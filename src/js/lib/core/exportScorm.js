
/**
 * @class Export
 * @classdesc This class is responsible to export project to WebZip file
 */

function ExportScorm(){
	     
};


ExportScorm.prototype.createTemppath=function createTemppath(){
    var mktemp = require('mktemp');
    var temppath = mktemp.createDirSync("/tmp/cloudbook_XXXX");
    return temppath + "/";    

};


ExportScorm.prototype.renderImslrm=function renderImslrm(dest){
    
    var fs = require('fs');
    var fileimslrm = "";
  
    var fullmetainfo = parserImslrm();
    var template = fs.readFileSync('./templates/imslrm.hbs',{encoding:'utf8'});
    var templatecompiled = application.util.template.compile(template);
    fileimslrm = templatecompiled(fullmetainfo);

    fs.writeFileSync(dest+"imslrm.xml", fileimslrm);

    alert(fileimslrm);

};    


function parserImslrm() {
    var metadatos=Project.Info.LOM;
    var listaclaves = Object.keys(metadatos);
    var imslrm = {};
    //imslrm["general"] = {};
    //imslrm["general"]["identifier"]=[];
    //imslrm["general"]["title"] = [];
    //imslrm["general"]["language"]=[];
    //imslrm["general"]["description"]=[];
    //imslrm["general"]["keyword"]=[];
    //imslrm["general"]["coverage"]=[];
    //imslrm["general"]["structure"]=[];
    //imslrm["general"]["aggregationLevel"]=[];
    //imslrm["lifeCycle"]={};
    //imslrm["lifeCycle"]["version"]=[];
    //imslrm["lifeCycle"]["status"]=[];
    //imslrm["lifeCycle"]["contribute"]={};
   


    listaclaves.forEach(function(e){
      
    // General
        
        // Analizando categorias
        if(e.indexOf("cat_") === 0 ){
            
            ExportScorm.prototype.checkname(imslrm,"general.identifier",{last:"array"});
            var x = {"catalog":"", "entry":""};
            var aux = Project.Info.LOM[e]
            for( var field in aux){
                x[field.split("_")[0]] = aux[field];
               
            }
            imslrm.general.identifier.push(x);
        }
       //Analizando titulos
        if(e.indexOf("tit_") === 0 ){
            
            ExportScorm.prototype.checkname(imslrm,"general.title",{last:"array"});
            var x = {"titleLang":"", "title":""};
            var aux = Project.Info.LOM[e]
            for( var field in aux){
                x[field.split("_")[0]] = aux[field];
               
            }
            imslrm.general.title.push(x);
        }    
        
        //Analizando idiomas
        if(e.indexOf("idiom_") === 0 ){
            
            ExportScorm.prototype.checkname(imslrm,"general.language",{last:"array"});
            var x = {"mainLang":""};
            var aux = Project.Info.LOM[e]
            for( var field in aux){
                x[field.split("_")[0]] = aux[field];
               
            }
            imslrm.general.language.push(x);
        }    

        //Analizando descriptions
        if(e.indexOf("descGeneral_") === 0 ){
            
            ExportScorm.prototype.checkname(imslrm,"general.description",{last:"array"});
            var x = {"descGeneralLang":"","Description":""};
            var aux = Project.Info.LOM[e]
            for( var field in aux){
                x[field.split("_")[0]] = aux[field];
               
            }
            imslrm.general.description.push(x);
        }    

         //Analizando keywords
        if(e.indexOf("keywordGeneral_") === 0 ){
            
            ExportScorm.prototype.checkname(imslrm,"general.keyword",{last:"array"});
            var x = {"keywordGeneralLang":"","keywordGeneral":""};
            var aux = Project.Info.LOM[e]
            for( var field in aux){
                x[field.split("_")[0]] = aux[field];
               
            }
            imslrm.general.keyword.push(x);
        }    

        //Analizando coverage
        if(e.indexOf("coverage_") === 0 ){
            
            ExportScorm.prototype.checkname(imslrm,"general.coverage",{last:"array"});
            var x = {"coverageLang":"","coverage":""};
            var aux = Project.Info.LOM[e]
            for( var field in aux){
                x[field.split("_")[0]] = aux[field];
               
            }
            imslrm.general.coverage.push(x);
        }    

        //Analizando structure
               
        if(e.indexOf("structuresGeneral_1") === 0 ){
            
            ExportScorm.prototype.checkname(imslrm,"general.structure",{last:"array"});
            var x = {"structuresGeneral_1":""};
            x["structuresGeneral_1"]= Project.Info.LOM[e];
            imslrm.general.structure.push(x);
        }

         //Analizando aggregationLevel
               
        if(e.indexOf("aggregationLevels_1") === 0 ){
            
            ExportScorm.prototype.checkname(imslrm,"general.aggregationLevel",{last:"array"});
            var x = {"aggregationLevels_1":""};
            x["aggregationLevels_1"]= Project.Info.LOM[e];
            imslrm.general.aggregationLevel.push(x);
        }
      

    //lifeCycle
        
         //Analizando versionlifeCycle
        if(e.indexOf("versionlifecycle_") === 0 ){
            
            ExportScorm.prototype.checkname(imslrm,"lifeCycle.version",{last:"array"});
            var x = {"lifeCycleLang":"","versionlifecycle1":""};
            var aux = Project.Info.LOM[e]
            for( var field in aux){
                x[field.split("_")[0]] = aux[field];
               
            }
            imslrm.lifeCycle.version.push(x);
        }    
         //Analizando status
               
        if(e.indexOf("statusLifeCycle_1_1") === 0 ){
            
            ExportScorm.prototype.checkname(imslrm,"lifeCycle.status",{last:"array"});
            var x = {"statusLifeCycle_1_1":""};
            x["statusLifeCycle_1_1"]= Project.Info.LOM[e];
            imslrm.lifeCycle.status.push(x);
        }

        //Analizando contribute
               
        if(e.indexOf("contrLyfeCycle_") === 0){
            var aux = metadatos[e];
            ExportScorm.prototype.checkname(imslrm,"lifeCycle.contribute",{last:"array"})
            var contribute = {};
            Object.keys(aux).forEach(function(field){
                //field : key of aux
                if( field.indexOf("rolesLifeCycle_")===0){
                    contribute.rolesLifeCycle = aux[field];
                }
                if( field.indexOf("nameContribLifeCycle_")===0){
                    ExportScorm.prototype.checkname(contribute,"entity");
                    contribute.entity.nameContribLifeCycle = aux[field];
                }
                if( field.indexOf("emailContribLifeCycle_")===0){
                    ExportScorm.prototype.checkname(contribute,"entity");
                    contribute.entity.emailContribLifeCycle = aux[field];
                }
                if( field.indexOf("organContribLifeCycle_")===0){
                    ExportScorm.prototype.checkname(contribute,"entity");
                    contribute.entity.organContribLifeCycle = aux[field];
                }
                if( field.indexOf("dateContribLifeCycle_")===0){
               //     ExportScorm.prototype.checkname(contribute,"date");
                    contribute.dateContribLifeCycle = aux[field];
                }
                if( field.indexOf("DIVdescContribLifeCycle_")===0){
                    ExportScorm.prototype.checkname(contribute,"description",{last:"array"});
                    var x = {"ContribLifeCycleLang":"","DescriptionContribLifeCycle":""};
                    for( var info in aux[field]){
                        x[info.split("_")[0]] = aux[field][info];
               
                     }
                     contribute.description.push(x);
                }     
                
                
            });
           imslrm.lifeCycle.contribute.push(contribute);
          
        }    
        
    //Metametada

        //Analizando Identifier
        if(e.indexOf("catMetadata_") === 0 ){
            
            ExportScorm.prototype.checkname(imslrm,"metaMetadata.identifier",{last:"array"});
            var x = {"metametadataCatalog":"", "metametadataEntry":""};
            var aux = Project.Info.LOM[e]
            for( var field in aux){
                x[field.split("_")[0]] = aux[field];
               
            }
            imslrm.metaMetadata.identifier.push(x);
        }

        //Analizando MetaMetadata Schema

        if (e.indexOf("schemaMetametadataValue_1")===0){
                        
            imslrm.metaMetadata.metadataSchema=Project.Info.LOM[e];
        }
       
       //Analizando MetaMetadata Language

        if (e.indexOf("langMetametadataValue_")===0){
                        
            imslrm.metaMetadata.langMetametada=Project.Info.LOM[e];
        }

       // Analizando MetaMetada contribute

                      
        if(e.indexOf("contrMetametadata_") === 0){
            var aux = metadatos[e];
            ExportScorm.prototype.checkname(imslrm,"metaMetadata.contribute",{last:"array"})
            var contribute = {};
            Object.keys(aux).forEach(function(field){
                //field : key of aux
                if( field.indexOf("rolesMetametadata_")===0){
                    contribute.rolesMetametadata = aux[field];
                }
                if( field.indexOf("nameContribMetametadata_")===0){
                    ExportScorm.prototype.checkname(contribute,"entity");
                    contribute.entity.nameContribMetametadata = aux[field];
                }
                if( field.indexOf("emailContribMetametadata_")===0){
                    ExportScorm.prototype.checkname(contribute,"entity");
                    contribute.entity.emailContribMetametadata = aux[field];
                }
                if( field.indexOf("organContribMetametadata_")===0){
                    ExportScorm.prototype.checkname(contribute,"entity");
                    contribute.entity.organContribMetametadata = aux[field];
                }
                if( field.indexOf("dateContribMetametadata_")===0){
               //     ExportScorm.prototype.checkname(contribute,"date");
                    contribute.dateContribMetametadata = aux[field];
                }
                if( field.indexOf("DIVdescContribMetametadata_")===0){
                    ExportScorm.prototype.checkname(contribute,"description",{last:"array"});
                    var x = {"ContribMetametadataLang":"","DescriptionContribMetametadata":""};
                    for( var info in aux[field]){
                        x[info.split("_")[0]] = aux[field][info];
               
                     }
                     contribute.description.push(x);
                }     
                
                
            });
           imslrm.metaMetadata.contribute.push(contribute);
          
        }    

    // Technical
        //Analizando format Technical
        if(e.indexOf("formatTechnical_") === 0 ){
            
            ExportScorm.prototype.checkname(imslrm,"technical.format",{last:"array"});
            var x = {"formatTechnicalValue":""};
            var aux = Project.Info.LOM[e]
            for( var field in aux){
                x[field.split("_")[0]] = aux[field];
               
            }
            imslrm.technical.format.push(x);
        }        

        //Analizando size Technical
        if(e.indexOf("sizeTechnicalValue_1") === 0 ){
            imslrm.technical.size=Project.Info.LOM[e];
           
        }     

        //Analizando  location Technical
        if(e.indexOf("locationTechnical_") === 0 ){
            
            ExportScorm.prototype.checkname(imslrm,"technical.location",{last:"array"});
            var x = {"locationTechnicalValue":""};
            var aux = Project.Info.LOM[e]
            for( var field in aux){
                x[field.split("_")[0]] = aux[field];
               
            }
            imslrm.technical.location.push(x);
        }   

        // Analizando requeriments Technical

       if(e.indexOf("requirementsTechnical_") === 0){
            var aux = metadatos[e];
            ExportScorm.prototype.checkname(imslrm,"technical.requeriments",{last:"array"})
            var requeriments = {};
            Object.keys(aux).forEach(function(field){
                //field : key of aux
                if( field.indexOf("typeTechnicalReq_")===0){
                    requeriments.typeTechnicalReq = aux[field];
                }
                if( field.indexOf("nameTechnicalReq_")===0){
                    requeriments.nameTechnicalReq = aux[field];
                }
                if( field.indexOf("minVerTechnicalReq_")===0){
                    requeriments.minVerTechnicalReq = aux[field];
                }
                if( field.indexOf("versmaxTechnicalReq_")===0){
                    requeriments.maxVerTechnicalReq = aux[field];
                }
                          
            });
           imslrm.technical.requeriments.push(requeriments);
          
        }  

       // Analizando installRemarks Technical
          
        if(e.indexOf("installRemTech_") === 0 ){
            
            ExportScorm.prototype.checkname(imslrm,"technical.installationRemarks",{last:"array"});
            var x = {"installRemTechValue":"", "LangRemTech":""};
            var aux = Project.Info.LOM[e]
            for( var field in aux){
                x[field.split("_")[0]] = aux[field];
               
            }
            imslrm.technical.installationRemarks.push(x);
        }      

       // Analizando otherPlatformRequirements Technical

        if(e.indexOf("requirementsRemTech_") === 0 ){
            
            ExportScorm.prototype.checkname(imslrm,"technical.otherPlatformRequirements",{last:"array"});
            var x = {"requirementsRemTechValue":"", "LangOtherTech":""};
            var aux = Project.Info.LOM[e]
            for( var field in aux){
                x[field.split("_")[0]] = aux[field];
               
            }
            imslrm.technical.otherPlatformRequirements.push(x);
        }  

        //Analizando duration technicla

        ExportScorm.prototype.checkname(imslrm,"technical.duration",{last:"list"})

        if (e.indexOf("durationYearsDurTech_1")===0){
                        
            imslrm.technical.duration.durationYearsDurTech=Project.Info.LOM[e];
        }

        if (e.indexOf("durationMonthsDurTech_1")===0){
                        
            imslrm.technical.duration.durationMonthsDurTech=Project.Info.LOM[e];
        }

        if (e.indexOf("durationDaysDurTech_1")===0){
                        
            imslrm.technical.duration.durationDaysDurTech=Project.Info.LOM[e];
        }
        
        if (e.indexOf("durationHoursDurTech_1")===0){
                        
            imslrm.technical.duration.durationHoursDurTech=Project.Info.LOM[e];
        }


        if (e.indexOf("durationminutesDurTech_1")===0){
                        
            imslrm.technical.duration.durationMinutesDurTech=Project.Info.LOM[e];
        }

        if (e.indexOf("durationsecondsDurTech_1")===0){
                        
            imslrm.technical.duration.durationSecondsDurTech=Project.Info.LOM[e];
        }


        if(e.indexOf("descdurationDurTech_") === 0){
            ExportScorm.prototype.checkname(imslrm,"technical.duration.description",{last:"array"})
            var x = {"DescriptionDurTech":"","languageDescDurTech":""};
            var aux = Project.Info.LOM[e]
            for( var field in aux){
                x[field.split("_")[0]] = aux[field];
              
            }
            imslrm.technical.duration.description.push(x);
          
        }  



    });
    return imslrm;
};


ExportScorm.prototype.checkname=function checkname(dest,namespace,options){
    //var names = nameSpaceString.split(".");
    options = $.extend({},{last:"list"},options);
    var names=namespace.split(".");
    var parent = dest;
    var imax = names.length;
    var i;
    //if any nameSpace level doesn't exist, create it
    for (i = 0; i < imax  ; i++) {
        if (!parent[names[i]]) {
            if (i === imax - 1){
                if (options.last.toLowerCase() === "array")
                    parent[names[i]] = [];
                else
                    parent[names[i]] = {};
            }
            else{
                parent[names[i]] = {};
            }
        }
        parent = parent[names[i]];
    }
};



ExportScorm.prototype.paramScorm=function paramScorm(temp){
     
   var tempath = this.createTemppath();       
   alert (tempath);

   this.renderImslrm(tempath)

   $("#exportscormwizard").find('.waitingOK').css("display","inline");
        
};    
        

        


CBUtil.createNameSpace('application.core.exports.exportscorm.core');
application.core.exports.exportscorm.core = CBUtil.singleton(ExportScorm);
