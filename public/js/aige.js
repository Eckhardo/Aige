/*
 * aige.js
 * Root namespace module
 * 
 * Initializes the data module, the model module and the shell module.
 */

/*jslint           browser : true,   continue : true,
 devel  : true,    indent : 2,       maxerr  : 50,
 newcap : true,     nomen : true,   plusplus : true,
 regexp : true,    sloppy : true,       vars : false,
 white  : true
 */
/*global $, aige */

var aige = (function () {
    'use strict';
    var configMap =
            {isFakeData: false,
                objectTypes: {
                    member: "member",
                    event: "event",
                    membership: "membership",
                    saison: "saison",
                    message: "message",
                    task: "task",
                    bank: "bank"},
                actionTypes: {create: "create",
                    update: "update",
                    delete: "delete",
                    list: "list",
                    initialize: "initialize"}
            }
    var initModule = function ($container) {

        if (configMap.isFakeData) {
            console.log("aige.js is fake data ");
            aige.data.fake.initModule();
            aige.model.fake.configModule(
                    {objectTypes: configMap.objectTypes}
            );
            aige.model.fake.initModule();
            // saison has an own model ( due to its comlexity);
            aige.model.saison.configModule(
                    {objectTypes: configMap.objectTypes}
            );
            aige.model.saison.initModule();
            // task has an own model ( due to its comlexity);
            aige.model.task.configModule(
                    {objectTypes: configMap.objectTypes}
            );
            aige.model.task.initModule();
            aige.shell.configModule({
                general_model: aige.model.fake.general,
                member_model: aige.model.fake.member,
                actionTypes: configMap.actionTypes,
                isFakeData: configMap.isFakeData
            });
            aige.shell.initModule($container);
        } else {
            
            console.log("aige.js - real data");
            aige.data.initModule();
            aige.model.configModule(
                    {objectTypes: configMap.objectTypes}
            );
            aige.model.initModule();
            // saison has an own model ( due to its comlexity);
            aige.model.saison.configModule(
                    {objectTypes: configMap.objectTypes}
            );
            aige.model.saison.initModule();
            // task has an own model ( due to its comlexity);
            aige.model.task.configModule(
                    {objectTypes: configMap.objectTypes}
            );
            aige.model.task.initModule();
            aige.shell.configModule({
                general_model: aige.model.general,
                member_model: aige.model.member,
                actionTypes: configMap.actionTypes,
                isFakeData: configMap.isFakeData
            });
            aige.shell.initModule($container);
        }


    };

    return {initModule: initModule};
}());
