/*
 * aige.model.fake.task.js
 
 
 */

/*jslint         browser : true, continue : true,
 devel  : true, indent  : 2,    maxerr   : 50,
 newcap : true, nomen   : true, plusplus : true,
 regexp : true, sloppy  : true, vars     : false,
 white  : true
 */

/*global  $, aige, Event */

aige.model.fake.task = (function () {

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
        workingEventList: [],
        unreg_membership_members: []
    },
    initModule, configModule, findTasks, insertSubTask, updateSubTask, removeSubTask, getWorkingEvent, initializeTask,
            fetchWorkingEventNames, get_unregistered_members;

    get_unregistered_members = function () {
        return stateMap.unreg_membership_members;
    };

    //----------------- END MODULE SCOPE VARIABLES ---------------

    //----------------- START UTILITY FUNCTIONS-----------------


    function clearStateMap() {
        stateMap.currentTask = null;
        stateMap.taskList = [];
        stateMap.workingEventList = [];

    }
    /**
     * 
     * @param {type} event_names - a vcollection of evetn name (e.g Arbeitsdienst 1)
     * @param {type} events - all events of a given year
     * @returns {Array} of event objects
     */
    function filterWorkingEvents(event_names, events) {

        var result = [], _event;
        for (var i = 0; i < events.length; i++) {
            _event = events[i];
            if (_event.type === "Arbeitsdienst") {
                if (aige.util.containsItem(event_names, _event.name)) {
                    result.push(_event);
                }
            }
        }
        console.log("working events: " + JSON.stringify(result));
        return result;
    }



    fetchWorkingEventNames = function () {
        console.log("fetch working tasks names.... ");
        var workingTaskNames = [], workingEvents = stateMap.workingEventList;
        if (workingEvents) {
            workingTaskNames = workingEvents.map(function (item, index) {
                return item.name;
            });
        }
        console.log("working tasks names: " + JSON.stringify(workingTaskNames));
        return workingTaskNames;

    };
//----------------- END UTILITY FUNCTIONS-----------------


// The model.task object API
    // -------------------
    // This APi comprises task specific public methods and works closely together
    // with the   model.general object API (this provides generic methods for CRUD, and places the results
    // via the whole model available methods fill_state_maps.



    function make_task_container(membership, events, subtasks) {
        var working_task_container;

        stateMap.workingEventList = filterWorkingEvents(membership.events, events);
        if (!aige.util.arrayIsNullOrEmpty(stateMap.workingEventList)) {
            working_task_container = (new AigeTask(null, membership.year, null, stateMap.workingEventList, subtasks, membership.members));
        }
        return working_task_container;

    }
    ;

    var AigeTask = function (_id, year, workingTasks, workingEvents, subtasks, members) {
        this._id = _id;
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

    AigeTask.prototype.getWorkingEventNames = function () {
        var eventnames = [];
        for (var i = 0; i < this.workingTasks.length; i++) {
            eventnames.push(this.workingTasks[i].name);
        }
        return eventnames;
    }
    AigeTask.prototype.getWorkingTaskByName = function (name) {
        for (var i = 0; i < this.workingTasks.length; i++) {
            if (this.workingTasks[i].name === name) {
                return this.workingTasks[i];
            }
        }
    }
    /**
     * Returns a sub task by task id for a given working event (name);
     * 
     * @param {type} workingEventName
     * @param {type} taskId
     * @returns {aige_model_task_L16.AigeTask.prototype.getWorkingTaskByName.member_subtasks}
     */
    AigeTask.prototype.getSubTaskById = function (workingEventName, taskId) {

        return this.getWorkingTaskByName(workingEventName).member_subtasks[taskId];

    }
    /**
     * Returns a collection of members associated with a given working event (name);
     * 
     * @param {type} workingEventName
     * @returns {aige_model_task_L16.AigeTask.prototype.getWorkingTaskByName.members}
     */
    AigeTask.prototype.getWorkingTaskMembers = function (workingEventName) {

        return this.getWorkingTaskByName(workingEventName).members;

    }

    /**
     * Returns a collection of members associated with a given sub task;
     * 
     * @param {type} workingEventName
     * @returns {aige_model_task_L16.AigeTask.prototype.getWorkingTaskByName.members}
     */
    AigeTask.prototype.getRegisteredSubTaskMembers = function (workingEventName, taskId) {

        return this.getSubTaskById(workingEventName, taskId).members;

    }


    /**
     * Returns a collection of members associated with a given sub task;
     * 
     * @param {type} workingEventName
     * @returns {aige_model_task_L16.AigeTask.prototype.getWorkingTaskByName.members}
     */
    AigeTask.prototype.getUnregisteredSubTaskMembers = function (workingEventName, taskId) {
        var unregisteredMembers = [];
        var registeredMembers = this.getSubTaskById(workingEventName, taskId).members;
        var allMembers = this.getWorkingTaskMembers(workingEventName);

        for (var i = 0; i < allMembers.length; i++) {
            if (!aige.util.containsItem(registeredMembers, allMembers[i])) {
                unregisteredMembers.push(allMembers[i]);
            }
        }
        return unregisteredMembers;

    };
    /**
     * The update of a sub_task within a nested array of a mongo db collection 
     * is not possible for technical reasons (workingTasks.$.member_subtasks );
     * 
     * However it is possible to update the whole nested array: And this can be done by exchanging 
     * the old subtask with the new 'edited' subtask.
     * 
     * @param {type} workingTaskName   the name of the working task
     * @param {type} subTask - the given subtask to be exchanged
     * @returns {Array} of sub tasks
     */
    AigeTask.prototype.exchangeSubTask = function (workingTaskName, subTask) {
        var _workingTask, subTaskList = [];
        _workingTask = this.getWorkingTaskByName(workingTaskName);
        for (var i = 0; i < _workingTask.member_subtasks.length; i++) {
            if (_workingTask.member_subtasks[i].type !== subTask.type) {
                console.log(" push sub task: " + JSON.stringify(_workingTask.member_subtasks[i]));
                subTaskList.push(_workingTask.member_subtasks[i]);
            } else {
                console.log(" DU NICHT: " + JSON.stringify(_workingTask.member_subtasks[i]));
                subTaskList.push(subTask);
            }

        }


        return subTaskList;
    };



    /**
     * The removal of a sub_task within a nested array of a mongo db collection 
     * is not possible for technical reasons (workingTasks.$.member_subtasks );
     * 
     * However it is possible to delete the subtask from the whole nested array.
     * 
     * @param {type} workingTaskName   the name of the working task
     * @param {type} subTask - the given subtask to be exchanged
     * @returns {Array} of sub tasks
     */
    AigeTask.prototype.removeSubTask = function (workingTaskName, subTask) {
        var _workingTask, subTaskList = [];
        _workingTask = this.getWorkingTaskByName(workingTaskName);
        for (var i = 0; i < _workingTask.member_subtasks.length; i++) {
            if (_workingTask.member_subtasks[i].type !== subTask.type) {
                console.log(" push sub task: " + JSON.stringify(_workingTask.member_subtasks[i]));
                subTaskList.push(_workingTask.member_subtasks[i]);
            } else {
                console.log(" DU NICHT: " + JSON.stringify(_workingTask.member_subtasks[i]));

            }

        }


        return subTaskList;
    };







    //------------------- BEGIN PUBLIC METHODS -------------------
    findTasks = function (object_type, searchParams, callback) {
        clearStateMap();
        console.log("find tasks  " + JSON.stringify(searchParams));
        var search_task_promise = stateMap.ajaxCall.search(object_type, searchParams);
        var search_events_promise = stateMap.ajaxCall.search(configMap.objectTypes.event, searchParams);
        $.when(search_task_promise, search_events_promise).then(function (task_list, event_list) {
            if (!aige.util.arrayIsNullOrEmpty(task_list)) {
                console.log("task_list " + JSON.stringify(task_list));
                stateMap.currentTask = new AigeTask(task_list[0]._id, task_list[0].year, task_list[0].workingTasks, null, null, null);
                stateMap.taskList.push(stateMap.currentTask);
                console.log("stateMap.currentTask " + JSON.stringify(stateMap.currentTask));
                stateMap.workingEventList = filterWorkingEvents(stateMap.currentTask.getWorkingEventNames(), event_list);
                console.log("stateMap.workingEventList " + JSON.stringify(stateMap.workingEventList));

            }
            aige.model.clearStateMaps(configMap.objectTypes.task);
            aige.model.fillStateMaps(configMap.objectTypes.task, stateMap.taskList);
            callback(null);
        }).fail(function (error) {
            if (callback) {
                setTimeout(function () {
                    callback(error);
                }, 3000);
            }
        });
    }
    //
    // Begin public method /initializeTasks/
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
    initializeTask = function (object_type, searchParams, subtasks, callback) {
        console.log("initializeTasks ");
        clearStateMap();
        var ms;
        var search_ms_promise = stateMap.ajaxCall.search(configMap.objectTypes.membership, searchParams);
        var search_events_promise = stateMap.ajaxCall.search(configMap.objectTypes.event, searchParams);

        var create_promise;

        $.when(search_ms_promise, search_events_promise).then(function (membership_list, event_list) {
            if (!aige.util.arrayIsNullOrEmpty(membership_list) || !aige.util.arrayIsNullOrEmpty(event_list)) {
                callback(new Error("Keine Mitgliedschaft eingerichtet oder keine Ereignisse vorhanden."));
            }
            ms = membership_list[0];

            stateMap.currentTask = make_task_container(ms, event_list, subtasks);
            stateMap.taskList.push(stateMap.currentTask);
            console.log(" stateMap.currentTask  " + JSON.stringify(stateMap.currentTask));
            create_promise = stateMap.ajaxCall.createItem(object_type, stateMap.currentTask);
            create_promise.done(function (count_inserts) {
                stateMap.count_db_result = count_inserts;
                console.log(" stateMap.count_db_result  " + JSON.stringify(stateMap.count_db_result));
                findTasks(object_type, searchParams, callback);
            }).fail(function (error) {
                setTimeout(function () {
                    callback(error);
                }, 3000);
            });
        }).fail(function (error) {
            if (callback) {
                setTimeout(function () {
                    callback(error);
                }, 3000);
            }
        });
    };
    // End  public method /initializeTasks/

    // Begin public method /insertSubTask/
    /**
     * Inserts a new subtask into an array of subTasks for a given working task (_workingTask within a whole task (_id).
     * 
     * @param {type} object_type
     * @param {type} _id
     *  * @param {type} _year
     * @param {type} _workingTask
     * @param {type} _subtask
     * @param {type} taskCallback
     * @returns {undefined}
     */
    insertSubTask = function (object_type, _id, _year, _workingTask, _subtask_array, callback) {
        console.log("working task=" + _workingTask);
        console.log("id =" + _id);

        console.log("sub task=" + JSON.stringify(_subtask_array));


        var add_subtask = stateMap.ajaxCall.addSubtaskToWorkingtask(object_type, _id, _workingTask, _subtask_array);
        add_subtask.done(function (count_adds) {
            console.log("# added subtask: " + JSON.stringify(count_adds));
            var search = {searchParams: {year: _year}};
            findTasks(object_type, search, callback);
        }).fail(function (error) {
            setTimeout(function () {
                console.log("callback error 1: " + JSON.stringify(error));
                callback(error);
            }, 3000);
        });
    };
    // End  public method /insertSubTask/

    // Begin public method /updateSubTask/
    /**
     * Updates a subtask within an array of subTasks for a given working task (_workingTask) within a whole task (_id).
     * 
     * 
     * @param {type} object_type
     * @param {type} _id
     * @param {type} _workingTask
     * @param {type} _subtask_array
     * @param {type} callback
     * @returns {undefined}
     */
    updateSubTask = function (object_type, _id, _year, _workingTask, _subtask, callback) {
        console.log("update working task=" + _workingTask);
        console.log("id =" + _id);

        console.log("sub task=" + JSON.stringify(_subtask));

        stateMap.currentTask = aige.model.general.getCurrentItem(object_type);
        console.log("current task=" + JSON.stringify(stateMap.currentTask));

        var _subtask_array = stateMap.currentTask.exchangeSubTask(_workingTask, _subtask);

        var add_subtask = stateMap.ajaxCall.updateSubtaskInWorkingtask(object_type, _id, _workingTask, _subtask_array);
        add_subtask.done(function (count_adds) {
            console.log("# added subtask: " + JSON.stringify(count_adds));
            var search = {searchParams: {year: _year}};
            findTasks(object_type, search, callback);
        }).fail(function (error) {
            setTimeout(function () {
                console.log("callback error 1: " + JSON.stringify(error));
                callback(error);
            }, 3000);
        });
    };

    // Begin public method /updateSubTask/
    /**
     * Updates a subtask within an array of subTasks for a given working task (_workingTask) within a whole task (_id).
     * 
     * 
     * @param {type} object_type
     * @param {type} _id
     * @param {type} _workingTask
     * @param {type} _subtask_array
     * @param {type} callback
     * @returns {undefined}
     */
    removeSubTask = function (object_type, _id, _year, _workingTask, _subtask, callback) {
        console.log("update working task=" + _workingTask);
        console.log("id =" + _id);
        console.log("sub task=" + JSON.stringify(_subtask));
        stateMap.currentTask = aige.model.general.getCurrentItem(object_type);
        console.log("current task=" + JSON.stringify(stateMap.currentTask));
        var _subtask_array = stateMap.currentTask.removeSubTask(_workingTask, _subtask);

        var add_subtask = stateMap.ajaxCall.updateSubtaskInWorkingtask(object_type, _id, _workingTask, _subtask_array);
        add_subtask.done(function (count_deletes) {
            console.log("# deleted subtask: " + JSON.stringify(count_deletes));
            var search = {searchParams: {year: _year}};
            findTasks(object_type, search, callback);
        }).fail(function (error) {
            setTimeout(function () {
                console.log("callback error 1: " + JSON.stringify(error));
                callback(error);
            }, 3000);
        });
    };

    // End public method /updateSubTask/

    // Begin public method /getWorkingEvent/
    // Purpose    : Returns event objects of type "Arbeitsdienst" that match to the working_events
    // in the task object;
    // Arguments  : name the given woirking event name

    // Returns    : event object of type "Arbeitsdienst" or null
    // Throws     : none
    //
    getWorkingEvent = function (name) {
        
        for (var i = 0; i < stateMap.workingEventList.length; i++) {
              if (stateMap.workingEventList[i].name===name){
                  return aige.model.event.makeEventObject(stateMap.workingEventList[i]);
              }
        }
        return null;
    }
    // End public method /getWorkingEvent/




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
        initializeTask: initializeTask,
        getWorkingEvent: getWorkingEvent,
        findTasks: findTasks,
        insertSubTask: insertSubTask,
        updateSubTask: updateSubTask,
        removeSubTask: removeSubTask,
        getUnregisteredMembers: get_unregistered_members,
        fetchWorkingEventNames: fetchWorkingEventNames


    };
    //------------------- END PUBLIC METHODS ---------------------
}());

