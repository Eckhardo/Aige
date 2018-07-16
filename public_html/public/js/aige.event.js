

/*
 * aige.event.js
 * Event feature module for AIGE
 */
/*jslint         browser : true, continue : true,
 devel  : true, indent  : 2,    maxerr   : 50,
 newcap : true, nomen   : true, plusplus : true,
 regexp : true, sloppy  : true, vars     : false,
 white  : true
 */

/*global $, aige */

aige.event = (function () {

//---------------- BEGIN MODULE SCOPE VARIABLES --------------
    var
            configMap = {
                events_list_html: String()
                        + '<div id="eventList" class="aige-admin-member-list">'
                        + '<div id="eventGroup" class="buttonCreate">'
                        + '<form id = "eventGroupForm">'
                        + '<input type = "hidden" id = "txtEventGroupID"/>'
                        + '<label for = "txtEventGroupYear"> Jahr: </label>'
                        + '<select id="txtEventGroupYear" name="eventGroupYear">'
                        + '<option >2014</option>'
                        + '<option >2015</option>'
                        + '<option>2016</option>'
                        + '<option>2017</option>'
                        + '<option>2018</option>'
                        + '<option>2019</option>'
                        + '</select>'
                        + '</form>'
                        + '</div>'
                        + '<div id="buttonCreateEvent" class="buttonCreate"> Neu anlegen</div>'
                        + '<table id="tblEventList" class="tblList">'
                        + '<thead><tr><th></th><th></th>'
                        + '<th>Jahr</th><th>Typ</th><th>Name</th><th>Kurzname</th><th>Datum</th>'
                        + '<th>Beginn</th><th>Ende</th><th>Treffpunkt</th><th>Bemerkungen</th>'
                        + '<th>aktiv</th>'
                        + '</tr></thead><tbody></tbody>'
                        + '</table>'
                        + '</div>',
                events_form_html: String()
                        + '<div id="eventAddEdit" class="aige-admin-member-add-edit">'
                        + '<h2 id="headerEventFormPopup" style="text-align:center;"></h2>'
                        + '<form id = "eventForm">'
                        + '<ul>'
                        + '<input type = "hidden" id = "txtEventID"/ name="id">'
                        + '<li>'
                        + '<label for = "txtEventYear"> Jahr: </label>'
                        + '<input type = "text" id = "txtEventYear" name ="year" readonly="readonly" />'
                        + '</li><li>'
                        + '<label for = "txtEventType"> Type: </label>'
                        + '<select id="txtEventType" name="type">'
                        + '<option>Arbeitsdienst</option>'
                        + '<option selected="selected">Angeltermin</option>'
                        + '<option>Versammlung</option>'
                        + '<option>Sonstiges</option>'
                        + '</select></li>'
                        + '<li>'
                        + '<label for = "txtEventName"> Name: </label>'
                        + '<input type = "text" id = "txtEventName" name="name" />'
                        + '</li><li>'
                        + '<label for = "txtEventShortname"> Kurzname: </label>'
                        + '<input type = "text" id = "txtEventShortname" name ="shortname"/>'
                        + '</li><li>'
                        + '<label for = "txtEventStartDate"> Datum: </label>'
                        + '<input type = "text" id = "txtEventStartDate"  name="startDate" />'
                        + '</li><li>'
                        + '<label for = "txtEventStartTime"> Startzeit: </label>'
                        + '<input type = "text" id = "txtEventStartTime" name="startTime" class="time" />'
                        + '</li><li>'
                        + '<label for = "txtEventEndTime"> Endezeit: </label>'
                        + '<input type = "text" id = "txtEventEndTime" name="endTime" class="time"  />'
                        + '</li><li>'
                        + '<label for = "txtEventMeetingPoint"> Treffpunkt: </label>'
                        + '<input type = "text" id = "txtEventMeetingPoint"name="meetingPoint" />'
                        + '</li><li>'
                        + '<label for = "txtEventComments"> Anmerkungen: </label>'
                        + '<textarea id = "txtEventComments" name="comments"></textarea>'
                        + '</li><li>'
                        + '<label for = "txtEventIsActive"> Aktiv: </label>'
                        + '<input type = "checkbox" id="txtEventIsActive" name="isActive"/>'
                        + ' </li></ul>'
                        + '<div>'
                        + '<input type = "submit" value = "Speichern" id = "addEditEventSave">'
                        + '<input id="buttonCloseEvent" class="buttonClose" type="button" value="Close Popup" />'
                        + '</div>'
                        + '</form>'
                        + '</div>',
                imageActive: "<img src='../css/images/boxSelected.gif' alt='Aktiv'/>",
                imageInactive: "<img src='../css/images/boxUnselected.gif' alt='Aktiv'/>",
                settable_map: {
                    general_model: true,
                    event_model: true,
                    actionTypes: true
                },
                general_model: null,
                event_model: null,
                object_type: "event",
                actionTypes: null
            },
    stateMap = {
        $shellcontainer: null,
        selectedEventId: -1,
        currentEvent: null,
        currentMember: null,
        evenList: [],
        saveIsEdit: true,
        currentAction: ""
    },
    jqueryMap = {}, listEvents, onMenuEvent, onChangeEventGroupEvent, onEditEvent, onDeleteEvent, onCreateEvent, onSaveEvent,
            onLoginSuccess, eventCallback, setJqueryMap, configModule, initModule;
    //----------------- END MODULE SCOPE VARIABLES ---------------

    //------------------- BEGIN UTILITY METHODS ------------------
    function closePopup() {
        console.log("closePopup");
        jqueryMap.$eventFormValidator.resetForm();
        jqueryMap.$eventFormPopup.fadeOut();
        jqueryMap.$overlay.fadeOut();
    }

    function validateEventForm() {
        var validator = $("#eventForm").validate({
            focusCleanup: true,
            rules: {
                year: {required: true},
                type: {required: true},
                name: {required: true, minlength: 2},
                shortname: {required: true, minlength: 2},
                startDate: {required: true, germanDate: true},
                startTime: {required: true},
                endTime: {required: true},
                meetingPoint: {required: true},
                comments: {}
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
                append($(configMap.events_list_html)).
                append($(configMap.events_form_html));
        var $eventGroup = $contentWrapper.find('#eventGroup');
        var $eventList = $contentWrapper.find('#eventList');
        var $eventFormPopup = $contentWrapper.find('#eventAddEdit')
        $eventFormPopup.find("#txtEventStartDate").datepicker(aige.util.getDatepickerOptions());
        $eventFormPopup.find('#txtEventStartTime').timepicker({'scrollDefault': 'ß7:00', 'timeFormat': 'H:i'});
        $eventFormPopup.find('#txtEventEndTime').timepicker({'scrollDefault': '07:00', 'timeFormat': 'H:i'});
        jqueryMap = {
            $content: $content,
            $contentWrapper: $contentWrapper,
            $eventMenu: $menu.find('#admin_event'),
            $overlay: $content.find("#overlay-bg"),
            $eventGroup: $eventGroup,
            $eventList: $eventList,
            $eventListTableList: $eventList.find('#tblEventList tbody'),
            $eventFormPopup: $eventFormPopup,
            $eventForm: $contentWrapper.find('#eventForm'),
            $eventFormValidator: validateEventForm()};
    };
    // End DOM method /setJqueryMap/

    /**
     * 
     * @returns {undefined}
     */
    listEvents = function () {
        console.log("list events");

        var myEvent, eventlistLength;
        jqueryMap.$eventListTableList.html("");


        stateMap.evenList = configMap.general_model.getItems(configMap.object_type);
        eventlistLength = stateMap.evenList.length;

        for (var i = 0; i < eventlistLength; i++) {

            myEvent = stateMap.evenList[i];
            jqueryMap.$eventListTableList.append("<tr>" + "<td><img src='../css/images/edit.png' alt='Edit" + myEvent._id
                    + "' id='btnEditEvent'  class='btnEdit'/></td><td><img src='../css/images/dustbin.png' alt='Delete"
                    + myEvent._id + "'  id='btnDeleteEvent'  class='btnDelete'/></td><td>"
                    + myEvent.year + "</td><td>"
                    + myEvent.type + "</td><td>"
                    + myEvent.name + "</td><td>"
                    + myEvent.shortname + "</td><td>"
                    + myEvent.startDate + "</td><td>"
                    + myEvent.startTime + "</td><td>"
                    + myEvent.endTime + "</td><td>"
                    + myEvent.meetingPoint + "</td><td>"
                    + myEvent.comments + "</td><td>"
                    + (myEvent.isActive ? configMap.imageActive : configMap.imageInactive)
                    + "</td>"
                    + "</tr>");

        }


        jqueryMap.$eventList.fadeIn();
    };
//---------------------- END DOM METHODS ---------------------

//------------------- BEGIN EVENT HANDLERS -------------------

    /**
     * 
     * @param {type} event
     * @returns {Boolean}
     */
    onMenuEvent = function (event) {
        console.log("on menu event");

        var currentYear = new Date().getFullYear().toString(), searchParams;
        stateMap.currentAction = configMap.actionTypes.list;
        jqueryMap.$contentWrapper.children().hide();
        jqueryMap.$eventGroup.fadeIn();
        $("#txtEventGroupYear").val(currentYear);
        searchParams = {searchParams: {year: currentYear}};
        configMap.general_model.search(configMap.object_type, searchParams, eventCallback);
        event.preventDefault();
        return false;
    };

    /**
     * Is fired if option list with years as options repersenting an event group is changed.
     * 
     * @param {type} event
     * @returns {false}
     */
    onChangeEventGroupEvent = function (event) {
        stateMap.currentAction = configMap.actionTypes.list;
        var year = $('#txtEventGroupYear').val();
        var searchParams = {searchParams: {year: year}};
        configMap.general_model.search(configMap.object_type, searchParams, eventCallback);
        event.preventDefault();
        return false;
    };


    onDeleteEvent = function (event) {
        if (stateMap.currentMember.isAdmin) {
            var year = $('#txtEventGroupYear').val();
            var searchParams = {searchParams: {year: year}};
            stateMap.currentAction = configMap.actionTypes.delete;
            stateMap.selectedEventId = $(this).attr("alt").replace("Delete", "");
            stateMap.currentEvent = configMap.general_model.getById(configMap.object_type, stateMap.selectedEventId);
            if (!confirm("Willst Du wirklich [" + stateMap.currentEvent.name + "] inaktivieren?")) {
                return false;
            }
            configMap.general_model.deleteItem(configMap.object_type, stateMap.currentEvent._id, eventCallback, searchParams);
            event.preventDefault();
        }
        else {
            var $message = $("<span> Du hast keine Berechtigung</span>")
            aige.util.messageConfirm($message);
        }
        return false;
    };
    /**
     * 
     * @param {type} event
     * @returns {Boolean}
     */
    onEditEvent = function (event) {
        if (stateMap.currentMember.isAdmin) {
            stateMap.currentAction = configMap.actionTypes.update;
            stateMap.saveIsEdit = true;
            stateMap.selectedEventId = $(this).attr("alt").replace("Edit", "");
            stateMap.currentEvent = configMap.general_model.getById(configMap.object_type, stateMap.selectedEventId);
            jqueryMap.$eventForm.find("#txtEventID").val(stateMap.currentEvent._id);
            jqueryMap.$eventForm.find("#txtEventYear").val(stateMap.currentEvent.year);
            jqueryMap.$eventForm.find("#txtEventType").val(stateMap.currentEvent.type);
            jqueryMap.$eventForm.find("#txtEventType  option:not(:selected)").prop("disabled", true);
            jqueryMap.$eventForm.find("#txtEventName").val(stateMap.currentEvent.name);
            jqueryMap.$eventForm.find("#txtEventName").prop("readonly", true);
            jqueryMap.$eventForm.find("#txtEventShortname").val(stateMap.currentEvent.shortname);
            jqueryMap.$eventForm.find("#txtEventStartDate").val(stateMap.currentEvent.startDate);
            jqueryMap.$eventForm.find("#txtEventStartTime").val(stateMap.currentEvent.startTime);
            jqueryMap.$eventForm.find("#txtEventEndTime").val(stateMap.currentEvent.endTime);
            jqueryMap.$eventForm.find("#txtEventMeetingPoint").val(stateMap.currentEvent.meetingPoint);
            jqueryMap.$eventForm.find("#txtEventComments").val(stateMap.currentEvent.comments);
            jqueryMap.$eventForm.find("#txtEventIsActive").prop("checked", stateMap.currentEvent.isActive);
            jqueryMap.$eventForm.find("#txtEventName").focus();
            jqueryMap.$overlay.fadeIn();
            jqueryMap.$eventFormPopup.fadeIn();

            aige.util.updatePopup(jqueryMap.$eventFormPopup);
            event.preventDefault();
        }
        else {
            var $message = $("<span> Du hast keine Berechtigung</span>")
            aige.util.messageConfirm($message);
        }
        return false;
    };
    /**
     * 
     * @returns {Boolean}
     */
    onCreateEvent = function () {
        if (stateMap.currentMember.isAdmin) {
            stateMap.currentAction = configMap.actionTypes.create;
            stateMap.saveIsEdit = false;
            jqueryMap.$eventFormValidator.resetForm();
            jqueryMap.$eventForm[0].reset();
            jqueryMap.$eventFormPopup.find("#headerEventFormPopup").text("Neues Mitglied anlegen");
            jqueryMap.$eventFormPopup.fadeIn();
            jqueryMap.$eventForm.find("#txtEventYear").val($('#txtEventGroupYear').val());
            jqueryMap.$eventForm.find("#txtEventType").attr("disabled", false);
            jqueryMap.$eventForm.find("#txtEventType").focus();
            jqueryMap.$eventForm.find("#txtEventName").prop("readonly", false);
            jqueryMap.$overlay.fadeIn();
            aige.util.updatePopup(jqueryMap.$eventFormPopup);
        }
        else {
            var $message = $("<span> Du hast keine Berechtigung</span>")
            aige.util.messageConfirm($message);
        }
        return false;
    };
    /**
     * 
     * @param {type} event
     * @returns {Boolean}
     */
    onSaveEvent = function (event) {

        var eventMap, formParams,
                year = $('#txtEventGroupYear').val(),
                searchParams = {searchParams: {year: year}};

        if (!$(this).valid()) {
            return false;
        }

        eventMap = {
            _id: $(this).find('#txtEventID').val(),
            year: $(this).find('#txtEventYear').val(),
            type: $(this).find('#txtEventType').val(),
            name: $(this).find('#txtEventName').val(),
            shortname: $(this).find('#txtEventShortname').val(),
            startDate: $(this).find('#txtEventStartDate').val(),
            startTime: $(this).find('#txtEventStartTime').val(),
            endTime: $(this).find('#txtEventEndTime').val(),
            meetingPoint: $(this).find('#txtEventMeetingPoint').val(),
            comments: $(this).find('#txtEventComments').val(),
            isActive: $(this).find('#txtEventIsActive').is(":checked")
        };
        formParams = aige.util.getFormData($(this));
        console.log("formParams2=" + JSON.stringify(formParams));

        stateMap.saveIsEdit ?
                configMap.general_model.updateItem(configMap.object_type, eventMap, eventCallback, searchParams) :
                configMap.general_model.createItem(configMap.object_type, eventMap, eventCallback, searchParams);
        jqueryMap.$eventFormPopup.fadeOut();
        jqueryMap.$overlay.fadeOut();
        event.preventDefault();
    };


    onLoginSuccess = function (event, login_user) {
        stateMap.currentMember = login_user;
        console.log("current member for event model=" + stateMap.currentMember.username);
        return false;

    }
    //-------------------- END EVENT HANDLERS --------------------
    //-------------------- START CALLBACKS  -------------------- 

    eventCallback = function (error) {

        var $message;
        switch (stateMap.currentAction) {
            case configMap.actionTypes.list:
                $message = error ?
                        $("<span>Die Suche  war nicht erfolgreich</span>") : $("<span>Das Ergebnis der Ereignissuche:</span>");
                break;
            case configMap.actionTypes.create:
                $message = error ?
                        $("<span>Die 'Neuanlage' war nicht erfolgreich</span>") : $("<span> Es wurde ein neues Ereignis gespeichert.</span>");
                break;
            case configMap.actionTypes.update:
                $message = error ?
                        $("<span>Die  'Aendernung' war nicht erfolgreich</span>") : $("<span> Die Aenderung wurde gespeichert.</span>");
                break;
            case configMap.actionTypes.delete:
                $message = error ?
                        $("<span>Die Transaktion 'Entfernen' war nicht erfolgreich</span>") : $("<span> Das Ereignis wurde deaktiviert.</span>");
                break;
        }
        error ?
                aige.util.messageError($message) :
                aige.util.messageConfirm($message);

        listEvents();
    };
    //-------------------- END CALLBACKS --------------------
    //-------------------- START PUBLIC METHIDS  -------------------- 
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
        jqueryMap.$eventMenu.on('click', onMenuEvent);
        jqueryMap.$eventGroup.on("change", "#txtEventGroupYear", onChangeEventGroupEvent);
        jqueryMap.$eventList.on("click", "#btnDeleteEvent", onDeleteEvent);
        jqueryMap.$eventList.on("click", "#btnEditEvent", onEditEvent);

        jqueryMap.$eventList.on("click", "#buttonCreateEvent", onCreateEvent);
        jqueryMap.$eventForm.on('submit', onSaveEvent);
        jqueryMap.$eventForm.on("click", "#buttonCloseEvent", closePopup);
        jqueryMap.$contentWrapper.on("click", "#overlay-bg", closePopup);
        $.gevent.subscribe(jqueryMap.$contentWrapper, 'login-success', onLoginSuccess);
        $(window).resize(aige.util.updatePopup(jqueryMap.$eventFormPopup));
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

