
/*
 * aige.membership.js
 * Membership feature module for AIGE
 */
/*jslint         browser : true, continue : true,
 devel  : true, indent  : 2,    maxerr   : 50,
 newcap : true, nomen   : true, plusplus : true,
 regexp : true, sloppy  : true, vars     : false,
 white  : true
 */

/*global $, aige */

aige.membership = (function () {

//---------------- BEGIN MODULE SCOPE VARIABLES --------------
    var
            configMap = {
                membership_list_html: String()
                        + '<div id="membershipList" class="aige-admin-member-list">'
                        + '<div id="membershipGroup" class="buttonCreate">'
                        + '<form id = "membershipGroupForm">'
                        + '<input type = "hidden" id = "txtMembershipGroupID"/>'
                        + '<label for = "txtMembershipGroupYear"> Jahr: </label>'
                        + '<select id="txtMembershipGroupYear" name="membershipGroupYear">'
                        + '<option >2013</option>'
                        + '<option >2014</option>'
                        + '<option >2015</option>'
                        + '<option selected="selected">2016</option>'
                        + '<option>2017</option>'
                        + '<option>2018</option>'
                        + '<option>2019</option>'
                        + '</select>'
                        + '</form>'
                        + '</div>'
                        + '<div id="buttonCreateMembership" class="buttonCreate"> Neu anlegen</div>'
                        + '<table id="tblMembershipList" class="tblList">'
                        + '<thead><tr><th></th><th></th>'
                        + '<th>Name</th><th>Jahr</th><th>Mitglieder</th>'
                        + '<th>Ereignisse</th><th>Kommentar</th><th>aktiv</th>'
                        + '</tr></thead><tbody></tbody>'
                        + '</table>'
                        + '</div>',
                membership_form_html: String()
                        + '<div id="membershipAddEdit" class="aige-admin-member-add-edit">'
                        + '<h2 id="headerMembershipFormPopup" style="text-align:center;"></h2>'
                        + '<form id = "membershipForm">'
                        + '<ul>'
                        + '<input type = "hidden" id = "txtMembershipID"/>'
                        + '<li>'
                        + '<label for = "txtMembershipName"> Name: </label>'
                        + '<input type = "text" id = "txtMembershipName" name="name" />'
                        + '</li><li>'
                        + '<label for = "txtMembershipYear"> Jahr: </label>'
                        + '<input type = "text" id = "txtMembershipYear" name ="year" readonly="readonly"/>'
                        + '</li><li>'
                        + '<label for = "txtMemberPicklist"> Mitglieder: </label>'
                        + '<select id="txtMemberPicklist" name="mmberPicklist" multiple="multiple">'
                        + '</select>'
                        + '</li><li>'
                        + '<label for = "txtEventPicklist"> Ereignisse: </label>'
                        + '<select id="txtEventPicklist" name="eventPicklist" multiple="multiple">'
                        + '</select>'
                        + '</li><li>'
                        + '<label for = "txtMembershipComments"> Anmerkungen: </label>'
                        + '<textarea id = "txtMembershipComments" name="comments"></textarea>'
                        + '</li><li>'
                        + '<label for = "txtMembershipIsActive"> Aktiv: </label>'
                        + '<input type = "checkbox" id="txtMembershipIsActive"/>'
                        + ' </li></ul>'
                        + '<div>'
                        + '<input type = "submit" value = "Speichern" id = "addEditMembershipSave">'
                        + '<input id="buttonCloseMembership" class="buttonClose" type="button" value="Close Popup" />'
                        + '</div>'
                        + '</form>'
                        + '</div>',
                imageActive: "<img src='../css/images/boxSelected.gif' alt='Aktiv'/>",
                imageInactive: "<img src='../css/images/boxUnselected.gif' alt='Aktiv'/>",
                settable_map: {
                    general_model: true,
                    membership_model: true,
                    event_model: true,
                    actionTypes: true
                },
                general_model: null,
                membership_model: null,
                event_model: null,
                object_type: "membership",
                actionTypes: null
            },
    stateMap = {
        $shellcontainer: null,
        currentMembership: null,
        currentMember: null,
        currentEvents: [],
        currentYear: null,
        selectedYear: null,
        membershipList: [],
        selectedMembershipId: -1,
        saveIsEdit: true,
        currentAction: "",
        pickedMembers: [],
        pickedEvents: []
    },
    jqueryMap = {}, listSelectedMembership, onMenuMembership, onEditMembership, onDeleteMembership, onCreateMembership, onSaveMembership,
            onEventPicklistChange, onMemberPicklistChange, onLoginSuccess, membershipCallback, setJqueryMap, configModule, initModule;
    //----------------- END MODULE SCOPE VARIABLES ---------------

    //------------------- BEGIN UTILITY METHODS ------------------


    function updatePopup() {
        var $popupContent = jqueryMap.$membershipFormPopup,
                // http://api.jquery.com/height/
                // http://api.jquery.com/outerheight/
                //var top = $(window).height() / 2 - $popupContent.outerHeight() / 2; // Center vertical
                top = "50px", // Fixed offset
                // http://api.jquery.com/width/
                //  http://api.jquery.com/outerWidth/
                left = ($(window).width() - $popupContent.outerWidth()) / 2; // Center horizontal
        $popupContent.css({
            'top': top,
            'left': left
        });
    }

    function closePopup() {
        jqueryMap.$membershipFormValidator.resetForm();
        jqueryMap.$membershipFormPopup.fadeOut();
        jqueryMap.$overlay.fadeOut();
    }

    function validateMembershipForm() {
        var validator = $("#membershipForm").validate({
            focusCleanup: true,
            rules: {
                name: {required: true, minlength: 2},
                year: {required: true, minlength: 4},
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



    function addItemsToPicklist(picklist, items, isRegistered) {

        for (var i = 0; i < items.length; i++) {
            var param = {value: items[i],
                label: items[i],
                selected: isRegistered};
            picklist.pickList("insert", param);
        }
    }
//-------------------- END UTILITY METHODS -------------------
    //--------------------- BEGIN DOM METHODS --------------------
    // Begin DOM method /setJqueryMap/
    setJqueryMap = function () {
        var $container = stateMap.$shellcontainer,
                $menu = $container.find('#cssmenu'),
                $content = $container.find('.aige-shell-main-content'),
                $contentWrapper = $container.find("#contentWrapper");

        $contentWrapper.append($(configMap.membership_list_html));
        $contentWrapper.append($(configMap.membership_form_html));

        var $adminMembershipList = $contentWrapper.find('#membershipList');
        var $membershipFormPopup = $contentWrapper.find('#membershipAddEdit');

        var $memberPicklist = $membershipFormPopup.find("#txtMemberPicklist").pickList({
            "sourceListLabel": "Verfügbar",
            "targetListLabel": "Ausgewählt"
        });

        var $eventPicklist = $membershipFormPopup.find("#txtEventPicklist").pickList({
            "sourceListLabel": "Verfügbar",
            "targetListLabel": "Ausgewählt"
        });
        var $membershipGroup = $contentWrapper.find('#membershipGroup');
        jqueryMap = {
            $content: $content,
            $contentWrapper: $contentWrapper,
            $membershipMenu: $menu.find('#admin_membership'),
            $overlay: $content.find("#overlay-bg"),
            $adminMembershipList: $adminMembershipList,
            $adminMembershipListTableList: $adminMembershipList.find('#tblMembershipList tbody'),
            $membershipFormPopup: $membershipFormPopup,
            $membershipForm: $contentWrapper.find('#membershipForm'),
            $membershipFormValidator: validateMembershipForm(),
            $memberPicklist: $memberPicklist,
            $eventPicklist: $eventPicklist,
            $membershipGroup: $membershipGroup};
    };
    // End DOM method /setJqueryMap/


    /**
     * 
     * @returns {undefined}
     */
    listSelectedMembership = function () {

        var searchParams, bodyArray = [], j = -1;
        jqueryMap.$adminMembershipListTableList.html("");
        stateMap.currentMembership = configMap.general_model.getCurrentItem(configMap.object_type);
        //   console.log(" list current membership" + JSON.stringify(stateMap.currentMembership));
        if (stateMap.currentMembership) {
            jqueryMap.$adminMembershipList.find('#buttonCreateMembership').hide();

            searchParams = {searchParams: {year: stateMap.currentMembership.year}};
            configMap.event_model.searchByNames(searchParams, stateMap.currentMembership.events, function (error) {
                if (error) {
                    console.log("error");
                    return false;
                }
                stateMap.currentEvents = configMap.general_model.getItems("event");

                bodyArray[++j] = "<tr><td><img src='../css/images/edit.png' alt='Edit";
                bodyArray[++j] = stateMap.currentMembership._id;
                bodyArray[++j] = "' id='btnEditMembership'  class='btnEdit'/></td><td><img src='../css/images/dustbin.png' alt='Delete";
                bodyArray[++j] = stateMap.currentMembership._id;
                bodyArray[++j] = "'  id='btnDeleteMembership'  class='btnDelete'/></td><td>";
                bodyArray[++j] = stateMap.currentMembership.name + "</td><td>";
                bodyArray[++j] = stateMap.currentMembership.year + "</td><td>";
                stateMap.currentMembership.members.forEach(function (member, i) {
                    if (i < stateMap.currentMembership.members.length - 1) {
                        bodyArray[++j] = member + ", ";
                    } else {
                        bodyArray[++j] = member;
                    }
                });
                bodyArray[++j] = "</td><td>";

                stateMap.currentEvents.forEach(function (event, i) {
                    bodyArray[++j] = "<br>" + event.displayName() + "</br>";
                });

                bodyArray[++j] = "</td><td>";
                bodyArray[++j] = stateMap.currentMembership.comments + "</td><td>";
                bodyArray[++j] = (stateMap.currentMembership.isActive ? configMap.imageActive : configMap.imageInactive);
                bodyArray[++j] = "</td></tr>";
                jqueryMap.$adminMembershipListTableList.html("");
                jqueryMap.$adminMembershipListTableList.html(bodyArray.join(''));


            });

        } else {
            jqueryMap.$adminMembershipList.find('#buttonCreateMembership').show();
        }
        jqueryMap.$adminMembershipList.fadeIn(1000, "swing");
    };
//---------------------- END DOM METHODS ---------------------

//------------------- BEGIN EVENT HANDLERS -------------------

    /**
     * 
     * @param {type} event
     * @returns {undefined}
     */
    onMenuMembership = function (event) {
        var searchParams;
        stateMap.currentMembership = null;
        stateMap.pickedEvents = [];
        stateMap.pickedMembers = [];
        stateMap.currentYear = new Date().getFullYear().toString();
        stateMap.selectedYear = stateMap.currentYear;
        stateMap.currentAction = configMap.actionTypes.list;
        jqueryMap.$contentWrapper.children().hide();
        jqueryMap.$membershipGroup.fadeIn();
        jqueryMap.$membershipGroup.find("#txtMembershipGroupYear").val(stateMap.currentYear);
        searchParams = {searchParams: {year: stateMap.currentYear}};
        configMap.general_model.search(configMap.object_type, searchParams, membershipCallback);
        event.preventDefault();
    };

    /**
     * Is fired if option list with years as options repersenting an event group is changed.
     * 
     * @param {type} event
     * @returns {false}
     */
    onChangeMembershipGroupEvent = function (event) {

        stateMap.currentMembership = null;
        stateMap.pickedEvents = [];
         stateMap.pickedMembers = [];
        stateMap.currentAction = configMap.actionTypes.list;
        stateMap.selectedYear = jqueryMap.$membershipGroup.find('#txtMembershipGroupYear').val();
        console.log("selected year= " + JSON.stringify(stateMap.selectedYear));
        var searchParams = {searchParams: {year: stateMap.selectedYear}};
        configMap.general_model.search(configMap.object_type, searchParams, membershipCallback);
        event.preventDefault();
        return false;
    };
    /*
     * 
     * @param {type} event
     * @returns {Boolean}
     */
    onDeleteMembership = function (event) {

        if (stateMap.currentMember.isAdmin && stateMap.selectedYear >= stateMap.currentYear) {
            stateMap.currentAction = configMap.actionTypes.delete;
            event.preventDefault();
            stateMap.selectedMembershipId = $(this).attr("alt").replace("Delete", "");
            stateMap.currentMembership = configMap.general_model.getCurrentItem(configMap.object_type);
            console.log("membership" + stateMap.currentMembership.name);
            if (!confirm("Willst Du wirklich [" + stateMap.currentMembership.name + "] loeschen?")) {
                return false;
            }
            configMap.general_model.deleteItem(configMap.object_type, stateMap.currentMembership._id, membershipCallback);
        } else {
            var $message = $("<span> Du hast keine Berechtigung oder die Mitgliedschaft ist abgelaufen und darf nicht mehr gelöscht werden</span>")
            aige.util.messageConfirm($message);
        }

    };
    /**
     * 
     * @param {type} event
     * @returns {Boolean}
     */
    onEditMembership = function (event) {
        var inactiveMembers, inactiveEvents,
                searchParams = {searchParams: {year: stateMap.selectedYear}};

        if (stateMap.currentMember.isAdmin && stateMap.selectedYear >= stateMap.currentYear) {
            console.log(" ms: " + JSON.stringify(stateMap.currentMembership));
            console.log("year: " + JSON.stringify(stateMap.selectedYear));

            stateMap.currentAction = configMap.actionTypes.update;
            stateMap.saveIsEdit = true;

            jqueryMap.$membershipFormPopup.find('.pickList_sourceList li').remove();
            jqueryMap.$membershipFormPopup.find('.pickList_targetList li').remove();
            jqueryMap.$membershipFormPopup.find('.pickList_targetList,.pickList_sourceList').css("background-color", "#fff");
            jqueryMap.$membershipFormPopup.find("#txtMembershipID").val(stateMap.currentMembership._id);
            jqueryMap.$membershipFormPopup.find("#txtMembershipName").val(stateMap.currentMembership.name);
            jqueryMap.$membershipFormPopup.find("#txtMembershipYear").val(stateMap.currentMembership.year);
            jqueryMap.$membershipFormPopup.find("#txtMembershipComments").val(stateMap.currentMembership.comments);
            jqueryMap.$membershipFormPopup.find("#txtMembershipIsActive").prop("checked", stateMap.currentMembership.isActive);
            configMap.membership_model.findInactiveItems(stateMap.currentMembership.members, stateMap.currentMembership.events, searchParams, function (error) {
                if (error) {
                    $message = $("<span>Das Fuellen der Picklist ist nicht erfolgreich</span>");
                    return false;
                }
                inactiveMembers = configMap.membership_model.getUnregisteredMembers();
                inactiveEvents = configMap.membership_model.getUnregisteredEvents();


                setTimeout(function () {
                    addItemsToPicklist(jqueryMap.$memberPicklist, stateMap.currentMembership.members, true);
                    addItemsToPicklist(jqueryMap.$eventPicklist, stateMap.currentMembership.events, true);
                    addItemsToPicklist(jqueryMap.$memberPicklist, inactiveMembers, false);
                    addItemsToPicklist(jqueryMap.$eventPicklist, inactiveEvents, false);
                }, 1000);
            });


            updatePopup();
            jqueryMap.$membershipFormPopup.fadeIn();
            jqueryMap.$overlay.fadeIn();
            jqueryMap.$membershipFormPopup.find("#txtMembershipName").focus();
        } else {
            var $message = $("<span> Du hast keine Berechtigung oder die Mitgliedschaft ist abgelaufen und darf nicht mehr verändert werden</span>")
            aige.util.messageConfirm($message);
        }
        return false;
    };
    /**
     * 
     * @returns {Boolean}
     */
    onCreateMembership = function () {


        var inactiveMembers, inactiveEvents;
        if (stateMap.currentMember.isAdmin && stateMap.selectedYear >= stateMap.currentYear) {
            stateMap.currentAction = configMap.actionTypes.create;
            stateMap.saveIsEdit = false;
            jqueryMap.$membershipFormPopup.find('.pickList_sourceList li').remove();
            jqueryMap.$membershipFormPopup.find('.pickList_targetList li').remove();
            jqueryMap.$membershipFormPopup.find('.pickList_targetList,.pickList_sourceList').css("background-color", "#fff");
            jqueryMap.$membershipFormValidator.resetForm();
            jqueryMap.$membershipForm[0].reset();
            jqueryMap.$membershipFormPopup.find("#headerMembershipFormPopup").text("Neue Mitgliedschaft anlegen");
            configMap.membership_model.findInactiveItems([], [], {searchParams: {year: stateMap.selectedYear}}, function (error) {
                if (error) {
                    $message = $("<span>Das Fuellen der Picklist ist nicht erfolgreich</span>");
                    aige.util.messageConfirm($message);
                    return false;
                }
                inactiveMembers = configMap.membership_model.getUnregisteredMembers();
                inactiveEvents = configMap.membership_model.getUnregisteredEvents();
                if (!inactiveEvents || inactiveEvents.length < 1) {
                    $message = $("<span>Bitte erst Ereignisse anlegen bzw. diese aktivieren.</span>");
                    aige.util.messageConfirm($message);
                    return false;
                } else {
                    updatePopup();
                    jqueryMap.$membershipFormPopup.fadeIn();
                    jqueryMap.$overlay.fadeIn();
                    jqueryMap.$membershipForm.find("#txtMembershipYear").val(stateMap.selectedYear);
                    jqueryMap.$membershipFormPopup.find("#txtMembershipName").focus();
                    setTimeout(function () {
                        addItemsToPicklist(jqueryMap.$memberPicklist, inactiveMembers, false);
                        addItemsToPicklist(jqueryMap.$eventPicklist, inactiveEvents, false);
                    }, 1000);
                }

            });
        } else {
            var $message = $("<span> Du hast keine Berechtigung oder das Jahr der Mitgliedschaft liegt in der Vergangenheit </span>")
            aige.util.messageConfirm($message);
        }
        return false;
    };
    onSaveMembership = function (event) {

        if (!jqueryMap.$membershipForm.valid()) {
            return false;
        }

        var membership = {
            _id: jqueryMap.$membershipFormPopup.find('#txtMembershipID').val(),
            name: jqueryMap.$membershipFormPopup.find('#txtMembershipName').val(),
            year: jqueryMap.$membershipFormPopup.find('#txtMembershipYear').val(),
            members: stateMap.pickedMembers,
            events: stateMap.pickedEvents,
            comments: jqueryMap.$membershipFormPopup.find('#txtMembershipComments').val(),
            isActive: jqueryMap.$membershipFormPopup.find('#txtMembershipIsActive').is(":checked")
        };
        console.log("to be saved= " + JSON.stringify(membership));
        stateMap.saveIsEdit ?
                configMap.general_model.updateItem(configMap.object_type, membership, membershipCallback) :
                configMap.general_model.createItem(configMap.object_type, membership, membershipCallback);

        jqueryMap.$membershipFormPopup.fadeOut();
        jqueryMap.$overlay.fadeOut();
        event.preventDefault();
    };
    onEventPicklistChange = function (event) {

        stateMap.pickedEvents = [];
        var items = jqueryMap.$eventPicklist.closest("li").find('.pickList_targetList').children('li');
        items.each(function () {
            stateMap.pickedEvents.push($(this).data('value'));
        });
        //    console.log(event.type.replace("picklist_", "") + " [" + obj.type + ": " + stateMap.selectedMembers.join(", ") + "]");
    };

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
    // End event handler /onMemberPicklistChange/  

    onLoginSuccess = function (event, login_user) {
        stateMap.currentMember = login_user;
        console.log("current member for membership model=" + stateMap.currentMember.username);
        return false;

    }

    //-------------------- END EVENT HANDLERS --------------------
    //-------------------- START CALLBACKS  -------------------- 

    membershipCallback = function (error) {
        var $message;
        switch (stateMap.currentAction) {
            case configMap.actionTypes.list:
                $message = error ?
                        $("<span>Die Suche war nicht erfolgreich</span>") : $("<span>Das Ergebnis der Mitgliedschaftsuche:</span>");
                break;
            case configMap.actionTypes.create:
                $message = error ?
                        $("<span>Die 'Neuanlage' war nicht erfolgreich</span>") : $("<span> Es wurde eine neue Mitgliedschaft gespeichert.</span>");
                break;
            case configMap.actionTypes.update:
                $message = error ?
                        $("<span>Die  'Aendernung' war nicht erfolgreich</span>") : $("<span> Die Aenderung wurde gespeichert.</span>");
                break;
            case configMap.actionTypes.delete:
                $message = error ?
                        $("<span>Die Transaktion 'Entfernen' war nicht erfolgreich</span>") : $("<span> Die Mitgliedschaft wurde deaktiviert.</span>");
                break;
        }
        error ?
                aige.util.messageError($message) :
                aige.util.messageConfirm($message);


        listSelectedMembership();
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
        jqueryMap.$membershipMenu.on('click', onMenuMembership);
        jqueryMap.$membershipGroup.on("change", "#txtMembershipGroupYear", onChangeMembershipGroupEvent);
        jqueryMap.$adminMembershipList.on("click", "#btnDeleteMembership", onDeleteMembership);
        jqueryMap.$adminMembershipList.on("click", "#btnEditMembership", onEditMembership);
        jqueryMap.$membershipForm.on('submit', onSaveMembership);
        jqueryMap.$contentWrapper.on("click", "#buttonCreateMembership", onCreateMembership);
        jqueryMap.$membershipForm.on("click", "#buttonCloseMembership", closePopup);
        jqueryMap.$contentWrapper.on("click", "#overlay-bg", closePopup);
        jqueryMap.$memberPicklist.bind("picklist_onchange", onMemberPicklistChange);
        jqueryMap.$eventPicklist.bind("picklist_onchange", onEventPicklistChange);
        $.gevent.subscribe(jqueryMap.$contentWrapper, 'login-success', onLoginSuccess);

        $(window).resize(updatePopup());



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

