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
                        + '<div id="taskList" class="aige-admin-member-list">'
                        + '<div id="taskGroup" class="buttonCreate">'
                        + '<form id = "taskGroupForm">'
                        + '<input type = "hidden" id = "txtTaskGroupID"/>'
                        + '<label for = "txtTaskGroupYear"> Jahr: </label>'
                        + '<select id="txtTaskGroupYear" name="taskGroupYear">'
                        + '<option>2016</option>'
                        + '<option>2017</option>'
                        + '<option>2018</option>'
                        + '<option>2019</option>'
                        + '</select>'
                        + '</form>'
                        + '</div>'
                        + '<div id="buttonCreateTask" class="buttonCreate">Arbeitsdienst neu anlegen</div>'
                        + '<h3 id="headerTask" style="text-align:center;"></h3>'
                        + '<table id="tblTaskList" class="tblList">'
                        + '<thead><tr><th></th><th></th>'
                        + '<th>Jahr</th><th>Dienst</th><th>Tätigkeiten</th><th>Koordinator</th>'
                        + '<th>Datum</th><th>Uhrzeit</th><th>Treffpunkt</th><th>Ausführung flexibel</th><th>Bemerkungen</th>'

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
                        + '<label for = "txtTaskYear"> Jahr: </label>'
                        + '<input type = "text" id = "txtTaskYear" name ="year" readonly="readonly" />'
                        + '</li><li>'

                        + '</li>&nbsp;<li>'
                        + '<label for = "txtTaskType"> Dienst: </label>'
                        + '<select id="txtTaskType" name="type">'
                        + '</select></li><li>'
                        + '<label for = "txtTaskAddNew"> Neue Eintrag: </label>'
                        + ' <input type="text" id = "txtTaskAddNew"  name="addTask" value="">'
                        + '<img src="../css/images/download.png" alt="Save"  id="btnAddTask"  class="btnEdit"/>'
                        + '</li><li>'

                        + '</li>&nbsp;<li>'
                        + '<label for = "txtTaskDetails"> Tätigkeiten: </label>'
                        + '<textarea id = "txtTaskDetails" name="details"'
                        + 'style=" height: 100px;"></textarea >'
                        + '</li><li>'
                        + '<label for = "txtTaskCoordinator"> Koordinator: </label>'
                        + '<input type = "text" id="txtTaskCoordinator" name="coordinator">'
                        + '</li><li>'
                        + '<label for = "txtTaskStartDate"> Datum: </label>'
                        + '<input type = "text" id = "txtTaskStartDate"  name="startDate" />'
                        + '</li><li>'
                        + '<label for = "txtTaskStartTime"> Startzeit: </label>'
                        + '<input type = "text" id = "txtTaskStartTime" name="startTime" class="time" />'
                        + '</li><li>'
                        + '<label for = "txtTaskMeetingPoint"> Treffpunkt: </label>'
                        + '<input type = "text" id = "txtTaskMeetingPoint"name="meetingPoint" />'
                        + '</li><li>'

                        + '<label for = "txtTaskSelforganized"> Ausf. flexibel: </label>'
                        + '<input type = "checkbox" id="txtTaskSelforganized" name="selforganized"/>'
                        + '</li><li>'
                        + '<label for = "txtTaskComments"> Anmerkungen: </label>'
                        + '<textarea id = "txtTaskComments" name="comments"'
                        + 'style=" height: 100px;"></textarea >'
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
        taskCollection: ["Gräben", "Wasserpflanzen", "Hütte/Geräteschuppen", "Uferbereich/Wasser", "Uferbereich/Land", "Wege/Haider Eck", "Rohrkolbenbereich ", "Stege/Plattformen"],
        currentTask: null,
        currentMember: null,
        currentYear: null,
        selectedYear: null,
        currentDateTime: null,
        saveIsEdit: true,
        currentAction: ""
    },
    jqueryMap = {}, listTasks, onMenuTask, onChangeTaskGroup, onEditTask, onDeleteTask, onCreateTask, onSaveTask,
            onAddTask, onLoginSuccess, taskCallback, setJqueryMap, configModule, initModule;
    //----------------- END MODULE SCOPE VARIABLES ---------------

    //------------------- BEGIN UTILITY METHODS ------------------
    function closePopup() {
        console.log("closePopup");
        jqueryMap.$taskFormValidator.resetForm();
        jqueryMap.$taskFormPopup.fadeOut();
        jqueryMap.$overlay.fadeOut();
    }

    function fillOptionList(task) {

        if (task) {
            stateMap.taskCollection.push(task);
        }
        jqueryMap.$taskForm.find("#txtTaskType").get(0).options.length = 0;
        jqueryMap.$taskForm.find("#txtTaskType").get(0).options[0] = new Option("Wähle Dienst", "-1");
        $.each(stateMap.taskCollection, function (index, item) {
            jqueryMap.$taskForm.find("#txtTaskType").get(0).options[ index] = new Option(item, item);
        });
        jqueryMap.$taskForm.find('#txtTaskType option:last-child').prop('selected', true);
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
        var $taskGroup = $contentWrapper.find('#taskGroup');
        var $taskList = $contentWrapper.find('#taskList');
        var $taskFormPopup = $contentWrapper.find('#taskAddEdit');
        $taskFormPopup.find("#txtTaskStartDate").datepicker(aige.util.getDatepickerOptions());
        $taskFormPopup.find('#txtTaskStartTime').timepicker({'scrollDefault': 'ß7:00', 'timeFormat': 'H:i'});
        var $taskForm = $taskFormPopup.find('#taskForm');

        jqueryMap = {
            $content: $content,
            $contentWrapper: $contentWrapper,
            $taskMenu: $menu.find('#admin_tasks'),
            $overlay: $content.find("#overlay-bg"),
            $taskGroup: $taskGroup,
            $taskList: $taskList,
            $taskListTableList: $taskList.find('#tblTaskList tbody'),
            $taskFormPopup: $taskFormPopup,
            $taskForm: $taskForm,
            $taskFormValidator: validateTaskForm()
        };
        fillOptionList();
    };
    // End DOM method /setJqueryMap/


    // Begin DOM method /listTasks/

    listTasks = function () {
        console.log(" list tasks");
        var myWorkingTask, mySubTask, workingTasksLength;
        jqueryMap.$taskListTableList.html("");


        stateMap.currentTask = configMap.general_model.getCurrentItem(configMap.object_type);
        if (stateMap.currentTask) {
            workingTasksLength = stateMap.currentTask.workingTasks.length;

            for (var i = 0; i < workingTasksLength; i++) {

                myWorkingTask = stateMap.currentTask.workingTasks[i];
  console.log(" myWorkingTask" + JSON.stringify(myWorkingTask));
                for (var i = 0; i < myWorkingTask.member_subtasks.length; i++) {


                    jqueryMap.$taskListTableList.append("<tr>" + "<td><img src='../css/images/edit.png' alt='Edit" + mySubTask.type
                            + "' id='btnEditTask'  class='btnEdit'/></td><td><img src='../css/images/dustbin.png' alt='Delete"
                            + mySubTask.type + "'  id='btnDeleteTask'  class='btnDelete'/></td><td>"
                            + mySubTask.year + "</td><td>"
                            + mySubTask.type + "</td><td>"
                            + mySubTask.details + "</td><td>"
                            + mySubTask.coordinator + "</td><td>"
                            + mySubTask.startDate + "</td><td>"
                            + mySubTask.startTime + "</td><td>"

                            + mySubTask.meetingPoint + "</td><td>"
                            + (mySubTask.selforganized ? configMap.imageActive : configMap.imageInactive)
                            + "</td><td>"
                            + mySubTask.comments + "</td>"
                            + "</tr>");
                }
            }
        }

        jqueryMap.$taskList.fadeIn(1000, "swing");
    }


    // End DOM method /listTasks/
    //---------------------- END DOM METHODS ---------------------

    //------------------- BEGIN EVENT HANDLERS -------------------
    // Begin event handler /onMenuHome/
    onMenuTask = function (event) {
        console.log("on menu task");

        stateMap.currentYear = new Date().getFullYear().toString();
        stateMap.selectedYear = stateMap.currentYear;
        stateMap.currentAction = configMap.actionTypes.list;
        jqueryMap.$contentWrapper.children().hide();
        jqueryMap.$taskGroup.fadeIn();
        $("#txtTaskGroupYear").val(stateMap.currentYear);
        var searchParams = {searchParams: {year: stateMap.currentYear}};

        configMap.task_model.findTasks(configMap.object_type, searchParams, function (error) {
            if (error) {
                aige.util.messageConfirm($("<span>Fehler bei der Arbeitsdienstsuche" + JSON.stringify(error) + "</span>"));
                return false;
            }
            stateMap.taskList = configMap.general_model.getCurrentItem(configMap.object_type);
            if (aige.util.arrayIsNullOrEmpty(stateMap.taskList)) {
                aige.util.messageConfirm($("<span>Keine Einträge vorhanden.... Bitte einen Moment gedulden ... Struktur wird aufgebaut</span>"));
                configMap.task_model.initialize_tasks(configMap.object_type, searchParams, stateMap.taskCollection, taskCallback);
            } else {
                taskCallback();
            }
            event.preventDefault();
            return false;
        });

    };
    // End event handler /onMenuHome/   


    // Begin event handler /onLoginSuccess/  
    onLoginSuccess = function (event, login_user) {
        stateMap.currentMember = login_user;

        return false;

    }
    // End event handler /onLoginSuccess/   


    // Begin event handler /onAddTask/  
    onAddTask = function (event) {
        var task = jqueryMap.$taskForm.find('#txtTaskAddNew').val();
        console.log("task: " + task);

        console.log(JSON.stringify(stateMap.taskCollection));
        fillOptionList(task);
        jqueryMap.$taskForm.find('#txtTaskAddNew').val("");
    }
    // End event handler /onAddTask/   


    // Begin event handler /onCreateTask/  
    onCreateTask = function (event) {
        if (stateMap.currentMember.isAdmin) {
            stateMap.currentAction = configMap.actionTypes.create;
            stateMap.saveIsEdit = false;
            jqueryMap.$taskFormValidator.resetForm();
            jqueryMap.$taskForm[0].reset();
            jqueryMap.$taskFormPopup.find("#headerTaskFormPopup").text("Neuen Arbeitsdienst anlegen");
            jqueryMap.$taskFormPopup.fadeIn();


            jqueryMap.$taskForm.find("#txtTaskType").children().prop("disabled", false);
            jqueryMap.$taskForm.find("#txtTaskYear").val($('#txtTaskGroupYear').val());
            jqueryMap.$overlay.fadeIn();
            aige.util.updatePopup(jqueryMap.$taskFormPopup);
        } else {
            var $message = $("<span> Du hast keine Berechtigung</span>")
            aige.util.messageConfirm($message);
        }
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

        var taskMap, formParams,
                searchParams = {searchParams: {year: stateMap.selectedYear}};

        if (!$(this).valid()) {
            return false;
        }

        taskMap = {
            _id: $(this).find('#txtTaskID').val(),
            year: stateMap.selectedYear,
            type: $(this).find('#txtTaskType').val(),
            details: $(this).find('#txtTaskDetails').val(),
            coordinator: $(this).find('#txtTaskCoordinator').val(),
            startDate: $(this).find('#txtTaskStartDate').val(),
            startTime: $(this).find('#txtTaskStartTime').val(),
            meetingPoint: $(this).find('#txtTaskMeetingPoint').val(),
            selforganized: $(this).find('#txtTaskSelforganized').is(":checked"),
            comments: $(this).find('#txtTaskComments').val()
        };
        formParams = aige.util.getFormData($(this));
        console.log("formParams2=" + JSON.stringify(formParams));
        console.log("formParams2=" + JSON.stringify(taskMap));

        stateMap.saveIsEdit ?
                configMap.general_model.updateItem(configMap.object_type, taskMap, taskCallback, searchParams) :
                configMap.general_model.createItem(configMap.object_type, taskMap, taskCallback, searchParams);
        jqueryMap.$taskFormPopup.fadeOut();
        jqueryMap.$overlay.fadeOut();
        event.preventDefault();
    };
    // End event handler /onSaveTask/  



    // Begin event handler /onDeleteTask/  

    onDeleteTask = function (event) {
        if (stateMap.currentMember.isAdmin) {
            var searchParams = {searchParams: {year: stateMap.selectedYear}};
            stateMap.currentAction = configMap.actionTypes.delete;
            stateMap.selectedTaskId = $(this).attr("alt").replace("Delete", "");
            stateMap.currentTask = configMap.general_model.getById(configMap.object_type, stateMap.selectedTaskId);
            console.log(" stateMap.currentTask: " + JSON.stringify(stateMap.currentTask));

            if (!confirm("Willst Du wirklich [" + stateMap.currentTask.shortTask + "] löschen?")) {
                return false;
            }
            configMap.general_model.deleteItem(configMap.object_type, stateMap.currentTask._id, taskCallback, searchParams);
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
        if (stateMap.currentMember.isAdmin) {
            stateMap.currentAction = configMap.actionTypes.update;
            stateMap.saveIsEdit = true;
            stateMap.selectedTaskId = $(this).attr("alt").replace("Edit", "");
            stateMap.currentTask = configMap.general_model.getById(configMap.object_type, stateMap.selectedTaskId);
            console.log(" stateMap.currentTask: " + JSON.stringify(stateMap.currentTask));

            jqueryMap.$taskForm.find("#txtTaskID").val(stateMap.currentTask._id);
            jqueryMap.$taskForm.find("#txtTaskYear").val(stateMap.currentTask.year);
            jqueryMap.$taskForm.find("#txtTaskType  option:not(:selected)").prop("disabled", true);
            jqueryMap.$taskForm.find("#txtTaskDetails").val(stateMap.currentTask.details).focus();
            jqueryMap.$taskForm.find("#txtTaskCoordinator").val(stateMap.currentTask.coordinator);
            jqueryMap.$taskForm.find("#txtTaskStartDate").val(stateMap.currentTask.startDate);
            jqueryMap.$taskForm.find("#txtTaskStartTime").val(stateMap.currentTask.startTime);
            jqueryMap.$taskForm.find("#txtTaskMeetingPoint").val(stateMap.currentTask.meetingPoint);

            jqueryMap.$taskForm.find("#txtTaskSelforganized").prop("checked", stateMap.currentTask.selforganized);
            jqueryMap.$taskForm.find("#txtTaskComments").val(stateMap.currentTask.comments);
            jqueryMap.$overlay.fadeIn();
            jqueryMap.$taskFormPopup.fadeIn();

            aige.util.updatePopup(jqueryMap.$taskFormPopup);
            event.preventDefault();
        } else {
            var $message = $("<span> Es ist nur erlaubt, eigene Nachrichten zu ändern.</span>")
            aige.util.messageConfirm($message);
        }
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
        stateMap.currentAction = configMap.actionTypes.list;
        stateMap.selectedYear = $('#txtTaskGroupYear').val();
        var searchParams = {searchParams: {year: stateMap.selectedYear}};
        configMap.general_model.search(configMap.object_type, searchParams, taskCallback);
        event.preventDefault();
        return false;
    };
    // End event handler /onChangeTaskGroup/  
    //-------------------- END EVENT HANDLERS --------------------




    //------------------- BEGIN CALLBACK METHODS -------------------

    taskCallback = function (error) {
        var $message;
        switch (stateMap.currentAction) {
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

        jqueryMap.$taskGroup.on("change", "#txtTaskGroupYear", onChangeTaskGroup);
        jqueryMap.$taskList.on("click", "#btnDeleteTask", onDeleteTask);
        jqueryMap.$taskList.on("click", "#btnEditTask", onEditTask);

        jqueryMap.$taskList.on("click", "#buttonCreateTask", onCreateTask);
        jqueryMap.$taskForm.on('submit', onSaveTask);
        jqueryMap.$taskForm.on("click", "#btnAddTask", onAddTask);
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
