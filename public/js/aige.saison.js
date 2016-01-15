
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
                        + '<div id="buttonUpdateSaisonMembers" class="buttonCreate"> Saisondaten aktualisieren</div>'
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
        currentYear: null,
        selectedYear: null,
        currentSaisonMember: null,
        currentSaisonMemberName: null,
        checkboxNameValuePairMap: [],
        inputFieldHtmlMap: null

    },
    jqueryMap = {}, listSaison, onMenuSaison, onEditSaisonForMember, onDeleteSaison, onAddDeleteSaisonMembersAndEvents, onCreateSaison, onSaveSaisonForMember,
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

    /**
     * Prepares dynamically the form for saiosn events of a gicen member, incl.
     * setting of checkbox values.
     * 
     * 
     * @param {type} saisonEvents
     * @returns {undefined}
     */
    function prepareForm(saisonEvents) {
        stateMap.checkboxNameValuePairMap = [];
        var _saisonEvent, _eventName, eventConfirmedNameValuePair, eventTookpartNameValuePair,
                formArray = [], j = -1;
        jqueryMap.$saisonForm.find("ul").html("");
        formArray[++j] = '<li><label class="bigulLabel" for = "txtSaisonName"> Name: </label>';
        formArray[++j] = '<input type = "text" id = "txtSaisonName" name="name" readonly="true" disabled="true" /></li>';
        console.log("events: " + JSON.stringify(stateMap.currentSaisonMember.myEvents));
        for (var i = 0; i < saisonEvents.length; i++) {
            eventConfirmedNameValuePair = {};
            eventTookpartNameValuePair = {};
            _saisonEvent = saisonEvents[i];
            _eventName = _saisonEvent.eventName.replace(/ /g, '');
            console.log("event: " + JSON.stringify(_eventName));
            eventConfirmedNameValuePair[_eventName + "XYZconfirmed"] = _saisonEvent.confirmed;
            eventTookpartNameValuePair[_eventName + "XYZtookPart"] = _saisonEvent.tookPart;
            stateMap.checkboxNameValuePairMap.push(eventConfirmedNameValuePair);
            stateMap.checkboxNameValuePairMap.push(eventTookpartNameValuePair);

            formArray[++j] = '<li>';
            formArray[++j] = '<label class="bigulLabel" for =' + _saisonEvent.eventName + '>' + _saisonEvent.eventName + ': </label>';
            formArray[++j] = '<span> Angemeldet: </span>';
            formArray[++j] = '<input type = "checkbox"';
            formArray[++j] = 'id="' + _eventName + 'XYZconfirmed"';
            formArray[++j] = ' name="' + _eventName + 'XYZconfirmed"';
            formArray[++j] = '>';
            formArray[++j] = '<span> Teilgenommen: </span>';
            formArray[++j] = '<input type = "checkbox"';
            formArray[++j] = 'id="' + _eventName + 'XYZtookPart"';
            formArray[++j] = ' name="' + _eventName + 'XYZtookPart"';
            formArray[++j] = '>';
            formArray[++j] = '</li>';

        }
        stateMap.inputFieldHtmlMap = formArray.join('');

        console.log(" input fields =" + JSON.stringify(stateMap.inputFieldHtmlMap));
        assignValuesToCheckboxes(stateMap.checkboxNameValuePairMap);

    }


    /**
     * private method, called by  prepareFrom
     * Appends dynamically created form fields (li> to ul list, and afterwards sets values to these fields.
     * @returns {undefined}
     */
    function assignValuesToCheckboxes(checkboxNameValuePairMap) {
        var checkboxNameValuePair, checkboxName, $jquerySelector = jqueryMap.$saisonEditFormPopup;
        jqueryMap.$saisonForm.find("ul").append(stateMap.inputFieldHtmlMap);
        $jquerySelector.find("#txtSaisonName").val(stateMap.currentSaisonMemberName);
        for (var i = 0; i < checkboxNameValuePairMap.length; i++) {
            checkboxNameValuePair = checkboxNameValuePairMap [i];
            for (checkboxName in checkboxNameValuePair) {
                if (checkboxNameValuePair.hasOwnProperty(checkboxName)) {
                    console.log("checkbox name= " + checkboxName + " value" + checkboxNameValuePair[checkboxName]);
                    $jquerySelector.find("#" + checkboxName).prop('checked', checkboxNameValuePair[checkboxName]);
                    console.log("selector " + JSON.stringify($jquerySelector.find("#" + checkboxName)));
                }

            }
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

        $contentWrapper.append($(configMap.saison_html));
        $contentWrapper.append($(configMap.saison_form_html));

        var $saisonGroup = $contentWrapper.find('#saisonGroup'),
                $adminCurrentSaison = $contentWrapper.find('#currentSaison'),
                $saisonEditFormPopup = $contentWrapper.find('#saisonEdit');

        jqueryMap = {
            $content: $content,
            $contentWrapper: $contentWrapper,
            $saisonMenu: $menu.find('#admin_saison'),
            $saisonGroup: $saisonGroup,
            $overlay: $content.find("#overlay-bg"),
            $adminCurrentSaison: $adminCurrentSaison,
            $adminCurrentSaisonTableList: $adminCurrentSaison.find('#tblCurrentSaison tbody'),
            $adminCurrentSaisonTableHeader: $adminCurrentSaison.find('#tblCurrentSaison thead'),
            $saisonEditFormPopup: $saisonEditFormPopup,
            $saisonForm: $saisonEditFormPopup.find('#saisonForm')
        };
    };
    // End DOM method /setJqueryMap/


    /**
     * 
     * @returns {undefined}
     */
    listSaison = function () {
        console.log(" list saison");
        stateMap.currentSaison = configMap.general_model.getCurrentItem(configMap.object_type);
        console.log("current saison=" + JSON.stringify(stateMap.currentSaison));
        if (stateMap.currentSaison) {
            jqueryMap.$adminCurrentSaison.find('#buttonCreateSaison').hide();
            jqueryMap.$adminCurrentSaison.find('#buttonEditSaison').show();
            jqueryMap.$adminCurrentSaison.find('#buttonDeleteSaison').show();
            jqueryMap.$adminCurrentSaison.find('#buttonUpdateSaisonMembers').show();
            var events = stateMap.currentSaison.events,
                    memberList = stateMap.currentSaison.memberEvents,
                    membersLength = stateMap.currentSaison.memberEvents.length,
                    myMember, memberEvents, tblHeaders = "", bodyArray = [], j = -1, i = 0;
            jqueryMap.$contentWrapper.find("#headerSaison").text("Übersicht der Anmeldungen/Teilnahmen für:  " + stateMap.currentSaison.name);
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
                bodyArray[++j] = " <tr>";
                bodyArray[++j] = " <td><img src='../css/images/edit.png' alt='Edit" + myMember.memberName + "'";
                bodyArray[++j] = " id='btnEditSaison'  class='btnEdit'/></td>";
                bodyArray[++j] = " <td> <span class='username'>" + myMember.memberName + "</span></td>";
                for (var k = 0; k < memberEvents.length; k++) {
                    bodyArray[++j] = "<td><div><span> Angem.:</span>";
                    bodyArray[++j] = (memberEvents[k].confirmed ? configMap.imageActive : configMap.imageInactive);
                    bodyArray[++j] = "<span> Teilg.:</span>";
                    bodyArray[++j] = (memberEvents[k].tookPart ? configMap.imageActive : configMap.imageInactive);
                    bodyArray[++j] = "</div></td>";
                }
                bodyArray[++j] = "</tr>";
            }
            jqueryMap.$adminCurrentSaisonTableList.html("");
            jqueryMap.$adminCurrentSaisonTableList.html(bodyArray.join(''));

        } else {

            jqueryMap.$adminCurrentSaisonTableHeader.html("");
            jqueryMap.$adminCurrentSaisonTableList.html("");
            jqueryMap.$adminCurrentSaison.find('#buttonCreateSaison').show();
            jqueryMap.$adminCurrentSaison.find('#buttonEditSaison').hide();
            jqueryMap.$adminCurrentSaison.find('#buttonDeleteSaison').hide();
            jqueryMap.$adminCurrentSaison.find('#buttonUpdateSaisonMembers').hide();
            jqueryMap.$contentWrapper.find("#headerSaison").text("Keine Saisondaten vorhanden für   " + stateMap.selectedYear);
        }
        if (!stateMap.currentMember.isAdmin) {

            var rows = jqueryMap.$adminCurrentSaisonTableList.find("tr");
            rows.each(function (i, tr) {
                var username = $("span.username", tr).text();
                if (username === stateMap.currentMember.username) {
                    $(this).css({"backgroundColor": "#afc7e0", "color": "white"});
                }
            });
        }

        jqueryMap.$adminCurrentSaison.fadeIn(1000,"swing");


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
        stateMap.selectedYear = stateMap.currentYear;
        jqueryMap.$saisonGroup.find("#txtSaisonGroupYear").val(stateMap.currentYear);

        configMap.general_model.search(configMap.object_type, {searchParams: {year: stateMap.currentYear}}, saisonCallback);

        event.preventDefault();
        return false;
    };

    /**
     * 2 callbacks: one for membership retrieval, the other for saison creation.
     *  
     * @param {type} event
     * @returns {undefined|Boolean}
     */
    onCreateSaison = function (event) {

        if (stateMap.currentMember.isAdmin && stateMap.selectedYear >= stateMap.currentYear) {
            console.log(JSON.stringify(stateMap.selectedYear));
            console.log(JSON.stringify(stateMap.currentYear));
            configMap.general_model.search("membership", {searchParams: {year: stateMap.selectedYear}}, function (error) {
                stateMap.currentMembership = configMap.general_model.getCurrentItem("membership");
                if (error || !stateMap.currentMembership) {
                    aige.util.messageConfirm($("<span>Bitte zunächst eine Mitgliedschaft anlegen für " + stateMap.selectedYear + "</span>"));
                    return false;
                }
                configMap.saison_model.createSaison(stateMap.currentMembership, function (error) {
                    stateMap.currentSaison = configMap.general_model.getCurrentItem(configMap.object_type);
                    if (error || !stateMap.currentSaison) {
                        aige.util.messageError($("<span>Die Transaktion 'Neuanlag Saison' war nicht erfolgreich</span>"));
                        return false;
                    }

                    aige.util.messageConfirm($("<span>Die Transaktion 'Neuanlage' war erfolgreich</span>"));
                    listSaison();
                });
            });
        } else {
            var $message = $("<span> Du hast keine Berechtigung oder die Saison ist abgelaufen und darf nicht mehr neu erstelltt werden</span>")
            aige.util.messageConfirm($message);
        }
        return false;
    };



    /**
     * 
     * @returns {Boolean}
     */
    onAddDeleteSaisonMembersAndEvents = function () {
        console.log("on upate saison");
        if (stateMap.currentMember.isAdmin && stateMap.selectedYear >= stateMap.currentYear) {
            var searchParams = {searchParams: {year: stateMap.selectedYear}};
            stateMap.currentAction = configMap.actionTypes.update;
            stateMap.saveIsEdit = true;

            configMap.saison_model.deleteSaisonEventsAndMembers(searchParams, function (error) {
                console.log("saisonCallback ..");
                var $message;
                if (error) {
                    $message = $("<span>Das Entfernen war nicht erfolgreich</span>");
                    aige.util.messageError($message);
                } else {
                    $message = $("<span>Einträge wurden entfernt..... Hinzufügen folgt jetzt.</span>");
                    aige.util.messageConfirm($message);
                }
                listSaison();
                setTimeout(function () {
                    configMap.saison_model.addSaisonEventsAndMembers(searchParams, saisonCallback);
                    event.preventDefault();
                    return false;
                }, 3000);
            });
        } else {
            var $message = $("<span> Du hast keine Berechtigung</span>")
            aige.util.messageConfirm($message);
        }

    };
    /**
     * 
     * @param {type} event
     * @returns {Boolean}
     */
    onDeleteSaison = function (event) {
        if (stateMap.currentMember.isAdmin && stateMap.selectedYear >= stateMap.currentYear) {
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
        } else {
            var $message = $("<span> Du hast keine Berechtigung oder die Saison ist abgelaufen und darf nicht mehr gelöscht werden</span>")
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
    onEditSaisonForMember = function (event) {
        console.log("on edit saison");

        stateMap.currentAction = configMap.actionTypes.update;
        stateMap.saveIsEdit = true;
        stateMap.currentSaisonMemberName = $(this).attr("alt").replace("Edit", "");
        if ((stateMap.currentMember.isAdmin || stateMap.currentSaisonMemberName === stateMap.currentMember.username) && stateMap.selectedYear >= stateMap.currentYear) {
            configMap.saison_model.getSaisonEventsByName(stateMap.currentSaisonMemberName, function (memberSaison) {
                stateMap.currentSaisonMember = memberSaison;
                prepareForm(stateMap.currentSaisonMember.saisonEvents);
                jqueryMap.$saisonEditFormPopup.find("#headerSaisonFormPopup").text("Saisondaten aendern:");
                jqueryMap.$overlay.fadeIn();
                updatePopup();
                jqueryMap.$saisonEditFormPopup.fadeIn();
            });
        } else {
            var $message = $("<span> Du hast keine Berechtigung oder die Saison ist abgelaufen und darf nicht mehr verändert werden</span>")
            aige.util.messageConfirm($message);
        }

        return false;
    };




    onSaveSaisonForMember = function (event) {
        console.log("on save saison for member");
        // log form params
        console.log("formParams=" + JSON.stringify($(this).serializeArray()));
        var memberName = stateMap.currentSaisonMemberName,
                clone = (JSON.parse(JSON.stringify(stateMap.checkboxNameValuePairMap))),
                formKeyValues = aige.util.fetchFormKeyValues($(this));

        configMap.saison_model.updateSaisonEventsForMember(stateMap.currentSaison._id, stateMap.currentSaison.year, memberName, formKeyValues, clone, saisonCallback);

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
     
        stateMap.currentSaison = null;
        stateMap.currentSaisonMember = null;
        stateMap.currentSaisonMemberName = null;
        stateMap.currentMembership = null;
        stateMap.currentAction = configMap.actionTypes.list;
        stateMap.selectedYear = jqueryMap.$saisonGroup.find('#txtSaisonGroupYear').val();
   var searchParams = {searchParams: {year: stateMap.selectedYear}};

        configMap.general_model.search("membership", searchParams, function (error) {
            if (error) {
                aige.util.messageError($("<span>Die Suche  war nicht erfolgreich</span>"));
                return false;

            }
            stateMap.currentMembership = configMap.general_model.getCurrentItem("membership");
            configMap.general_model.search(configMap.object_type, searchParams, saisonCallback);
            event.preventDefault();
            return false;

        });

    };
    //-------------------- END EVENT HANDLERS --------------------
    //-------------------- START CALLBACKS  -------------------- 

    saisonCallback = function (error) {
        console.log("saisonCallback ..");
        var $message;
        if (error) {
            if (stateMap.currentAction === configMap.actionTypes.list) {
                $message = $("<span>Die Suche  war nicht erfolgreich</span>");
            } else if (stateMap.currentAction === configMap.actionTypes.create) {
                $message = $("<span>Die Transaktion 'Neuanlage' war nicht erfolgreich</span>");
            } else if (stateMap.currentAction === configMap.actionTypes.update) {
                $message = $("<span>Die Transaktion 'Aendern' war nicht erfolgreich</span>");
            } else if (stateMap.currentAction === configMap.actionTypes.delete) {
                $message = $("<span>Die Transaktion 'Entfernen' war nicht erfolgreich</span>");
            }
   
        } else {
            if (stateMap.currentAction === configMap.actionTypes.list) {
                $message = $("<span>Das Ergebnis der Saisonsuche:</span>");
            } else if (stateMap.currentAction === configMap.actionTypes.create) {
                $message = $("<span> Es wurde eine neue Saison gespeichert.</span>");
            } else if (stateMap.currentAction === configMap.actionTypes.update) {
                $message = $("<span> Die Aenderung wurde gespeichert.</span>");
            } else if (stateMap.currentAction === configMap.actionTypes.delete) {
                $message = $("<span> Die Saison wurde deaktiviert.</span>");
            }

         
        }
       error ?
                aige.util.messageError($message) :
                aige.util.messageConfirm($message);

        listSaison();
    };

    onLoginSuccess = function (event, login_user) {
        stateMap.currentMember = login_user;
        console.log("current member for saison model=" + stateMap.currentMember.username);
        return false;

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
        jqueryMap.$adminCurrentSaison.on("click", "#btnEditSaison", onEditSaisonForMember);

        jqueryMap.$adminCurrentSaison.on("click", "#buttonUpdateSaisonMembers", onAddDeleteSaisonMembersAndEvents);
        jqueryMap.$saisonForm.on('submit', onSaveSaisonForMember);
        jqueryMap.$saisonForm.on("click", "#buttonCloseSaison", closePopup);
        jqueryMap.$content.on("click", "#overlay-bg", closePopup);
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

