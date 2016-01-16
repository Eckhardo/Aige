/*
 * aige.home.js
 * Home feature modules, including messages.
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
                        + '<label for = "txtMessageDateTime"> Datum: </label>'
                        + '<input type = "text" id = "txtMessageDateTime" name="dateTime" readonly="readonly"/>'
                        + '</li><li>'
                        + '<label for = "txtMessageLong"> Nachricht: </label>'
                        + '<textarea id = "txtMessageLong" name="message"'
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
        messageList: [],
        currentMessage: null,
        currentMember: null,
        currentYear: null,
        selectedYear: null,
        currentDateTime: null,
        saveIsEdit: true,
        currentAction: ""
    },
    jqueryMap = {}, listMessages, onMenuHome, onChangeMessageGroup, onEditMessage, onDeleteMessage, onCreateMessage, onSaveMessage,
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
        console.log("Validator running");
        var validator = $("#messageForm").validate({
            focusCleanup: true,
            rules: {
             
                name: {required: true},
                messageShort: {required: true, minlength: 2, maxlength: 20},
                dateTime: {required: true},
                message:  {required: true}
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
        var myMessage, messagelistLength;
        jqueryMap.$messageListTableList.html("");

        jqueryMap.$contentWrapper.find("#headerMessage").text("Übersicht der Nachrichten für:  " + stateMap.selectedYear);

        stateMap.messageList = configMap.general_model.getItems(configMap.object_type);
        messagelistLength = stateMap.messageList.length;

        console.log(JSON.stringify(stateMap.messageList));

        for (var i = 0; i < messagelistLength; i++) {

            myMessage = stateMap.messageList[i];
            jqueryMap.$messageListTableList.append("<tr>" + "<td><img src='../css/images/edit.png' alt='Edit" + myMessage._id
                    + "' id='btnEditMessage'  class='btnEdit'/></td><td><img src='../css/images/dustbin.png' alt='Delete"
                    + myMessage._id + "'  id='btnDeleteMessage'  class='btnDelete'/></td><td>"
                    + myMessage.name + "</td><td>"
                    + myMessage.shortMessage + "</td><td>"
                    + myMessage.dateTime + "</td><td>"
                    + myMessage.message.substr(0,30) + (myMessage.message.length>30? ' ......' :'')+ "</td>"
                    + "</tr>");

        }

        jqueryMap.$messageList.fadeIn(1000, "swing");
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
        stateMap.currentDateTime = ((currentDate.getDate() < 10) ? "0" : "") + currentDate.getDate() + "/" + ((currentDate.getMonth() < 9) ? "0" : "") + (currentDate.getMonth() + 1) + "/" + currentDate.getFullYear();
        stateMap.currentDateTime = stateMap.currentDateTime + " @ " + ((currentDate.getHours() < 10) ? "0" : "") + currentDate.getHours() + ":" + ((currentDate.getMinutes() < 10) ? "0" : "") + currentDate.getMinutes() + ":" + ((currentDate.getSeconds() < 10) ? "0" : "") + currentDate.getSeconds();
        console.log(JSON.stringify(stateMap.currentDateTime));
        stateMap.currentAction = configMap.actionTypes.create;
        stateMap.saveIsEdit = false;
        jqueryMap.$messageFormValidator.resetForm();
        jqueryMap.$messageForm[0].reset();
        jqueryMap.$messageFormPopup.find("#headerMessageFormPopup").text("Neue Nachricht schreiben");
        jqueryMap.$messageFormPopup.fadeIn();
        jqueryMap.$messageForm.find("#txtMessageSender").val(stateMap.currentMember.username);
        jqueryMap.$messageForm.find("#txtMessageDateTime").val(stateMap.currentDateTime);
        jqueryMap.$messageForm.find("#txtMessageShort").val("").focus().prop("disabled", false);
        jqueryMap.$messageForm.find("#txtMessageLong");

        jqueryMap.$overlay.fadeIn();
        aige.util.updatePopup(jqueryMap.$messageFormPopup);

        return false;
    };
    // End event handler /onCreateMessage/  


    // Begin event handler /onSaveMessage/  
    /**
     * 
     * @param {type} event
     * @returns {Boolean}
     */
    onSaveMessage = function (event) {

        var messageMap, formParams,
                year = $('#txtMessageGroupYear').val(),
                searchParams = {searchParams: {year: year}};

        if (!$(this).valid()) {
            return false;
        }

        messageMap = {
            _id: $(this).find('#txtMessageID').val(),
            year: stateMap.selectedYear,
            name: $(this).find('#txtMessageSender').val(),
            shortMessage: $(this).find('#txtMessageShort').val(),
            dateTime: $(this).find('#txtMessageDateTime').val(),
            message: $(this).find('#txtMessageLong').val(),
        };
        formParams = aige.util.getFormData($(this));
        console.log("formParams2=" + JSON.stringify(formParams));
        console.log("formParams2=" + JSON.stringify(messageMap));

        stateMap.saveIsEdit ?
                configMap.general_model.updateItem(configMap.object_type, messageMap, messageCallback, searchParams) :
                configMap.general_model.createItem(configMap.object_type, messageMap, messageCallback, searchParams);
        jqueryMap.$messageFormPopup.fadeOut();
        jqueryMap.$overlay.fadeOut();
        event.preventDefault();
    };
    // End event handler /onSaveMessage/  



    // Begin event handler /onDeleteMessage/  

    onDeleteMessage = function (event) {

        var searchParams = {searchParams: {year: stateMap.selectedYear}};
        stateMap.currentAction = configMap.actionTypes.delete;
        stateMap.selectedMessageId = $(this).attr("alt").replace("Delete", "");
        stateMap.currentMessage = configMap.general_model.getById(configMap.object_type, stateMap.selectedMessageId);
        console.log(" stateMap.currentMessage: " + JSON.stringify(stateMap.currentMessage));
        if (stateMap.currentMember.username === stateMap.currentMessage.name) {
            if (!confirm("Willst Du wirklich [" + stateMap.currentMessage.shortMessage + "] löschen?")) {
                return false;
            }
            configMap.general_model.deleteItem(configMap.object_type, stateMap.currentMessage._id, messageCallback, searchParams);
            event.preventDefault();
        } else {
            var $message = $("<span> Es ist nur erlaubt, eigene Nachrichten zu löschen.</span>")
            aige.util.messageConfirm($message);
        }
        return false;

    };
    // End event handler /onDeleteMessage/  


    // Begin event handler /onEditMessage/  
    /**
     * 
     * @param {type} event
     * @returns {Boolean}
     */
    onEditMessage = function (event) {

        stateMap.currentAction = configMap.actionTypes.update;
        stateMap.saveIsEdit = true;
        stateMap.selectedMessageId = $(this).attr("alt").replace("Edit", "");
        stateMap.currentMessage = configMap.general_model.getById(configMap.object_type, stateMap.selectedMessageId);
        console.log(" stateMap.currentMessage: " + JSON.stringify(stateMap.currentMessage));
        if (stateMap.currentMember.username === stateMap.currentMessage.name) {

            jqueryMap.$messageForm.find("#txtMessageID").val(stateMap.currentMessage._id);
            jqueryMap.$messageForm.find("#txtMessageSender").val(stateMap.currentMessage.name);
            jqueryMap.$messageForm.find("#txtMessageShort").val(stateMap.currentMessage.shortMessage).prop("disabled", true);
            jqueryMap.$messageForm.find("#txtMessageDateTime").val(stateMap.currentMessage.dateTime);
            jqueryMap.$messageForm.find("#txtMessageLong").val(stateMap.currentMessage.message).focus();
            jqueryMap.$overlay.fadeIn();
            jqueryMap.$messageFormPopup.fadeIn();

            aige.util.updatePopup(jqueryMap.$messageFormPopup);
            event.preventDefault();
        } else {
            var $message = $("<span> Es ist nur erlaubt, eigene Nachrichten zu ändern.</span>")
            aige.util.messageConfirm($message);
        }
        return false;
    };
    // End event handler /onEditMessage/  

    // Begin event handler /onChangeMessageGroup/  
    /**
     * Is fired if option list with years as options repersenting an event group is changed.
     * 
     * @param {type} event
     * @returns {false}
     */
    onChangeMessageGroup = function (event) {
        stateMap.currentAction = configMap.actionTypes.list;
        stateMap.selectedYear = $('#txtMessageGroupYear').val();
        var searchParams = {searchParams: {year: stateMap.selectedYear}};
        configMap.general_model.search(configMap.object_type, searchParams, messageCallback);
        event.preventDefault();
        return false;
    };
    // End event handler /onChangeMessageGroup/  
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
        jqueryMap.$messageGroup.on("change", "#txtMessageGroupYear", onChangeMessageGroup);
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
