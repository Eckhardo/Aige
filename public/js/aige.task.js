/*
 * aige.task.js
 * Task feature module, including working services fine-grained.
 *
 
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
                        + '<div id="buttonCreateTask" class="buttonCreate"> Neu anlegen</div>'
                        + '<h3 id="headerTask" style="text-align:center;"></h3>'
                        + '<table id="tblTaskList" class="tblList">'
                        + '<thead><tr><th></th><th></th>'
                        + '<th>Von:</th><th>Betreff:</th><th>Datum</th><th>Nachricht</th>'

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
                        + '<label for = "txtTaskSender"> Von: </label>'
                        + '<input type = "text" id = "txtTaskSender" name ="sender" readonly="readonly" />'
                        + '</li><li>'
                        + '<label for = "txtTaskShort"> Betreff: </label>'
                        + '<input type = "text" id="txtTaskShort" name="taskShort">'
                        + '</li><li>'
                        + '<label for = "txtTaskDateTime"> Datum: </label>'
                        + '<input type = "text" id = "txtTaskDateTime" name="dateTime" readonly="readonly"/>'
                        + '</li><li>'
                        + '<label for = "txtTaskLong"> Nachricht: </label>'
                        + '<textarea id = "txtTaskLong" name="task"'
                        + 'style=" width: 573px; height: 177px;"></textarea >'
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
                    task_model:true,
                    actionTypes: true
                },
                general_model: null,
                task_model:null,
                object_type: "task",
                actionTypes: null
            },
    stateMap = {
        $shellcontainer: null,
        selectedTaskId: -1,
        taskList: [],
        currentTask: null,
        currentMember: null,
        currentYear: null,
        selectedYear: null,
        currentDateTime: null,
        saveIsEdit: true,
        currentAction: ""
    },
    jqueryMap = {}, listTasks, onMenuTask, onChangeTaskGroup, onEditTask, onDeleteTask, onCreateTask, onSaveTask,
            onLoginSuccess, taskCallback, setJqueryMap, configModule, initModule;
    //----------------- END MODULE SCOPE VARIABLES ---------------

    //------------------- BEGIN UTILITY METHODS ------------------
    function closePopup() {
        console.log("closePopup");
        jqueryMap.$taskFormValidator.resetForm();
        jqueryMap.$taskFormPopup.fadeOut();
        jqueryMap.$overlay.fadeOut();
    }

    function validateTaskForm() {
        console.log("Validator running");
        var validator = $("#taskForm").validate({
            focusCleanup: true,
            rules: {
             
                name: {required: true},
                taskShort: {required: true, minlength: 2, maxlength: 20},
                dateTime: {required: true},
                task:  {required: true}
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
        var $taskFormPopup = $contentWrapper.find('#taskAddEdit')
        jqueryMap = {
            $content: $content,
            $contentWrapper: $contentWrapper,
             $taskMenu: $menu.find('#admin_tasks'),
            $overlay: $content.find("#overlay-bg"),
            $taskGroup: $taskGroup,
            $taskList: $taskList,
            $taskListTableList: $taskList.find('#tblTaskList tbody'),
            $taskFormPopup: $taskFormPopup,
            $taskForm: $contentWrapper.find('#taskForm'),
            $taskFormValidator: validateTaskForm()};
    };
    // End DOM method /setJqueryMap/


    // Begin DOM method /listTasks/

    listTasks = function () {
        var myTask, tasklistLength;
        jqueryMap.$taskListTableList.html("");

        jqueryMap.$contentWrapper.find("#headerTask").text("Übersicht der Nachrichten für:  " + stateMap.selectedYear);

        stateMap.taskList = configMap.general_model.getItems(configMap.object_type);
        tasklistLength = stateMap.taskList.length;

        console.log(JSON.stringify(stateMap.taskList));

        for (var i = 0; i < tasklistLength; i++) {

            myTask = stateMap.taskList[i];
            jqueryMap.$taskListTableList.append("<tr>" + "<td><img src='../css/images/edit.png' alt='Edit" + myTask._id
                    + "' id='btnEditTask'  class='btnEdit'/></td><td><img src='../css/images/dustbin.png' alt='Delete"
                    + myTask._id + "'  id='btnDeleteTask'  class='btnDelete'/></td><td>"
                    + myTask.name + "</td><td>"
                    + myTask.shortTask + "</td><td>"
                    + myTask.dateTime + "</td><td>"
                    + myTask.task.substr(0,30) + (myTask.task.length>30? ' ......' :'')+ "</td>"
                    + "</tr>");

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
        // fetch events from saison; then fetch eventsByName; then capture 
        // those events that are of type="Arbeitsdienst"
        
        // create task, analog zu saison: Befülle die DB mit den Standardwerten
        
        // when shall I create tasks ? whenever a saiosn is created ??
        // when shall I update tasks ? Whenver a saiosn is updated ?
        // 
        // year: null,
        // workingEvents:[],
        // members:[]
        // saisonTasks:[ {taskName: "Arbeitsdienst 1", subtasks:[ {subTaskName: Stege, 
        // members:[Eki,Frankie, Chrischi]  }}]}
        configMap.general_model.search(configMap.object_type, searchParams, taskCallback);
        event.preventDefault();
        return false;
    };
    // End event handler /onMenuHome/   


    // Begin event handler /onLoginSuccess/  
    onLoginSuccess = function (event, login_user) {
        stateMap.currentMember = login_user;
        $.gevent.publish('show_messages', event);
        return false;

    }
    // End event handler /onLoginSuccess/   


    // Begin event handler /onCreateTask/  
    onCreateTask = function (event) {
        var currentDate = new Date();
        stateMap.currentDateTime = ((currentDate.getDate() < 10) ? "0" : "") + currentDate.getDate() + "/" + ((currentDate.getMonth() < 9) ? "0" : "") + (currentDate.getMonth() + 1) + "/" + currentDate.getFullYear();
        stateMap.currentDateTime = stateMap.currentDateTime + " @ " + ((currentDate.getHours() < 10) ? "0" : "") + currentDate.getHours() + ":" + ((currentDate.getMinutes() < 10) ? "0" : "") + currentDate.getMinutes() + ":" + ((currentDate.getSeconds() < 10) ? "0" : "") + currentDate.getSeconds();
        console.log(JSON.stringify(stateMap.currentDateTime));
        stateMap.currentAction = configMap.actionTypes.create;
        stateMap.saveIsEdit = false;
        jqueryMap.$taskFormValidator.resetForm();
        jqueryMap.$taskForm[0].reset();
        jqueryMap.$taskFormPopup.find("#headerTaskFormPopup").text("Neue Nachricht schreiben");
        jqueryMap.$taskFormPopup.fadeIn();
        jqueryMap.$taskForm.find("#txtTaskSender").val(stateMap.currentMember.username);
        jqueryMap.$taskForm.find("#txtTaskDateTime").val(stateMap.currentDateTime);
        jqueryMap.$taskForm.find("#txtTaskShort").val("").focus().prop("disabled", false);
        jqueryMap.$taskForm.find("#txtTaskLong");

        jqueryMap.$overlay.fadeIn();
        aige.util.updatePopup(jqueryMap.$taskFormPopup);

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
                year = $('#txtTaskGroupYear').val(),
                searchParams = {searchParams: {year: year}};

        if (!$(this).valid()) {
            return false;
        }

        taskMap = {
            _id: $(this).find('#txtTaskID').val(),
            year: stateMap.selectedYear,
            name: $(this).find('#txtTaskSender').val(),
            shortTask: $(this).find('#txtTaskShort').val(),
            dateTime: $(this).find('#txtTaskDateTime').val(),
            task: $(this).find('#txtTaskLong').val(),
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

        var searchParams = {searchParams: {year: stateMap.selectedYear}};
        stateMap.currentAction = configMap.actionTypes.delete;
        stateMap.selectedTaskId = $(this).attr("alt").replace("Delete", "");
        stateMap.currentTask = configMap.general_model.getById(configMap.object_type, stateMap.selectedTaskId);
        console.log(" stateMap.currentTask: " + JSON.stringify(stateMap.currentTask));
        if (stateMap.currentMember.username === stateMap.currentTask.name) {
            if (!confirm("Willst Du wirklich [" + stateMap.currentTask.shortTask + "] löschen?")) {
                return false;
            }
            configMap.general_model.deleteItem(configMap.object_type, stateMap.currentTask._id, taskCallback, searchParams);
            event.preventDefault();
        } else {
            var $message = $("<span> Es ist nur erlaubt, eigene Nachrichten zu löschen.</span>")
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

        stateMap.currentAction = configMap.actionTypes.update;
        stateMap.saveIsEdit = true;
        stateMap.selectedTaskId = $(this).attr("alt").replace("Edit", "");
        stateMap.currentTask = configMap.general_model.getById(configMap.object_type, stateMap.selectedTaskId);
        console.log(" stateMap.currentTask: " + JSON.stringify(stateMap.currentTask));
        if (stateMap.currentMember.username === stateMap.currentTask.name) {

            jqueryMap.$taskForm.find("#txtTaskID").val(stateMap.currentTask._id);
            jqueryMap.$taskForm.find("#txtTaskSender").val(stateMap.currentTask.name);
            jqueryMap.$taskForm.find("#txtTaskShort").val(stateMap.currentTask.shortTask).prop("disabled", true);
            jqueryMap.$taskForm.find("#txtTaskDateTime").val(stateMap.currentTask.dateTime);
            jqueryMap.$taskForm.find("#txtTaskLong").val(stateMap.currentTask.task).focus();
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
                        $("<span>Die Suche  war nicht erfolgreich</span>") : $("<span>Das Ergebnis der Nachrichtensuche:</span>");
                break;
            case configMap.actionTypes.create:
                $message = error ?
                        $("<span>Die 'Neuanlage' war nicht erfolgreich</span>") : $("<span> Es wurde eine neue Nachricht gespeichert.</span>");
                break;
            case configMap.actionTypes.update:
                $message = error ?
                        $("<span>Die  'Aendernung' war nicht erfolgreich</span>") : $("<span> Die Aenderung wurde gespeichert.</span>");
                break;
            case configMap.actionTypes.delete:
                $message = error ?
                        $("<span>Die Transaktion 'Entfernen' war nicht erfolgreich</span>") : $("<span> Die Nachricht wurde gelöscht.</span>");
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
        jqueryMap.$taskForm.on("click", "#buttonCloseTask", closePopup);
        jqueryMap.$contentWrapper.on("click", "#overlay-bg", closePopup);
        $.gevent.subscribe(jqueryMap.$contentWrapper, 'login-success', onLoginSuccess);
        $(window).resize(aige.util.updatePopup(jqueryMap.$taskFormPopup));

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
