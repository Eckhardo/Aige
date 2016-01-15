/*
 * aige.user.js
 * Template for browser feature modules
 *
 
 */

/*jslint         browser : true, continue : true,
 devel  : true, indent  : 2,    maxerr   : 50,
 newcap : true, nomen   : true, plusplus : true,
 regexp : true, sloppy  : true, vars     : false,
 white  : true
 */

/*global $, aige */

aige.home = (function () {

    //---------------- BEGIN MODULE SCOPE VARIABLES --------------
    var
            configMap = {
                messages_list_html: String()
                        + '<div id="messageList" class="aige-admin-member-list">'
                        + '<div id="messageGroup" class="buttonCreate">'
                        + '<form id = "messageGroupForm">'
                        + '<input type = "hidden" id = "txtMessageGroupID"/>'
                        + '<label for = "txtMessageGroupYear"> Jahr: </label>'
                        + '<select id="txtMessageGroupYear" name="messageGroupYear">'
                        + '<option>2016</option>'
                        + '<option>2017</option>'
                        + '<option>2018</option>'
                        + '<option>2019</option>'
                        + '</select>'
                        + '</form>'
                        + '</div>'
                        + '<div id="buttonCreateMessage" class="buttonCreate"> Neu anlegen</div>'
                        + '<h3 id="headerMessage" style="text-align:center;"></h3>'
                        + '<table id="tblMessageList" class="tblList">'
                        + '<thead><tr><th></th><th></th>'
                        + '<th>Von:</th><th>Betreff:</th><th>Datum</th><th>Nachricht</th>'

                        + '</tr></thead><tbody></tbody>'
                        + '</table>'
                        + '</div>',
                messages_form_html: String()
                        + '<div id="messageAddEdit" class="aige-admin-member-add-edit">'
                        + '<h2 id="headerMessageFormPopup" style="text-align:center;"></h2>'
                        + '<form id = "messageForm">'
                        + '<ul>'
                        + '<input type = "hidden" id = "txtMessageID"/ name="id">'
                        + '<li>'
                        + '<label for = "txtMessageSender"> Von: </label>'
                        + '<input type = "text" id = "txtMessageSender" name ="sender" readonly="readonly" />'
                        + '</li><li>'
                        + '<label for = "txtMessageShort"> Betreff: </label>'
                        + '<input type = "text" id="txtMessageShort" name="messageShort">'
                        + '</li><li>'
                        + '<label for = "txtMessageDatum"> Datum: </label>'
                        + '<input type = "text" id = "txtMessageDatum" name="dateTime" readonly="readonly"/>'
                        + '</li><li>'
                        + '<label for = "txtMessageLong"> Nachricht: </label>'
                        + '<textarea id = "txtMessageNachricht" name="news"'
                        + 'style=" width: 573px; height: 177px;"></textarea >'
                        + ' </li></ul>'
                        + '<div>'
                        + '<input type = "submit" value = "Speichern" id = "addEditMessageSave">'
                        + '<input id="buttonCloseMessage" class="buttonClose" type="button" value="Close Popup" />'
                        + '</div>'
                        + '</form>'
                        + '</div>',
                imageActive: "<img src='../css/images/boxSelected.gif' alt='Aktiv'/>",
                imageInactive: "<img src='../css/images/boxUnselected.gif' alt='Aktiv'/>",
                settable_map: {
                    general_model: true,
                    actionTypes: true
                },
                general_model: null,
                object_type: "message",
                actionTypes: null
            },
    stateMap = {
        $shellcontainer: null,
        selectedMessageId: -1,
        currentMessage: null,
        currentMember: null,
        currentYear: null,
        selectedYear: null,
        saveIsEdit: true,
        currentAction: ""
    },
    jqueryMap = {}, listMessages, onMenuHome, onChangeMessageGroupEvent, onEditMessage, onDeleteMessage, onCreateMessage, onSaveMessage,
            onLoginSuccess, messageCallback, setJqueryMap, configModule, initModule;
    //----------------- END MODULE SCOPE VARIABLES ---------------

    //------------------- BEGIN UTILITY METHODS ------------------
    function closePopup() {
        console.log("closePopup");
        jqueryMap.$messageFormValidator.resetForm();
        jqueryMap.$messageFormPopup.fadeOut();
        jqueryMap.$overlay.fadeOut();
    }

    function validateMessageForm() {
        var validator = $("#messageForm").validate({
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
                append($(configMap.messages_list_html)).
                append($(configMap.messages_form_html));
        var $messageGroup = $contentWrapper.find('#messageGroup');
        var $messageList = $contentWrapper.find('#messageList');
        var $messageFormPopup = $contentWrapper.find('#messageAddEdit')
        jqueryMap = {
            $content: $content,
            $contentWrapper: $contentWrapper,
            $homeMenu: $menu.find('#public_home'),
            $overlay: $content.find("#overlay-bg"),
            $messageGroup: $messageGroup,
            $messageList: $messageList,
            $messageListTableList: $messageList.find('#tblMessageList tbody'),
            $messageFormPopup: $messageFormPopup,
            $messageForm: $contentWrapper.find('#messageForm'),
            $messageFormValidator: validateMessageForm()};
    };
    // End DOM method /setJqueryMap/


    // Begin DOM method /listMessages/

    listMessages = function () {
        jqueryMap.$contentWrapper.find("#headerMessage").text("Übersicht der Nachrichten für:  " + stateMap.selectedYear);

        jqueryMap.$messageList.fadeIn(1000,"swing");
    }

    // End DOM method /listMessages/
    //---------------------- END DOM METHODS ---------------------

    //------------------- BEGIN EVENT HANDLERS -------------------
    // Begin event handler /onMenuHome/
    onMenuHome = function (event) {
        console.log("on menu home");

        stateMap.currentYear = new Date().getFullYear().toString();
        stateMap.selectedYear = stateMap.currentYear;
        stateMap.currentAction = configMap.actionTypes.list;
        jqueryMap.$contentWrapper.children().hide();
        jqueryMap.$messageGroup.fadeIn();
        $("#txtMessageGroupYear").val(stateMap.currentYear);
        var searchParams = {searchParams: {year: stateMap.currentYear}};
        configMap.general_model.search(configMap.object_type, searchParams, messageCallback);
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


    // Begin event handler /onCreateMessage/  
    onCreateMessage = function (event) {
        var currentDate = new Date();
        var datetime = ((currentDate.getDate() < 10) ? "0" : "") + currentDate.getDate() + "/" + ((currentDate.getMonth() < 9) ? "0" : "") + (currentDate.getMonth() + 1) + "/" + currentDate.getFullYear();
        datetime = datetime + " @ " + ((currentDate.getHours() < 10) ? "0" : "") + currentDate.getHours() + ":" + ((currentDate.getMinutes() < 10) ? "0" : "") + currentDate.getMinutes() + ":" + ((currentDate.getSeconds() < 10) ? "0" : "") + currentDate.getSeconds();

        stateMap.currentAction = configMap.actionTypes.create;
        stateMap.saveIsEdit = false;
        jqueryMap.$messageFormValidator.resetForm();
        jqueryMap.$messageForm[0].reset();
        jqueryMap.$messageFormPopup.find("#headerMessageFormPopup").text("Neue Nachricht schreiben");
        jqueryMap.$messageFormPopup.fadeIn();
        jqueryMap.$messageForm.find("#txtMessageSender").val(stateMap.currentMember.username);
        jqueryMap.$messageForm.find("#txtMessageDatum").val(datetime);
        jqueryMap.$messageForm.find("#txtMessageShort").val("").focus();
        jqueryMap.$messageForm.find("#txtMessageLong");

        jqueryMap.$overlay.fadeIn();
        aige.util.updatePopup(jqueryMap.$messageFormPopup);

        return false;
    };
    // End event handler /onCreateMessage/  
    //-------------------- END EVENT HANDLERS --------------------




    //------------------- BEGIN CALLBACK METHODS -------------------

    messageCallback = function (error) {
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

        listMessages();
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
        jqueryMap.$homeMenu.on('click', onMenuHome);
        $.gevent.subscribe(jqueryMap.$contentWrapper, 'show_messages', onMenuHome);
        jqueryMap.$messageGroup.on("change", "#txtMessageGroupYear", onChangeMessageGroupEvent);
        jqueryMap.$messageList.on("click", "#btnDeleteMessage", onDeleteMessage);
        jqueryMap.$messageList.on("click", "#btnEditMessage", onEditMessage);

        jqueryMap.$messageList.on("click", "#buttonCreateMessage", onCreateMessage);
        jqueryMap.$messageForm.on('submit', onSaveMessage);
        jqueryMap.$messageForm.on("click", "#buttonCloseMessage", closePopup);
        jqueryMap.$contentWrapper.on("click", "#overlay-bg", closePopup);
        $.gevent.subscribe(jqueryMap.$contentWrapper, 'login-success', onLoginSuccess);
        $(window).resize(aige.util.updatePopup(jqueryMap.$messageFormPopup));

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
