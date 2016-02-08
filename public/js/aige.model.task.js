/*
 * aige.model.task.js
 
 
 */

/*jslint         browser : true, continue : true,
 devel  : true, indent  : 2,    maxerr   : 50,
 newcap : true, nomen   : true, plusplus : true,
 regexp : true, sloppy  : true, vars     : false,
 white  : true
 */

/*global  $, aige, Event */

aige.model.task = (function () {

    //---------------- BEGIN MODULE SCOPE VARIABLES --------------
    'use strict';

    var configMap = {
        settable_map: {
            objectTypes: true
        },
        objectTypes: null
    },
    stateMap = {
        ajaxCall: null,
        currentTask: null,
        taskList: [],
        workingEventList: []
    },
    initModule, configModule, find_tasks, make_task_container, get_working_event_list, initialize_tasks;

    //----------------- END MODULE SCOPE VARIABLES ---------------

    //----------------- START UTILITY FUNCTIONS-----------------

    function filterWorkingEvents(membership_event_names, events) {

        var result = [], _event;
        for (var i = 0; i < events.length; i++) {
            _event = events[i];
            if (_event.type === "Arbeitsdienst") {
                if (aige.util.containsItem(membership_event_names, _event.name)) {
                    result.push(_event);
                }

            }

        }
        console.log("result " + JSON.stringify(result));
        return result;
    }
//----------------- END UTILITY FUNCTIONS-----------------


// The model.task object API
    // -------------------
    // This APi comprises task specific public methods and works closely together
    // with the   model.general object API (this provides generic methods for CRUD, and places the results
    // via the whole model available methods fill_state_maps.

    make_task_container = function (membership, events, subtasks) {
        var working_task, working_task_container;

        stateMap.workingEventList = filterWorkingEvents(membership.events, events);

        if (!aige.util.arrayIsNullOrEmpty(stateMap.workingEventList)) {

            working_task_container = (new AigeTask(membership.year, null, stateMap.workingEventList, subtasks, membership.members));


        }
        return working_task_container;

    };

    var AigeTask = function (year, workingTasks, workingEvents, subtasks, members) {

        this.year = year;
        this.workingTasks = [];
        if (!workingTasks) { // parameter was omitted in call)}
            for (var i = 0; i < workingEvents.length; i++) {
                this.workingTasks.push({name: workingEvents[i].name, subtasks: subtasks, members: members, member_subtasks: []});
            }
        } else {
            this.workingTasks = workingTasks;
        }
        return this;
    };

    AigeTask.prototype.workingEvents = function () {
        var eventnames = [];
        for (var i = 0; i < this.workingTasks.length; i++) {
            eventnames.push(this.workingTasks[i].name);
        }
        return eventnames;
    }




    //------------------- BEGIN PUBLIC METHODS -------------------
    find_tasks = function (object_type, searchParams, callback) {
        var task_object, search_task_promise = stateMap.ajaxCall.search(object_type, searchParams);
        var search_events_promise = stateMap.ajaxCall.search(configMap.objectTypes.event, searchParams);
        $.when(search_task_promise, search_events_promise).then(function (task_list, event_list) {
            if (!aige.util.arrayIsNullOrEmpty(task_list)) {
              
          
                console.log("task_list " + JSON.stringify(task_list));
                stateMap.currentTask = new AigeTask(task_list[0].year, task_list[0].workingTasks, null, null, null);
                stateMap.taskList.push(stateMap.currentTask);
                console.log("stateMap.currentTask " + JSON.stringify(stateMap.currentTask));
                stateMap.workingEventList = filterWorkingEvents(stateMap.currentTask.workingEvents(), event_list);
                console.log("stateMap.workingEventList " + JSON.stringify(stateMap.workingEventList));
                aige.model.clearStateMaps(configMap.objectTypes.task);
                aige.model.fillStateMaps(configMap.objectTypes.task, stateMap.taskList);
                  callback(null);
            }
        }).fail(function (error) {
            if (callback) {
                setTimeout(function () {
                    callback(error);
                }, 3000);
            }
        });
    }
    //
    // Begin public method /initialize_tasks/
    /**
     * No task init has been done yet. Now fetch membership, and fetch events for membership.eventNames that
     * correspond to "arbeitsdienste"; Afterwards create the taskContainer strucutre to be persisted into 
     * the task collection for the given year;
     * 
     * @param {type} object_type
     * @param {type} searchParams
     * @param {type} callback
     * @returns {none}
     */
    initialize_tasks = function (object_type, searchParams, subtasks, callback) {
        console.log("initialize_tasks ");
        var ms;
        var search_ms_promise = stateMap.ajaxCall.search(configMap.objectTypes.membership, searchParams);
        var search_events_promise = stateMap.ajaxCall.search(configMap.objectTypes.event, searchParams);

        $.when(search_ms_promise, search_events_promise).then(function (membership_list, event_list) {
            ms = membership_list[0];
            stateMap.currentTask = make_task_container(ms, event_list, subtasks);
            console.log(" stateMap.currentTask  " + JSON.stringify(stateMap.currentTask));
            aige.model.general.createItem(configMap.objectTypes.task, stateMap.currentTask, function (error) {
                if (error) {
                    callback(error);
                } else {
                    callback(null);
                }
            }, searchParams);
        }).fail(function (error) {
            if (callback) {
                setTimeout(function () {
                    callback(error);
                }, 3000);
            }
        });
    };



    // Begin public method /get_working_event_list/
    // Purpose    : Returns event objects of type "Arbeitsdienst" that match to the working_events
    // in the task object;
    // Arguments  : null

    // Returns    : event objects of type "Arbeitsdienst"
    // Throws     : none
    //
    get_working_event_list = function () {
        return stateMap.workingEventList;
    }
    // End public method /get_working_event_list/




    // Begin public method /configModule/
    // Purpose    : Adjust configuration of allowed keys
    // Arguments  : A map of settable keys and values
    //   * color_name - color to use
    // Settings   :
    //   * configMap.settable_map declares allowed keys
    // Returns    : true
    // Throws     : none
    //
    configModule = function (input_map) {
        aige.util.setConfigMap({
            input_map: input_map,
            settable_map: configMap.settable_map,
            config_map: configMap
        });
        return true;
    };
    // End public method /configModule/

    // Begin public method /initModule/
    // Purpose    : Initializes module with collection specific ajax calls;
    // Arguments  :

    // Returns    : true
    // Throws     : none
    //
    initModule = function () {
        stateMap.ajaxCall = aige.data.ajaxCall;
        return true;
    };
    // End public method /initModule/

    // return public methods
    return {
        configModule: configModule,
        initModule: initModule,
        initialize_tasks: initialize_tasks,
        getWorkingEvents: get_working_event_list,
        findTasks: find_tasks


    };
    //------------------- END PUBLIC METHODS ---------------------
}());

