
/*
 * aige.saison.js
 * Si
 * Saison feature module for AIGE
 */
/*jslint         browser : true, continue : true,
 devel  : true, indent  : 2,    maxerr   : 50,
 newcap : true, nomen   : true, plusplus : true,
 regexp : true, sloppy  : true, vars     : false,
 white  : true
 */

/*global $, aige */

aige.saison = (function () {

//---------------- BEGIN MODULE SCOPE VARIABLES --------------
    var
            configMap = {
                membership_list_html: String()
                        + '<div id="currentMembership" class="aige-admin-member-list">'

                        + '<table id="tblCurrentMembership" class="tblList">'
                        + '<thead><tr>'
                        + '<th>Name</th><th>Jahr</th><th>Mitglieder</th>'
                        + '<th>Ereignisse</th><th>Kommentar</th><th>aktiv</th>'
                        + '</tr></thead><tbody></tbody>'
                        + '</table>'
                        + '</div>',
                saison_html: String()
                        + '<div id="currentSaison" class="aige-admin-member-list">'
                        + '<div id="saisonGroup" class="buttonCreate">'
                        + '<form id = "saisonGroupForm">'
                        + '<input type = "hidden" id = "txtSaisonGroupID"/>'
                        + '<label for = "txtSaisonGroupYear"> Jahr: </label>'
                        + '<select id="txtSaisonGroupYear" name="saisonGroupYear">'
                        + '<option >2014</option>'
                        + '<option >2015</option>'
                        + '<option>2016</option>'
                        + '<option>2017</option>'
                        + '<option>2018</option>'
                        + '<option>2019</option>'
                        + '</select>'
                        + '</form>'
                        + '</div>'
                        + '<div id="buttonCreateSaison" class="buttonCreate"> Neue Saison anlegen</div>'
                        + '<div id="buttonDeleteSaison" class="buttonCreate"> Saison loeschen</div>'
                        + '<div id="buttonAddDeleteSaison" class="buttonCreate"> Saisondaten ändern</div>'
                        + '<h3 id="headerSaison" style="text-align:center;"></h3>'

                        + '<table id="tblCurrentSaison" class="tblList">'
                        + '<thead></thead><tbody></tbody>'
                        + '</table>'

                        + '</div>',
                saison_form_html: String()
                        + '<div id="saisonEdit" class="aige-admin-member-add-edit">'
                        + '<h2 id="headerSaisonFormPopup" style="text-align:center;"></h2>'
                        + '<form id = "saisonForm">'
                        + '<ul></ul>'
                        + '<div>'
                        + '<input type = "submit" value = "Speichern" id = "addEditSaisonSave">'
                        + '<input id="buttonCloseSaison" class="buttonClose" type="button" value="Close Popup" />'
                        + '</div>'
                        + '</form>'
                        + '</div>',
                saison_add_delete_form_html: String()
                        + '<div id="saisonAddDelete" class="aige-admin-member-add-edit">'
                        + '<h2 id="saisonAddDeleteFormPopup" style="text-align:center;"></h2>'
                        + '<form id = "saisonAddDeleteForm">'
                        + '<ul>'
                        + '<input type = "hidden" id = "txtSaisonAddDeleteFormID"/>'
                        + '<li>'
                        + '<label for = "txtSaisonAddDeleteFormName"> Name: </label>'
                        + '<input type = "text" id = "txtSaisonAddDeleteFormName" name="name"  readonly="readonly" />'
                        + '</li><li>'
                        + '<label for = "txtSaisonAddDeleteFormYear"> Jahr: </label>'
                        + '<input type = "text" id = "txtSaisonAddDeleteFormYear" name ="year" readonly="readonly"/>'
                        + '</li><li>'
                        + '<label for = "txtSaisonAddDeleteFormMemberPicklist"> Mitglieder: </label>'
                        + '<select id="txtSaisonAddDeleteFormMemberPicklist" name="SaisonAddDeleteFormMemberPicklist" multiple="multiple">'
                        + '</select>'
                        + '</li><li>'
                        + '<label for = "txtSaisonAddDeleteFormEventPicklist"> Ereignisse: </label>'
                        + '<select id="txtSaisonAddDeleteFormEventPicklist" name="SaisonAddDeleteFormEventPicklist" multiple="multiple">'
                        + '</select>'
                        + ' </li></ul>'
                        + '<div>'
                        + '<input type = "submit" value = "Speichern" id = "SaisonAddDeleteFormSave">'
                        + '<input id="buttonCloseSaisonAddDeleteForm" class="buttonClose" type="button" value="Close Popup" />'
                        + '</div>'
                        + '</form>'
                        + '</div>',
                imageActive: "<img src='../css/images/boxSelected.gif' alt='Aktiv' style='margin-left:5px;'/>",
                imageInactive: "<img src='../css/images/boxUnselected.gif' alt='Aktiv' style='margin-left:5px; margin-right:5px;'/>",
                settable_map: {
                    general_model: true,
                    saison_model: true,
                    membership_model: true,
                    actionTypes: true
                },
                general_model: null,
                saison_model: null,
                membership_model: null,
                object_type: "saison",
                actionTypes: null
            },
    stateMap = {
        $shellcontainer: null,
        saveIsEdit: true,
        currentAction: "",
        currentMember: null,
        currentMembership: null,
        currentSaison: null,
        currentSaisonMember: null,
        currentSaisonMemberName: null,
        checkboxNameValuePairMap: [],
        inputFieldHtmlMap: null,
        pickedMembers: [],
        pickedEvents: []

    },
    jqueryMap = {}, listCurrentmembership, findSaison, listSaison, onMenuSaison, onEditSaison, onDeleteSaison, onAddDeleteSaison, onCreateSaison, onSaveSaison,
            saisonCallback, setJqueryMap, configModule, initModule, onLoginSuccess;
    //----------------- END MODULE SCOPE VARIABLES ---------------

    //------------------- BEGIN UTILITY METHODS ------------------


    function updatePopup() {
        var $popupContent = jqueryMap.$saisonEditFormPopup,
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
        jqueryMap.$saisonEditFormPopup.fadeOut();
        jqueryMap.$overlay.fadeOut();
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
        $contentWrapper.append($(configMap.saison_html));
        $contentWrapper.append($(configMap.saison_form_html));
        $contentWrapper.append($(configMap.saison_add_delete_form_html));

        var $saisonGroup = $contentWrapper.find('#saisonGroup');
        var $adminCurrentMembership = $contentWrapper.find('#currentMembership'),
                $adminCurrentSaison = $contentWrapper.find('#currentSaison'),
                $saisonEditFormPopup = $contentWrapper.find('#saisonEdit'),
                $saisonAddDeleteFormPopup = $contentWrapper.find('#saisonAddDelete');

        var $memberPicklist = $saisonAddDeleteFormPopup.find("#txtMemberPicklist").pickList({
            "sourceListLabel": "Verfügbar",
            "targetListLabel": "Ausgewählt"
        });

        var $eventPicklist = $saisonAddDeleteFormPopup.find("#txtEventPicklist").pickList({
            "sourceListLabel": "Verfügbar",
            "targetListLabel": "Ausgewählt"
        });
        jqueryMap = {
            $content: $content,
            $contentWrapper: $contentWrapper,
            $saisonMenu: $menu.find('#admin_saison'),
            $saisonGroup: $saisonGroup,
            $overlay: $content.find("#overlay-bg"),
            $adminCurrentMembership: $adminCurrentMembership,
            $adminCurrentMembershipTableList: $adminCurrentMembership.find('#tblCurrentMembership tbody'),
            $adminCurrentSaison: $adminCurrentSaison,
            $adminCurrentSaisonTableList: $adminCurrentSaison.find('#tblCurrentSaison tbody'),
            $adminCurrentSaisonTableHeader: $adminCurrentSaison.find('#tblCurrentSaison thead'),
            $saisonEditFormPopup: $saisonEditFormPopup,
            $saisonAddDeleteFormPopup: $saisonAddDeleteFormPopup,
            $memberPicklist: $memberPicklist,
            $eventPicklist: $eventPicklist,
            $saisonForm: $contentWrapper.find('#saisonForm'),
            $saisonAddDeleteForm: $contentWrapper.find('#saisonAddDeleteForm')

        };
    };
    // End DOM method /setJqueryMap/


    /**
     * 
     * @returns {undefined}
     */
    listSaison = function () {
        console.log(" list saison");
        stateMap.currentSaison = configMap.saison_model.getCurrentSaison();
        if (stateMap.currentSaison) {
            jqueryMap.$adminCurrentSaison.find('#buttonCreateSaison').hide();
            jqueryMap.$adminCurrentSaison.find('#buttonEditSaison').show();
            jqueryMap.$adminCurrentSaison.find('#buttonDeleteSaison').show();
            var events = stateMap.currentSaison.events,
                    memberList = stateMap.currentSaison.memberEvents,
                    membersLength = stateMap.currentSaison.memberEvents.length,
                    myMember, memberEvents, tblHeaders = "", bodyArray = [], j = -1, i = 0;
            jqueryMap.$contentWrapper.find("#headerSaison").text("Übersicht der Anmeldungen/Teilnahmen für die Saison  " + stateMap.currentSaison.name);
            // construct table headers  dynamically (based on # events)
            jqueryMap.$adminCurrentSaisonTableHeader.html("");
            tblHeaders = "<tr><th></th><th id= 'tblHeaderName'>Name</th>";
            for (i = 0; i < events.length; i++) {
                tblHeaders = tblHeaders + ('<th>' + events[i] + '</th>');
            }
            tblHeaders = tblHeaders + "</tr>";
            jqueryMap.$adminCurrentSaisonTableHeader.append($(tblHeaders));
            // construct table body
            for (i = 0; i < membersLength; i++) {
                myMember = memberList[i];
                memberEvents = myMember.saisonEvents;
                bodyArray[++j] = " <tr >";
                bodyArray[++j] = " <td><img src='../css/images/edit.png' alt='Edit" + myMember.memberName + "'";
                bodyArray[++j] = " id='btnEditSaison'  class='btnEdit'/></td>";
                bodyArray[++j] = " <td> <span class='username'>" + myMember.memberName + "</span></td>";
                for (var k = 0; k < memberEvents.length; k++) {
                    bodyArray[++j] = "<td><div><span> c:</span>";
                    bodyArray[++j] = (memberEvents[k].confirmed ? configMap.imageActive : configMap.imageInactive);
                    bodyArray[++j] = "<span> t:</span>";
                    bodyArray[++j] = (memberEvents[k].tookPart ? configMap.imageActive : configMap.imageInactive);
                    bodyArray[++j] = "</div></td>";
                }
                bodyArray[++j] = "</tr>";
            }
            jqueryMap.$adminCurrentSaisonTableList.html("");
            jqueryMap.$adminCurrentSaisonTableList.html(bodyArray.join(''));

        }
        else {

            jqueryMap.$adminCurrentSaisonTableHeader.html("");
            jqueryMap.$adminCurrentSaisonTableList.html("");
            jqueryMap.$adminCurrentSaison.find('#buttonCreateSaison').show();
            jqueryMap.$adminCurrentSaison.find('#buttonEditSaison').hide();
            jqueryMap.$adminCurrentSaison.find('#buttonDeleteSaison').hide();
            jqueryMap.$contentWrapper.find("#headerSaison").text("Keine Saisondaten für   " + stateMap.currentYear);
        }
        if (!stateMap.currentMember.isAdmin) {
            console.log("User is not an admin");
            var rows = jqueryMap.$adminCurrentSaisonTableList.find("tr");
            rows.each(function (i, tr) {
                var username = $("span.username", tr).text();
                if (username === stateMap.currentMember.username) {
                    $(this).css({"backgroundColor": "#afc7e0", "color": "white"});
                }
            });
        }

        jqueryMap.$adminCurrentSaison.fadeIn();


    };
//---------------------- END DOM METHODS ---------------------

//------------------- BEGIN EVENT HANDLERS -------------------


    onMenuSaison = function (event) {
        jqueryMap.$contentWrapper.children().hide();
        stateMap.currentSaison = null;
        stateMap.currentSaisonMember = null;
        stateMap.currentSaisonMemberName = null;
        stateMap.currentMembership = null;
        stateMap.currentAction = configMap.actionTypes.list;
        stateMap.currentYear = new Date().getFullYear().toString();
        jqueryMap.$saisonGroup.find("#txtSaisonGroupYear").val(stateMap.currentYear);

        var searchParams = {searchParams: {year: stateMap.currentYear}};

        configMap.general_model.search("membership", searchParams, function (error) {
            if (error) {
                aige.util.messageError($("<span>Die Suche  war nicht erfolgreich</span>"));
                return false;

            }
            stateMap.currentMembership = configMap.membership_model.getCurrentMembership();
            configMap.general_model.search(configMap.object_type, searchParams, saisonCallback);
        });
        event.preventDefault();
        return false;
    };

    /**
     * 
     * @param {type} event
     * @returns {undefined|Boolean}
     */
    onCreateSaison = function (event) {
        console.log("on create saison" + JSON.stringify(stateMap.currentMembership));
        if (stateMap.currentMember.isAdmin) {
            if (!stateMap.currentMembership) {
                aige.util.messageConfirm($("<span>Bitte zunächst eine Mitgliedschaft anlegen für " + stateMap.currentYear + "</span>"));
                return;
            }

            configMap.saison_model.createSaison(stateMap.currentMembership, function (error) {
                if (error) {
                    aige.util.messageError($("<span>Die Transaktion 'Neuanlage' war nicht erfolgreich</span>"));
                    return false;
                }
                stateMap.currentSaison = configMap.saison_model.getSaisonByMembershipId(stateMap.currentMembership._id);
                aige.util.messageConfirm($("<span>Die Transaktion 'Neuanlage' war erfolgreich</span>"));
                listSaison();
            });
        } else {
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
    onDeleteSaison = function (event) {
        if (stateMap.currentMember.isAdmin) {
            stateMap.currentAction = configMap.actionTypes.delete;
            if (!confirm("Willst Du wirklich [" + stateMap.currentSaison.name + "] loeschen?")) {
                return false;
            }
            configMap.general_model.deleteItem(configMap.object_type, stateMap.currentSaison._id, function (error) {
                if (error) {
                    aige.util.messageError($("<span>Die Transaktion 'Saison entfernen' war nicht erfolgreich</span>"));
                    return false;
                }
                stateMap.currentSaison = null;
                stateMap.currentSaisonMember = null;
                stateMap.currentSaisonMemberName = null;
                aige.util.messageConfirm($("<span>Die Transaktion 'Saison entfernen' war erfolgreich</span>"));

                listSaison();
            });
        }
        else {
            var $message = $("<span> Du hast keine Berechtigung</span>")
            aige.util.messageConfirm($message);
        }
        event.preventDefault();
        return false;
    };
    /**
     * Fetches the saison data for a given member and creates the form for display;
     * @param {type} event
     * @returns {Boolean}
     */
    onEditSaison = function (event) {
        console.log("on edit saison");

        stateMap.currentAction = configMap.actionTypes.update;
        stateMap.saveIsEdit = true;
        stateMap.currentSaisonMemberName = $(this).attr("alt").replace("Edit", "");
        if (stateMap.currentMember.isAdmin || stateMap.currentSaisonMemberName === stateMap.currentMember.username) {
            configMap.saison_model.getSaisonForMember(stateMap.currentSaisonMemberName, function (memberSaison) {
                stateMap.currentSaisonMember = memberSaison;
                prepareForm();
            });
            jqueryMap.$saisonEditFormPopup.find("#headerSaisonFormPopup").text("Saisondaten aendern:");
            jqueryMap.$overlay.fadeIn();
            updatePopup();
            jqueryMap.$saisonEditFormPopup.fadeIn();

        }
        else {
            var $message = $("<span> Du hast keine Berechtigung</span>")
            aige.util.messageConfirm($message);
        }

        return false;
    };

    /**
     * 
     * private method, called by on edit saison.
     * 
     * @returns {undefined}
     */
    function prepareForm() {
        stateMap.checkboxNameValuePairMap = [];
        var i = 0, myEvent, myEventName, eventConfirmedNameValuePair, eventTookpartNameValuePair,
                formArray = [], j = -1;
        jqueryMap.$saisonForm.find("ul").html("");
        formArray[++j] = '<li>';
        formArray[++j] = '<label class="bigulLabel" for = "txtSaisonName"> Name: </label>';
        formArray[++j] = '<input type = "text" id = "txtSaisonName" name="name" readonly="true" disabled="true" />';
        formArray[++j] = ' </li>';
        //   console.log("events: "+JSON.stringify(stateMap.currentSaisonMember.myEvents));    
        for (i = 0; i < stateMap.currentSaisonMember.saisonEvents.length; i++) {
            eventConfirmedNameValuePair = {};
            eventTookpartNameValuePair = {};
            myEvent = stateMap.currentSaisonMember.saisonEvents[i];
            myEventName = myEvent.eventName.replace(/ /g, '');



            eventConfirmedNameValuePair[myEventName + "XYZconfirmed"] = myEvent.confirmed;
            eventTookpartNameValuePair[myEventName + "XYZtookPart"] = myEvent.tookPart;
            stateMap.checkboxNameValuePairMap.push(eventConfirmedNameValuePair);
            stateMap.checkboxNameValuePairMap.push(eventTookpartNameValuePair);

            formArray[++j] = '<li>';
            formArray[++j] = '<label class="bigulLabel" for =' + myEvent.eventName + '>' + myEvent.eventName + ': </label>';
            formArray[++j] = '<span> confirmed: </span>';
            formArray[++j] = '<input type = "checkbox"';
            formArray[++j] = 'id="' + myEventName + 'XYZconfirmed"';
            formArray[++j] = ' name="' + myEventName + 'XYZconfirmed"';
            formArray[++j] = '>';
            formArray[++j] = '<span> took part: </span>';
            formArray[++j] = '<input type = "checkbox"';
            formArray[++j] = 'id="' + myEventName + 'XYZtookPart"';
            formArray[++j] = ' name="' + myEventName + 'XYZtookPart"';
            formArray[++j] = '>';
            formArray[++j] = '</li>';

        }
        stateMap.inputFieldHtmlMap = formArray.join('');

        console.log(" input fields =" + JSON.stringify(stateMap.inputFieldHtmlMap));
        fillPreparedForm();

    }


    /**
     * private method, called by  prepareFrom
     * Appends dynamically created form fields (li> to ul list, and afterwards sets values to these fields.
     * @returns {undefined}
     */
    function fillPreparedForm() {
        var i = 0, checkboxNameValuePair, checkboxName, $jquerySelector = jqueryMap.$saisonEditFormPopup;
        jqueryMap.$saisonForm.find("ul").append(stateMap.inputFieldHtmlMap);
        $jquerySelector.find("#txtSaisonName").val(stateMap.currentSaisonMemberName);
        for (i = 0; i < stateMap.checkboxNameValuePairMap.length; i++) {
            checkboxNameValuePair = stateMap.checkboxNameValuePairMap [i];
            for (checkboxName in checkboxNameValuePair) {
                if (checkboxNameValuePair.hasOwnProperty(checkboxName)) {
                    console.log("cheker name= " + checkboxName + " value" + checkboxNameValuePair[checkboxName]);
                    $jquerySelector.find("#" + checkboxName).prop('checked', checkboxNameValuePair[checkboxName]);
                    console.log("selector " + JSON.stringify($jquerySelector.find("#" + checkboxName)));
                }

            }
        }
    }
    onAddDeleteSaison = function () {
        console.log("on AddDeleteSaison saison");
        if (stateMap.currentMember.isAdmin) {
         var inactiveMembers, inactiveEvents,
                    searchParams = {searchParams: {year: stateMap.currentYear}};

            stateMap.currentAction = configMap.actionTypes.update;
            stateMap.saveIsEdit = true;
        }
        else {
            var $message = $("<span> Du hast keine Berechtigung</span>")
            aige.util.messageConfirm($message);
        }
        event.preventDefault();
        return false;
    };

    onSaveSaison = function (event) {
        console.log("on save saison");
        // log form params
        console.log("formParams=" + JSON.stringify($(this).serializeArray()));
        var memberName = stateMap.currentSaisonMemberName,
                clone = (JSON.parse(JSON.stringify(stateMap.checkboxNameValuePairMap))),
                formKeyValues = aige.util.fetchFormKeyValues($(this));

        configMap.saison_model.updateMemberEvents(stateMap.currentSaison._id, memberName, formKeyValues, clone, saisonCallback);

        jqueryMap.$saisonEditFormPopup.fadeOut();
        jqueryMap.$overlay.fadeOut();
        event.preventDefault();
    };
    /**
     * Is fired if option list with years as options repersenting an event group is changed.
     * 
     * @param {type} event
     * @returns {false}
     */
    onChangeSaisonGroupEvent = function (event) {
        stateMap.currentAction = configMap.actionTypes.list;
        stateMap.currentYear = jqueryMap.$saisonGroup.find('#txtSaisonGroupYear').val();
        var searchParams = {searchParams: {year: stateMap.currentYear}};
        configMap.general_model.search("membership", searchParams, function (error) {
            if (error) {
                aige.util.messageError($("<span>Die Suche  war nicht erfolgreich</span>"));
                return false;

            }
            stateMap.currentMembership = configMap.membership_model.getCurrentMembership();
            configMap.general_model.search(configMap.object_type, searchParams, saisonCallback);
        });

        event.preventDefault();
        return false;
    };
    //-------------------- END EVENT HANDLERS --------------------
    //-------------------- START CALLBACKS  -------------------- 

    saisonCallback = function (error) {
        console.log("saisonCallback ..");
        var $message;
        if (error) {
            if (stateMap.currentAction === configMap.actionTypes.list) {
                $message = $("<span>Die Suche  war nicht erfolgreich</span>");
            }
            else if (stateMap.currentAction === configMap.actionTypes.create) {
                $message = $("<span>Die Transaktion 'Neuanlage' war nicht erfolgreich</span>");
            }
            else if (stateMap.currentAction === configMap.actionTypes.update) {
                $message = $("<span>Die Transaktion 'Aendern' war nicht erfolgreich</span>");
            }
            else if (stateMap.currentAction === configMap.actionTypes.delete) {
                $message = $("<span>Die Transaktion 'Entfernen' war nicht erfolgreich</span>");
            }
            aige.util.messageError($message);
        }
        else {
            if (stateMap.currentAction === configMap.actionTypes.list) {
                $message = $("<span>Das Ergebnis der Saisonsuche:</span>");
            }
            else if (stateMap.currentAction === configMap.actionTypes.create) {
                $message = $("<span> Es wurde eine neue Saison gespeichert.</span>");
            }
            else if (stateMap.currentAction === configMap.actionTypes.update) {
                $message = $("<span> Die Aenderung wurde gespeichert.</span>");
            }
            else if (stateMap.currentAction === configMap.actionTypes.delete) {
                $message = $("<span> Die Saison wurde deaktiviert.</span>");
            }

            aige.util.messageConfirm($message);
        }

        listSaison();
    };
    onEventPicklistChange = function (event) {

        stateMap.pickedEvents = [];
        var items = jqueryMap.$eventPicklist.closest("li").find('.pickList_targetList').children('li');
        items.each(function () {
            stateMap.pickedEvents.push($(this).data('value'));
        });
        //    console.log(event.type.replace("picklist_", "") + " [" + obj.type + ": " + stateMap.selectedMembers.join(", ") + "]");
    };
    onMemberPicklistChange = function (event) {

        stateMap.pickedMembers = [];
        var items = jqueryMap.$memberPicklist.closest("li").find('.pickList_targetList').children('li');
        items.each(function () {
            stateMap.pickedMembers.push($(this).data('value'));
        });
        //    console.log(event.type.replace("picklist_", "") + " [" + obj.type + ": " + stateMap.selectedMembers.join(", ") + "]");
    };

    onLoginSuccess = function (event, login_user) {
        stateMap.currentMember = login_user;
        console.log("current member for saison model=" + stateMap.currentMember.username);
        return false;

    }



    function addItemsToPicklist(picklist, items, isRegistered) {

        for (var i = 0; i < items.length; i++) {
            var param = {value: items[i],
                label: items[i],
                selected: isRegistered};
            picklist.pickList("insert", param);
        }
    }
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
        jqueryMap.$saisonMenu.on('click', onMenuSaison);
        jqueryMap.$saisonGroup.on("change", onChangeSaisonGroupEvent);

        jqueryMap.$adminCurrentSaison.on("click", "#buttonDeleteSaison", onDeleteSaison);
        jqueryMap.$adminCurrentSaison.on("click", "#buttonCreateSaison", onCreateSaison);
        jqueryMap.$adminCurrentSaison.on("click", "#btnEditSaison", onEditSaison);
        jqueryMap.$adminCurrentSaison.on("click", "#buttonAddDeleteSaison", onAddDeleteSaison);
        jqueryMap.$saisonForm.on('submit', onSaveSaison);
        jqueryMap.$saisonForm.on("click", "#buttonCloseSaison", closePopup);
        jqueryMap.$content.on("click", "#overlay-bg", closePopup);

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

