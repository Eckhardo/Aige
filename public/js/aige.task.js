/*
 * aige.task.js
 * Task feature module, including working services fine-grained.
 *
 *aws bucket: aige-file-upload
 *Access Key ID:
 AKIAI3TXRY2BTPL5NP6A
 Secret Access Key:
 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
 
 */

/*jslint         browser : true, continue : true,
 devel  : true, indent  : 2,    maxerr   : 50,
 newcap : true, nomen   : true, plusplus : true,
 regexp : true, sloppy  : true, vars     : false,
 white  : true
 */

/*global $, aige */

aige.task = (function () {

    //---------------- BEGIN MODULE SCOPE VARIABLES --------------
    var
            configMap = {
                tasks_list_html: String()
                        + '<div id="taskList" class="aige-admin-member-list" style=" heigth:40em; overflow:auto;">'

                        + '<div id="taskGroup" class="buttonCreate">'
                        + '<form id = "taskGroupForm">'
                        + '<label for = "taskGroupYear"> Jahr: </label>'
                        + '<select id="taskGroupYear" name="taskGroupYear">'
                        + '<option>2016</option>'
                        + '<option>2017</option>'
                        + '<option>2018</option>'
                        + '<option>2019</option>'
                        + '</select>'
                        + '<span id="workingEventGroupSpan">'
                        + '<label for = "workingEventGroup"> Arbeitsdienst: </label>'
                        + '<select id="workingEventGroup" name="workingEventGroup">'
                        + '</select></span>'
                        + '</form>'

                        + '<div id="buttonCreateTask" class="buttonCreate">Arbeitsdienst neu anlegen</div>'
                        + '<h3 id="headerTask" style="text-align:center;"></h3>'
                        + '</div>'
                        + '<table id="tblTaskList" class="tblList">'
                        + '<thead><tr><th></th><th></th>'
                        + '<th>Arbeitsdienst</th><th>Details</th><th>Teilnehmer</th><th>Koordinator</th>'
                        + '<th>Startzeit (Flexibel)</th><th>Treffpunkt</th><th>Bemerkungen</th>'

                        + '</tr></thead><tbody></tbody>'
                        + '</table>'
                        + '</div>',
                tasks_form_html: String()
                        + '<div id="taskAddEdit" class="aige-admin-member-add-edit">'
                        + '<h2 id="headerTaskFormPopup" style="text-align:center;"></h2>'
                        + '<form id = "taskForm">'
                        + '<ul>'
                        + '<input type = "hidden" id = "txtTaskID"/ name="id">'
                        + '<li>'
                        + '<label for = "txtWorkingTask"> Ereignis: </label>'
                        + '<input type = "text" id = "txtWorkingTask" name ="workingTask" readonly="readonly" />'
                        + '</li><li>'

                        + '</li>&nbsp;<li>'
                        + '<label for = "txtTaskType"> Arbeitsdienst: </label>'
                        + '<select id="txtTaskType" name="type">'
                        + '</select></li><li>'
                        + '<label for = "txtTaskAddNew">&nbsp; </label>'
                        + ' <input type="text" id = "txtTaskAddNew"  name="addTask" value="">'
                        + '<img src="../css/images/download.png" alt="Save"  id="btnAddTask"  class="btnEdit"/>'
                        + '</li><li>'

                        + '</li>&nbsp;<li>'
                        + '<label for = "txtTaskDetails"> Details: </label>'
                        + '<textarea id = "txtTaskDetails" name="details"'
                        + 'style=" height: 50px; width: 333px;"></textarea >'
                        + '</li><li>'
                        + '<label for = "txtTaskMemberPicklist"> Teilnehmer: </label>'
                        + '<select id="txtTaskMemberPicklist" name="memberPicklist" multiple="multiple">'
                        + '</select>'
                        + '</li><li>'
                        + '<label for = "txtTaskCoordinator"> Koordinator: </label>'
                        + '<select id="txtTaskCoordinator" name="coordinator">'
                        + '</select></li><li>'
                        + '<label for = "txtTaskStartDate"> Startdatum: </label>'
                        + '<input type = "text" id = "txtTaskStartDate"  name="startDate" />'
                        + '</li><li>'
                        + '<label for = "txtTaskStartTime"> Startzeit: </label>'
                        + '<input type = "text" id = "txtTaskStartTime" name="startTime" class="time" />'
                        + '</li><li>'

                        + '<label for = "txtTaskSelforganized"> Ausf. flexibel: </label>'
                        + '<input type = "checkbox" id="txtTaskSelforganized" name="selforganized"/>'
                        + '</li><li>'
                        + '<label for = "txtTaskMeetingPoint"> Treffpunkt: </label>'
                        + '<input type = "text" id = "txtTaskMeetingPoint"name="meetingPoint" />'
                        + '</li><li>'

                        + '<label for = "txtTaskComments"> Anmerkungen: </label>'
                        + '<textarea id = "txtTaskComments" name="comments"'
                        + 'style=" height: 50px;  width: 333px;"></textarea >'
                        + ' </li></ul>'
                        + '<div>'
                        + '<input type = "submit" value = "Speichern" id = "addEditTaskSave">'
                        + '<input id="buttonCloseTask" class="buttonClose" type="button" value="Close Popup" />'
                        + '</div>'
                        + '</form>'
                        + '</div>',
                imageActive: "<img src='../css/images/boxSelected.gif' alt='Aktiv'/>",
                imageInactive: "<img src='../css/images/boxUnselected.gif' alt='Aktiv'/>",
                settable_map: {
                    general_model: true,
                    task_model: true,
                    actionTypes: true
                },
                general_model: null,
                task_model: null,
                object_type: "task",
                actionTypes: null
            },
    stateMap = {
        $shellcontainer: null,
        selectedTaskId: -1,
        subTaskCollection: ["Gräben", "Wasserpflanzen", "Hütte/Geräteschuppen", "Uferbereich/Wasser", "Uferbereich/Land", "Wege/Haider Eck", "Rohrkolbenbereich ", "Stege/Plattformen"],
        workingEventCollection: [],
        coordinatorCollection: [],
        currentTask: null,
        currentWorkingTask: null,
        currentSubTask: null,
        currentMember: null,
        currentYear: null,
        selectedYear: null,
        selectedWorkingEventName: null,
        currentDateTime: null,
        saveIsEdit: true,
        currentAction: "",
        pickedMembers: [],
    },
            jqueryMap = {}, onMemberPicklistChange, listTasks, onMenuTask, onChangeTaskGroup, onChangeWorkingEventGroup, onEditTask, onDeleteTask, onCreateTask, onSaveTask,
            onAddTask, onLoginSuccess, taskCallback, setJqueryMap, configModule, initModule;
    //----------------- END MODULE SCOPE VARIABLES ---------------

    //------------------- BEGIN UTILITY METHODS ------------------
    // Begin Utility method /clearStateMap/
    function clearStateMap() {
        stateMap.currentWorkingTask = null;
        stateMap.currentTask = null;
        stateMap.currentSubTask = null;
        stateMap.selectedWorkingEventName = null;
        stateMap.pickedMembers = [];
    }
// End Utility method /clearStateMap/

// Begin Utility method /addItemsToPicklist/
    function addItemsToPicklist(picklist, items, isRegistered) {

        for (var i = 0; i < items.length; i++) {
            var param = {value: items[i],
                label: items[i],
                selected: isRegistered};
            picklist.pickList("insert", param);
        }
    }
// End Utility method /addItemsToPicklist/

// Start Utility method /closePopup/
    function closePopup() {
        console.log("closePopup");
        jqueryMap.$taskFormValidator.resetForm();
        jqueryMap.$taskFormPopup.fadeOut();
        jqueryMap.$overlay.fadeOut();
    }
// End Utility method /closePopup/
    /**
     * Adds a subtask to the subTaskCollection and fills option list widget with 
     * subtasks as option.
     * @param {type} subtask
     * @returns {undefined}
     */
    function fillSubtaskOptionList(subtask) {

        console.log("fil subtask option list");

        if (subtask) {
            stateMap.subTaskCollection.push(subtask);
        }
        var $textTaskType = jqueryMap.$taskForm.find("#txtTaskType");
        $textTaskType.get(0).options.length = 0;
        $textTaskType.get(0).options[0] = new Option("Wähle Dienst", "-1");
        $.each(stateMap.subTaskCollection, function (index, item) {
            $textTaskType.get(0).options[ index] = new Option(item, item);
        });
        if (subtask) {
            $textTaskType.find('option:last-child').prop('selected', true);
        }
        ;
    }
    /**
     * Adds a subtask to the subTaskCollection and fills option list widget with 
     * subtasks as option.
     * @param {type} workingTask
     * @returns {working task} - sth like Arbeitdienst 1 || Arbeitsdienst 2
     */
    function fillWorkingEventOptionList(workingEventNames, selectedWorkingEventName) {
        stateMap.workingEventCollection = [];

        workingEventNames.forEach(function (item, index) {
            stateMap.workingEventCollection.push(item);
        });

        jqueryMap.$workingEventGroup.get(0).options.length = 0;
        jqueryMap.$workingEventGroup.get(0).options[0] = new Option("Wähle Arbeitsdienst", "-1");
        $.each(stateMap.workingEventCollection, function (index, item) {
            jqueryMap.$workingEventGroup.get(0).options[ index] = new Option(item, item);
        });

        if (selectedWorkingEventName) {
            jqueryMap.$workingEventGroup.val(selectedWorkingEventName);
            stateMap.selectedWorkingEventName = selectedWorkingEventName;
        } else {
            jqueryMap.$workingEventGroup.find('option:first-child').prop('selected', true);
            stateMap.selectedWorkingEventName = jqueryMap.$workingEventGroup.val();
        }
    }

    /**
     * Adds a subtask to the subTaskCollection and fills option list widget with 
     * subtasks as option.
     * @param {type} workingTask
     * @returns {working task} - sth like Arbeitdienst 1 || Arbeitsdienst 2
     */
    function fillCoordinatorOptionList(memberNames) {
        console.log("memberNames: " + JSON.stringify(memberNames));
        stateMap.coordinatorCollection = [];

        memberNames.forEach(function (item, index) {
            stateMap.coordinatorCollection.push(item);
        });

        var $txtTaskCoordinator = jqueryMap.$taskForm.find("#txtTaskCoordinator");
        $txtTaskCoordinator.get(0).options.length = 0;
        $txtTaskCoordinator.get(0).options[0] = new Option("Wähle Koordinator", "-1");
        $.each(stateMap.coordinatorCollection, function (index, item) {
            $txtTaskCoordinator.get(0).options[ index] = new Option(item, item);
        });
        $txtTaskCoordinator.find('option:last-child').prop('selected', true);
        ;
    }


    function validateTaskForm() {

        var validator = $("#taskForm").validate({
            focusCleanup: true,
            rules: {
                type: {required: true},
                details: {required: true},
                startDate: {required: false, germanDate: true},
                startTime: {required: false},
                meetingPoint: {required: true},
            },
            errorClass: "errormessage",
            errorElement: "b",
            errorPlacement: function (error, element) {
                error.insertAfter(element);
            }
        });
        return validator;
    }
    //-------------------- END UTILITY METHODS -------------------

    //--------------------- BEGIN DOM METHODS --------------------
    // Begin DOM method /setJqueryMap/
    setJqueryMap = function () {
        var $container = stateMap.$shellcontainer,
                $menu = $container.find('#cssmenu'),
                $content = $container.find('.aige-shell-main-content'),
                $contentWrapper = $container.find("#contentWrapper");
        $contentWrapper.
                append($(configMap.tasks_list_html)).
                append($(configMap.tasks_form_html));
        var $taskList = $contentWrapper.find('#taskList');
        var $taskGroupForm = $taskList.find('#taskGroupForm');
        var $taskGroupYear = $taskGroupForm.find('#taskGroupYear');
        var $workingEventGroupSpan = $taskGroupForm.find('#workingEventGroupSpan');
        var $workingEventGroup = $taskGroupForm.find('#workingEventGroup');

        var $taskFormPopup = $contentWrapper.find('#taskAddEdit');
        $taskFormPopup.find("#txtTaskStartDate").datepicker(aige.util.getDatepickerOptions());
        $taskFormPopup.find('#txtTaskStartTime').timepicker({'scrollDefault': 'ß7:00', 'timeFormat': 'H:i'});
        var $taskForm = $taskFormPopup.find('#taskForm');
        var $memberPicklist = $taskForm.find("#txtTaskMemberPicklist").pickList({
            "sourceListLabel": "Verfügbar",
            "targetListLabel": "Ausgewählt"
        });
        jqueryMap = {
            $content: $content,
            $contentWrapper: $contentWrapper,
            $taskMenu: $menu.find('#admin_tasks'),
            $overlay: $content.find("#overlay-bg"),
            $taskGroupYear: $taskGroupYear,
            $workingEventGroupSpan: $workingEventGroupSpan,
            $workingEventGroup: $workingEventGroup,
            $taskList: $taskList,
            $taskListTableList: $taskList.find('#tblTaskList tbody'),
            $taskFormPopup: $taskFormPopup,
            $taskForm: $taskForm,
            $memberPicklist: $memberPicklist,
            $taskFormValidator: validateTaskForm()
        };

    };
    // End DOM method /setJqueryMap/


    // Begin DOM method /listTasks/

    listTasks = function () {


        var mySubTask;
        stateMap.currentTask = configMap.general_model.getCurrentItem(configMap.object_type);
        console.log("the current task :" + JSON.stringify(stateMap.currentTask));
        if (!stateMap.currentTask) {
            jqueryMap.$workingEventGroupSpan.hide();
            jqueryMap.$taskList.find("#buttonCreateTask").hide();
            jqueryMap.$taskList.find("#headerTask").text("Keine Arbeitsdienstdaten vorhanden für   " + stateMap.selectedYear);
            jqueryMap.$taskList.fadeIn(1000, "swing");
            return;
        }

        jqueryMap.$taskList.find("#buttonCreateTask").show();
        var workingEventNames = configMap.task_model.fetchWorkingEventNames();
        fillWorkingEventOptionList(workingEventNames, stateMap.selectedWorkingEventName);
        jqueryMap.$taskListTableList.html("");
        jqueryMap.$workingEventGroupSpan.show();
        stateMap.currentWorkingTask = stateMap.currentTask.getWorkingTaskByName(stateMap.selectedWorkingEventName);

        if (aige.util.arrayIsNullOrEmpty(stateMap.currentWorkingTask.member_subtasks)) {
            jqueryMap.$taskList.find("#headerTask").text("Bisher wurde kein Arbeitsdienst angelegt für   " + stateMap.selectedYear);
            jqueryMap.$taskList.fadeIn(1000, "swing");
            return;
        }
        for (var i = 0; i < stateMap.currentWorkingTask.member_subtasks.length; i++) {
            mySubTask = stateMap.currentWorkingTask.member_subtasks[i];
            console.log(" current sub task :" + JSON.stringify(mySubTask));


            jqueryMap.$taskListTableList.append("<tr>" + "<td><img src='../css/images/edit.png' alt='Edit" + i
                    + "' id='btnEditTask'  class='btnEdit'/></td><td><img src='../css/images/dustbin.png' alt='Delete"
                    + i + "'  id='btnDeleteTask'  class='btnDelete'/></td><td>"

                    + mySubTask.type + "</td><td>"
                    + mySubTask.details + "</td><td>"
                    + mySubTask.members + "</td><td>"
                    + mySubTask.coordinator + "</td><td>"
                    + mySubTask.startDate + ","
                    + mySubTask.startTime + " &nbsp; "
                    + (mySubTask.selforganized ? configMap.imageActive : configMap.imageInactive)
                    + " </td><td>"
                    + mySubTask.meetingPoint + "</td><td>"
                    + mySubTask.comments + "</td>"
                    + "</tr>");
        }
        var workingEvent = configMap.task_model.getWorkingEvent(stateMap.selectedWorkingEventName);
        jqueryMap.$taskList.find("#headerTask").text("Liste der Einzelarbeitsdienste für: " + workingEvent.displayName());
        jqueryMap.$taskList.fadeIn(1000, "swing");
    }


    // End DOM method /listTasks/
    //---------------------- END DOM METHODS ---------------------

    //------------------- BEGIN EVENT HANDLERS -------------------
    // Begin event handler /onMenuHome/
    onMenuTask = function (event) {
        console.log("on menu task")
        stateMap.currentAction = configMap.actionTypes.list;
        clearStateMap();
        jqueryMap.$taskGroupYear.fadeIn();
        jqueryMap.$contentWrapper.children().hide();
        fillSubtaskOptionList();
        stateMap.currentYear = new Date().getFullYear().toString();
        stateMap.selectedYear = stateMap.currentYear;
        stateMap.currentAction = configMap.actionTypes.list;
        jqueryMap.$overlay.fadeIn();

        jqueryMap.$taskGroupYear.val(stateMap.currentYear);
        var searchParams = {searchParams: {year: stateMap.currentYear}};

        configMap.task_model.findTasks(configMap.object_type, searchParams, function (error) {
            if (error) {
                aige.util.messageConfirm($("<span>Fehler bei der Arbeitsdienstsuche" + JSON.stringify(error) + "</span>"));
                return false;
            }
            stateMap.currentTask = configMap.general_model.getCurrentItem(configMap.object_type);
            console.log("current Task=" + JSON.stringify(stateMap.currentTask));
            if (!stateMap.currentTask) {
                stateMap.currentAction = configMap.actionTypes.initialize;
                aige.util.messageConfirm($("<span>Keine Einträge vorhanden.... Bitte einen Moment gedulden ... die Grundstruktur für Arbeitsdienste wird aufgebaut</span>"));
                setTimeout(function () {
                    configMap.task_model.initializeTask(configMap.object_type, searchParams, stateMap.subTaskCollection, taskCallback);

                }, 3000);
            } else {
                taskCallback();
            }
            event.preventDefault();
            return false;
        });

    };
    // End event handler /onMenuHome/   


    // Begin event handler /onLoginSuccess/  
    /**
     * 
     * @param {type} event
     * @param {type} login_user
     * @returns {Boolean}
     */
    onLoginSuccess = function (event, login_user) {
        stateMap.currentMember = login_user;
        return false;
    }
    // End event handler /onLoginSuccess/   

    // Begin event handler /onAddTask/  
    /**
     *  adds a hand-written sub task to the subtask option list
     * @param {type} event
     * @returns {undefined}
     */
    onAddTask = function (event) {
        var $subtask = jqueryMap.$taskForm.find('#txtTaskAddNew');
        fillSubtaskOptionList($subtask.val());
        $subtask.val("");
        return false;
    };
    // End event handler /onAddTask/   



    // Begin event handler /onCreateTask/  
    onCreateTask = function (event) {
        var workingTaskMembers;

        stateMap.currentAction = configMap.actionTypes.create;
        stateMap.saveIsEdit = false;
        jqueryMap.$taskFormValidator.resetForm();
        jqueryMap.$taskForm[0].reset();
        stateMap.pickedMembers = [];
        jqueryMap.$taskFormPopup.find("#headerTaskFormPopup").text("Neuen Arbeitsdienst anlegen");

        jqueryMap.$taskForm.find("#txtWorkingTask").val(stateMap.selectedWorkingEventName);
        jqueryMap.$taskForm.find("#txtTaskType").children().prop("disabled", false);
        jqueryMap.$taskForm.find("#txtTaskAddNew").show().val("Neuen Diensttyp anlegen");
        jqueryMap.$taskForm.find("#btnAddTask").hide();
        jqueryMap.$taskGroupYear.val(stateMap.selectedYear);
        jqueryMap.$taskFormPopup.find('.pickList_sourceList li').remove();
        jqueryMap.$taskFormPopup.find('.pickList_targetList li').remove();
        jqueryMap.$taskFormPopup.find('.pickList_targetList,.pickList_sourceList').css("background-color", "#fff");

        workingTaskMembers = stateMap.currentTask.getWorkingTaskMembers(stateMap.selectedWorkingEventName);
        aige.util.updatePopup(jqueryMap.$taskFormPopup);
        jqueryMap.$taskFormPopup.fadeIn();
        jqueryMap.$overlay.fadeIn();

        setTimeout(function () {
            addItemsToPicklist(jqueryMap.$memberPicklist, workingTaskMembers, false);
            fillCoordinatorOptionList(workingTaskMembers);

        }, 1000);





        return false;
    };
    // End event handler /onCreateTask/  


    // Begin event handler /onSaveTask/  
    /**
     * 
     * @param {type} event
     * @returns {Boolean}
     */
    onSaveTask = function (event) {

        var _id, _workingTask, _year, _subtask, sub_task_list = [];
        if (stateMap.currentMember.isAdmin) {
            if (!$(this).valid()) {
                return false;
            }
            _id = stateMap.currentTask._id;
            _year = stateMap.selectedYear;
            _workingTask = $(this).find('#txtWorkingTask').val();
            _subtask = {
                type: $(this).find('#txtTaskType').val(),
                details: $(this).find('#txtTaskDetails').val(),
                members: stateMap.pickedMembers,
                coordinator: $(this).find('#txtTaskCoordinator').val(),
                startDate: $(this).find('#txtTaskStartDate').val(),
                startTime: $(this).find('#txtTaskStartTime').val(),
                meetingPoint: $(this).find('#txtTaskMeetingPoint').val(),
                selforganized: $(this).find('#txtTaskSelforganized').is(":checked"),
                comments: $(this).find('#txtTaskComments').val()
            };



            stateMap.saveIsEdit ?
                    configMap.task_model.updateSubTask(configMap.object_type, _id, _year, _workingTask, _subtask, taskCallback)
                    :
                    sub_task_list.push(_subtask);
            configMap.task_model.insertSubTask(configMap.object_type, _id, _year, _workingTask, sub_task_list, taskCallback);
            jqueryMap.$taskFormPopup.fadeOut();

            event.preventDefault();
        } else {
            var $message = $("<span> Du hast keine Berechtigung</span>");
            aige.util.messageConfirm($message);
        }
    };
    // End event handler /onSaveTask/  



    // Begin event handler /onDeleteTask/  

    onDeleteTask = function (event) {
        var _id, _workingTask, _year, _subtask;
        if (stateMap.currentMember.isAdmin) {
            _id = stateMap.currentTask._id;
            _year = stateMap.selectedYear;
            _workingTask = stateMap.selectedWorkingEventName;
            stateMap.currentAction = configMap.actionTypes.delete;
            stateMap.selectedTaskId = $(this).attr("alt").replace("Delete", "");
            stateMap.currentSubTask = stateMap.currentTask.getSubTaskById(stateMap.selectedWorkingEventName, stateMap.selectedTaskId);
            console.log(" stateMap.currentSubTask: " + JSON.stringify(stateMap.currentSubTask));

            if (!confirm("Willst Du wirklich [" + stateMap.currentSubTask.type + "] löschen?")) {
                return false;
            }
            configMap.task_model.removeSubTask(configMap.object_type, _id, _year, _workingTask, stateMap.currentSubTask, taskCallback)
            event.preventDefault();
        } else {
            var $message = $("<span> Du hast keine Berechtigung</span>")
            aige.util.messageConfirm($message);
        }
        return false;

    };
    // End event handler /onDeleteTask/  


    // Begin event handler /onEditTask/  
    /**
     * 
     * @param {type} event
     * @returns {Boolean}
     */
    onEditTask = function (event) {
        var inactiveMembers, activeMembers, workingTaskMembers;
        stateMap.currentAction = configMap.actionTypes.update;
        stateMap.pickedMembers = [];
        stateMap.saveIsEdit = true;
        stateMap.selectedTaskId = $(this).attr("alt").replace("Edit", "");
        stateMap.currentSubTask = stateMap.currentTask.getSubTaskById(stateMap.selectedWorkingEventName, stateMap.selectedTaskId);
        inactiveMembers = stateMap.currentTask.getUnregisteredSubTaskMembers(stateMap.selectedWorkingEventName, stateMap.selectedTaskId);
        activeMembers = stateMap.currentTask.getRegisteredSubTaskMembers(stateMap.selectedWorkingEventName, stateMap.selectedTaskId);
        workingTaskMembers = stateMap.currentTask.getWorkingTaskMembers(stateMap.selectedWorkingEventName);

        console.log(" inactiveMembers: " + JSON.stringify(inactiveMembers));
        console.log(" activeMembers: " + JSON.stringify(activeMembers));


        jqueryMap.$taskForm.find("#txtTaskID").val(stateMap.selectedTaskId);
        jqueryMap.$taskForm.find("#txtWorkingTask").val(stateMap.currentWorkingTask.name);
        fillSubtaskOptionList(null);
        jqueryMap.$taskForm.find("#txtTaskType").val(stateMap.currentSubTask.type);
        jqueryMap.$taskForm.find("#txtTaskType  option:not(:selected)").prop("disabled", true);
        jqueryMap.$taskForm.find("#txtTaskAddNew").hide();
        jqueryMap.$taskForm.find("#btnAddTask").hide();
        jqueryMap.$taskForm.find("#txtTaskDetails").val(stateMap.currentSubTask.details);
        fillCoordinatorOptionList(workingTaskMembers);
        jqueryMap.$taskForm.find("#txtTaskCoordinator").val(stateMap.currentSubTask.coordinator);
        jqueryMap.$taskForm.find("#txtTaskStartDate").val(stateMap.currentSubTask.startDate);
        jqueryMap.$taskForm.find("#txtTaskStartTime").val(stateMap.currentSubTask.startTime);
        jqueryMap.$taskForm.find("#txtTaskMeetingPoint").val(stateMap.currentSubTask.meetingPoint);

        jqueryMap.$taskForm.find("#txtTaskSelforganized").prop("checked", stateMap.currentSubTask.selforganized);
        jqueryMap.$taskForm.find("#txtTaskComments").val(stateMap.currentSubTask.comments);
        jqueryMap.$taskFormPopup.find('.pickList_sourceList li').remove();
        jqueryMap.$taskFormPopup.find('.pickList_targetList li').remove();
        jqueryMap.$taskFormPopup.find('.pickList_targetList,.pickList_sourceList').css("background-color", "#fff");


        aige.util.updatePopup(jqueryMap.$taskFormPopup);
        jqueryMap.$taskFormPopup.fadeIn();
        jqueryMap.$overlay.fadeIn();

        setTimeout(function () {
            addItemsToPicklist(jqueryMap.$memberPicklist, inactiveMembers, false);
            addItemsToPicklist(jqueryMap.$memberPicklist, activeMembers, true);

        }, 1000);
        aige.util.updatePopup(jqueryMap.$taskFormPopup);
        event.preventDefault();
        return false;

    };
    // End event handler /onEditTask/  

    // Begin event handler /onChangeTaskGroup/  
    /**
     * Is fired if option list with years as options repersenting an event group is changed.
     * 
     * @param {type} event
     * @returns {false}
     */
    onChangeTaskGroup = function (event) {
        jqueryMap.$taskListTableList.html("");
        clearStateMap();
        stateMap.currentAction = configMap.actionTypes.list;
        stateMap.selectedYear = jqueryMap.$taskGroupYear.val();
        console.log("selected year: " + JSON.stringify(stateMap.selectedYear));
        var searchParams = {searchParams: {year: stateMap.selectedYear}};
          jqueryMap.$overlay.fadeIn();
        configMap.task_model.findTasks(configMap.object_type, searchParams, taskCallback);
        event.preventDefault();
        return false;
    };
    // End event handler /onChangeTaskGroup/  


    // Begin event handler /onChangeWorkingEventGroup/  
    /**
     * Is fired if option list with working events as options representing an event group is changed.
     * 
     * @param {type} event
     * @returns {false}
     */

    onChangeWorkingEventGroup = function (event) {
        jqueryMap.$taskListTableList.html("");

        stateMap.currentWorkingTask = null;
        stateMap.selectedWorkingEventName = null;
        stateMap.currentAction = configMap.actionTypes.list;
        stateMap.currentAction = configMap.actionTypes.list;
        stateMap.selectedWorkingEventName = jqueryMap.$workingEventGroup.val();
        console.log("selected event: " + JSON.stringify(stateMap.selectedWorkingEventName));
        listTasks();
        aige.util.messageConfirm($("<span>" + stateMap.selectedWorkingEventName + " ausgewählt.</span>"));
        event.preventDefault();
        return false;
    };


    // End event handler /onChangeWorkingEventGroup/  


    // Begin event handler /onMemberPicklistChange/  
    /**
     * Is fired if picklist entries are moved..
     * 
     * @param {type} event
     * @returns {false}
     */
    onMemberPicklistChange = function (event) {

        stateMap.pickedMembers = [];
        var items = jqueryMap.$memberPicklist.closest("li").find('.pickList_targetList').children('li');
        items.each(function () {
            stateMap.pickedMembers.push($(this).data('value'));
        });
        //    console.log(event.type.replace("picklist_", "") + " [" + obj.type + ": " + stateMap.selectedMembers.join(", ") + "]");
    };


    //-------------------- END EVENT HANDLERS --------------------




    //------------------- BEGIN CALLBACK METHODS -------------------

    taskCallback = function (error) {

        var $message;
        switch (stateMap.currentAction) {
            case configMap.actionTypes.initialize:
                $message = error ?
                        $("<span>Der Aufbau der Grundstruktur für Arbeitsdienste war nicht erfolgreich " + JSON.stringify(error) + " </span>") : $("<span>Das Ergebnis der Aufbau der Grundstruktur für Arbeitsdienste:</span>");
                break;
            case configMap.actionTypes.list:
                $message = error ?
                        $("<span>Die Suche  war nicht erfolgreich</span>") : $("<span>Das Ergebnis der Arbeitsdienstsuche:</span>");
                break;
            case configMap.actionTypes.create:
                $message = error ?
                        $("<span>Die 'Neuanlage' war nicht erfolgreich</span>") : $("<span> Es wurde ein neuer Arbeitsdienst gespeichert.</span>");
                break;
            case configMap.actionTypes.update:
                $message = error ?
                        $("<span>Die  'Aendernung' war nicht erfolgreich</span>") : $("<span> Die Aenderung wurde gespeichert.</span>");
                break;
            case configMap.actionTypes.delete:
                $message = error ?
                        $("<span>Die Transaktion 'Entfernen' war nicht erfolgreich</span>") : $("<span> Der Arbeitsdienst wurde gelöscht.</span>");
                break;
        }
        error ?
                aige.util.messageError($message) :
                aige.util.messageConfirm($message);
        jqueryMap.$overlay.fadeOut();
        listTasks();
    };

    //-------------------- END CALLBACK METHODS --------------------

    //------------------- BEGIN PUBLIC METHODS -------------------
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
    // Purpose    : Initializes module
    // Arguments  :
    //  * $container the jquery element used by this feature
    // Returns    : true
    // Throws     : none
    //
    initModule = function ($container) {
        stateMap.$shellcontainer = $container;
        setJqueryMap();
        jqueryMap.$taskMenu.on('click', onMenuTask);

        jqueryMap.$taskGroupYear.on("change", onChangeTaskGroup);
        jqueryMap.$workingEventGroup.on("change", onChangeWorkingEventGroup);
        jqueryMap.$taskList.on("click", "#btnDeleteTask", onDeleteTask);
        jqueryMap.$taskList.on("click", "#btnEditTask", onEditTask);
        stateMap.saveIsEdit = false;

        jqueryMap.$taskList.on("click", "#buttonCreateTask", onCreateTask);
        jqueryMap.$taskForm.on('submit', onSaveTask);
        jqueryMap.$taskForm.on("click", "#btnAddTask", onAddTask);
        jqueryMap.$taskForm.on("focus", "#txtTaskAddNew", function () {
            jqueryMap.$taskForm.find("#btnAddTask").fadeIn(1000, "swing");
            jqueryMap.$taskForm.find("#txtTaskAddNew").val("");
        });
        jqueryMap.$memberPicklist.bind("picklist_onchange", onMemberPicklistChange);
        jqueryMap.$taskForm.on("click", "#buttonCloseTask", closePopup);
        jqueryMap.$contentWrapper.on("click", "#overlay-bg", closePopup);
        $.gevent.subscribe(jqueryMap.$contentWrapper, 'login-success', onLoginSuccess);
        $(window).resize(aige.util.updatePopup(jqueryMap.$taskFormPopup));
        jQuery.validator.addMethod(
                "germanDate",
                function (value, element) {
                    return value.match(/^\d\d\.\d\d\.\d\d\d\d$/);
                },
                "Bitte gebe das Datum im Format TT.MM.JJJJ an."
                );
        return true;
    };
    // End public method /initModule/

    // return public methods
    return {
        configModule: configModule,
        initModule: initModule
    };
    //------------------- END PUBLIC METHODS ---------------------
}());
