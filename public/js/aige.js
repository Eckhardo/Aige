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
            {
                objectTypes: {
                    member: "member",
                    event: "event",
                    membership: "membership",
                    saison: "saison",
                    message: "message",
                    task: "task",
                    bank: "bank"}
            }
    var initModule = function ($container) {

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
        aige.shell.initModule($container);

    };

    return {initModule: initModule};
}());
