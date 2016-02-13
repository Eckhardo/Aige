/*
 * aige.member.js
 * Controller  for browser feature module member
 *
 * db.member.update({'username': 'Ecki'}, {$set: {'isAdmin':'true'} });
 */


/*jslint         browser : true, continue : true,
 devel  : true, indent  : 2,    maxerr   : 50,
 newcap : true, nomen   : true, plusplus : true,
 regexp : true, sloppy  : true, vars     : false,
 white  : true
 */

/*global $, aige */

aige.member = (function () {

//---------------- BEGIN MODULE SCOPE VARIABLES --------------
    var configMap = {
      
        member_list_html: String()
                + '<div id= "memberList" class="aige-admin-member-list" style="height:40em;  overflow:auto;">'
                + '<div id="btnCreateMember" class="buttonCreate"> Neu anlegen</div>'

                + '<table id="tblMemberList" class="tblList">'
                + '<thead><tr><th></th><th></th>'
                + '<th>Vorname</th><th>Nachname</th><th>Benutzername</th>'
                + '<th>Email</th><th>PLZ</th><th>Wohnort</th><th>Addresse</th>'
                + '<th>Tel</th><th>Mobil</th><th>Mitglied seit</th></th><th>aktiv</th>'
                + '</tr></thead><tbody></tbody>'
                + '</table>'
                + '</div>',
        member_form_html: String()
                + '<div id="memberAddEdit" class="aige-admin-member-add-edit">'
                + '<h2 id="headerMemberFormPopup" style="text-align:center;"></h2>'
                + '<form id = "memberForm">'
                + '<ul>'
                + '<input type = "hidden" id = "txtID"/>'
                + '<input type = "hidden" id = "txtIsAdmin"/>'
                + '<li>'
                + '<label for = "txtVorname"> Vorname: </label>'
                + '<input type = "text" id = "txtVorname" name="firstname"/>'
                + '</li>'
                + '<li>'
                + '<label for = "txtNachname"> Nachname: </label>'
                + '<input type = "text" id = "txtNachname" name="lastname" />'
                + '</li>'
                + '<li>'
                + '<label for = "txtUsername"> Benutzername: </label>'
                + '<input type = "text" id = "txtUsername" name ="username"/>'
                + '</li>'
                + '<li>'
                + '<label for = "txtEmail"> Email: </label>'
                + '<input type = "text" id = "txtEmail" name="email"/>'
                + '</li>'
                + '<li>'
                + '<label for = "txtZip"> PLZ: </label>'
                + '<input type = "text" id = "txtZip" name="zip" />'
                + '</li>'
                + '<li>'
                + '<label for = "txtCity"> Ort: </label>'
                + '<input type = "text" id = "txtCity"name="city" />'
                + '</li>'
                + '<li>'
                + '<label for = "txtAddress"> Addresse: </label>'
                + '<input type = "text" id = "txtAddress" name="address" />'
                + '</li>'
                + '<li>'
                + '<label for = "txtPhone"> Tel (Fest): </label>'
                + '<input type = "text" id = "txtPhone" name="phone"/>'
                + '</li>' + '<li>'
                + '<label for = "txtMobil"> Tel (Mobil): </label>'
                + '<input type = "text" id = "txtMobil"name="mobil" />'
                + '</li> <li>'
                + '<label for = "txtAdmissionDate"> Mitglied seit: </label>'
                + '<input type = "text" id = "txtAdmissionDate" name="admissionDate"/>'
                + '</li> <li>'
                + '<label for = "txtIsActive"> Aktiv: </label>'
                + '<input type = "checkbox" id = "txtIsActive"/>'
                + '</li></ul>'
                + '<div>'
                + '<input type = "submit" value = "Speichern" id = "addEditMemberSave">'
                + '<input id="btnCloseMember" class="buttonClose" type="button" value="Close Popup" />'
                + '</div>'
                + '</form>'
                + '</div>',
        imageActive: "<img src='../css/images/boxSelected.gif' alt='Aktiv'/>",
        imageInactive: "<img src='../css/images/boxUnselected.gif' alt='Aktiv'/>",
        settable_map: {
            general_model: true,
            member_model: true,
            actionTypes: true
        },
        general_model: null,
        member_model: null,
        object_type: "member",
        actionTypes: null
    },
    stateMap = {
        $shellcontainer: null,
        selectedMemberId: -1,
        currentMember: null,
        memberList: [],
        saveIsEdit: true,
        currentAction: ""
    },
    jqueryMap = {}, listMembers, onMenuMember, onEditMember, onDeleteMember, onCreateMember, onSaveMember, onLoginSuccess,
            memberCallback,
            setJqueryMap, configModule, initModule;
    //----------------- END MODULE SCOPE VARIABLES ---------------

    //------------------- BEGIN UTILITY METHODS ------------------



    function closePopup() {
        jqueryMap.$memberFormValidator.resetForm();
        jqueryMap.$memberFormPopup.fadeOut();
        jqueryMap.$overlay.fadeOut();
    }

    function validateMemberForm() {
        var validator = $("#memberForm").validate({
            focusCleanup: true,
            rules: {
                firstname: {
                    required: true,
                    minlength: 2
                },
                lastname: {
                    required: true,
                    minlength: 2
                },
                username: {
                    required: true,
                    minlength: 2
                },
                email: {
                    email: true
                },
                zip: {
                    number: true,
                    required: true,
                    minlength: 5
                },
                city: {
                    required: true

                },
                address: {
                    required: true

                }

            },
            errorClass: "errormessage",
            errorElement: "b",
            errorPlacement: function (error, element) {
                console.log("errorPlacement=" + element);
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
      
        $contentWrapper.append($(configMap.member_list_html));
        $contentWrapper.append($(configMap.member_form_html));
        var $adminMemberList = $contentWrapper.find('#memberList');
     
     
       
        jqueryMap = {
            $contentWrapper: $contentWrapper,
            $memberMenu: $menu.find('#admin_member'),
            $overlay: $content.find("#overlay-bg"),
            $adminMemberList: $adminMemberList,
         
            $adminMemberListTableList: $adminMemberList.find('#tblMemberList tbody'),
            $memberFormPopup: $contentWrapper.find('#memberAddEdit'),
            $memberForm: $contentWrapper.find('#memberForm'),
            $memberFormValidator: validateMemberForm()};
    };
    // End DOM method /setJqueryMap/
    listMembers = function () {

        var memberlistLength, myMember;
        jqueryMap.$adminMemberListTableList.html("");
        stateMap.memberList = configMap.general_model.getItems(configMap.object_type);
        memberlistLength = stateMap.memberList.length;
        console.log("is admin=" + stateMap.currentMember.isAdmin);
        if (stateMap.currentMember.isAdmin) {
            jqueryMap.$adminMemberList.find('#btnCreateMember').fadeIn();
        } else {
            jqueryMap.$adminMemberList.find('#btnCreateMember').hide();
        }

        for (var i = 0; i < memberlistLength; i++) {
            myMember = stateMap.memberList[i];

            jqueryMap.$adminMemberListTableList.append("<tr>" + "<td><img src='../css/images/edit.png' alt='Edit" + myMember._id
                    + "' id='btnEditMember' class='btnEdit'/></td><td><img src='../css/images/dustbin.png' alt='Delete" + myMember._id
                    + "' id='btnDeleteMember'  class='btnDelete'/></td>" + "<td>" + myMember.firstname + "</td>"
                    + "<td>" + myMember.lastname + "</td>" + "<td><span class='username'>" + myMember.username + "</span></td>" + "<td>"
                    + myMember.email + "</td>" + "<td>" + myMember.zip + "</td>"
                    + "<td>" + myMember.city + "</td>" + "<td>" + myMember.address + "</td>"
                    + "<td>" + myMember.phone + "</td>" + "<td>" + myMember.mobil + "</td>"
                    + "<td>" + myMember.admissionDate + "</td>"
                    + "<td>"
                    + (myMember.isActive ? configMap.imageActive : configMap.imageInactive)
                    + "</td>"
                    + "</tr>");
        }
        if (!stateMap.currentMember.isAdmin) {
            console.log("User is not an admin");
            var rows = jqueryMap.$adminMemberListTableList.find("tr");
            rows.each(function (i, tr) {
                var username = $("span.username", tr).text();

                if (username === stateMap.currentMember.username) {
                    $(this).css({"backgroundColor": "#afc7e0", "color": "white"});
                }
            });
        }
     
      jqueryMap.$adminMemberList.fadeIn(1000, "swing");
    };
//---------------------- END DOM METHODS ---------------------

//------------------- BEGIN EVENT HANDLERS -------------------


    onMenuMember = function (event) {
        stateMap.currentAction = configMap.actionTypes.list;
        event.preventDefault();
        jqueryMap.$contentWrapper.children().hide();
        
        configMap.general_model.findAll(configMap.object_type, memberCallback);
    };
    /**
     * Inactivates the selected member. And in a second step the selected member is deleted also from
     * the corresponding membership of the current year (if it already exists);
     * 
     * @param {type} event
     * @returns {Boolean}
     */
    onDeleteMember = function (event) {
        stateMap.currentAction = configMap.actionTypes.delete;
        event.preventDefault();

        stateMap.selectedMemberId = $(this).attr("alt").replace("Delete", "");
        var theMember = null;
        if (stateMap.currentMember.isAdmin || stateMap.selectedMemberId === stateMap.currentMember._id) {
            theMember = configMap.general_model.getById(configMap.object_type, stateMap.selectedMemberId);
            if (!confirm("Willst Du wirklich [" + theMember.username + "] inaktivieren ?")) {
                return false;
            }
            configMap.general_model.deleteItem(configMap.object_type, theMember._id, memberCallback);
        }

    };
    onEditMember = function (event) {
        console.log("on edit member");
        stateMap.currentAction = configMap.actionTypes.update;
        stateMap.saveIsEdit = true;
        stateMap.selectedMemberId = $(this).attr("alt").replace("Edit", "");
        console.log("id = " + stateMap.selectedMemberId);
        var theMember = configMap.general_model.getById(configMap.object_type, stateMap.selectedMemberId);

        if (stateMap.currentMember.isAdmin || stateMap.selectedMemberId === stateMap.currentMember._id) {
            jqueryMap.$memberForm.find("#txtID").val(theMember._id);
            jqueryMap.$memberForm.find("#txtVorname").val(theMember.firstname);
            jqueryMap.$memberForm.find("#txtNachname").val(theMember.lastname);
            jqueryMap.$memberForm.find("#txtUsername").val(theMember.username);
            jqueryMap.$memberForm.find("#txtUsername").prop("readonly", true);
            jqueryMap.$memberForm.find("#txtEmail").val(theMember.email);
            jqueryMap.$memberForm.find("#txtZip").val(theMember.zip);
            jqueryMap.$memberForm.find("#txtCity").val(theMember.city);
            jqueryMap.$memberForm.find("#txtAddress").val(theMember.address);
            jqueryMap.$memberForm.find("#txtPhone").val(theMember.phone);
            jqueryMap.$memberForm.find("#txtMobil").val(theMember.mobil);
            jqueryMap.$memberForm.find("#txtAdmissionDate").val(theMember.admissionDate);
            jqueryMap.$memberForm.find("#txtIsActive").prop("checked", theMember.isActive);
            jqueryMap.$memberForm.find("#txtVorname").focus();
            aige.util.updatePopup(jqueryMap.$memberFormPopup);
            jqueryMap.$memberFormPopup.show();
            jqueryMap.$overlay.fadeIn();
            event.preventDefault();
        }
        return false;
    };
    onCreateMember = function () {
        if (stateMap.currentMember.isAdmin) {
            stateMap.currentAction = configMap.actionTypes.create;
            stateMap.saveIsEdit = false;
            jqueryMap.$memberFormValidator.resetForm();
            jqueryMap.$memberForm[0].reset();
            jqueryMap.$memberFormPopup.find("#headerMemberFormPopup").text("Neues Mitglied anlegen");

            jqueryMap.$memberFormPopup.show();
            jqueryMap.$overlay.fadeIn();
            aige.util.updatePopup(jqueryMap.$memberFormPopup);
            jqueryMap.$memberForm.find("#txtIsAdmin").prop("readonly", false);
            jqueryMap.$memberForm.find("#txtUsername").prop("readonly", false);
            jqueryMap.$memberForm.find("#txtVorname").focus();
        }
        return false;
    };
    onSaveMember = function (event) {
        if (!jqueryMap.$memberForm.valid()) {

            return false;

        }
        var name = jqueryMap.$memberForm.find('#txtUsername').val();
        var thename = jqueryMap.$memberForm.find('#txtNachname').val();

        var isAdmin = false;
        if (name === 'Ecki' || name === 'Christian'
                || name === 'Serafim' || name === 'Claus-Peter' || name === 'Frank') {
            isAdmin = true;
        }
        if (thename === 'David') {
            isAdmin = true;
        }

        var theMember = {
            _id: jqueryMap.$memberForm.find('#txtID').val(),
            firstname: jqueryMap.$memberForm.find('#txtVorname').val(),
            lastname: jqueryMap.$memberForm.find('#txtNachname').val(),
            username: jqueryMap.$memberForm.find('#txtUsername').val(),
            email: jqueryMap.$memberForm.find('#txtEmail').val(),
            zip: jqueryMap.$memberForm.find('#txtZip').val(),
            city: jqueryMap.$memberForm.find('#txtCity').val(),
            address: jqueryMap.$memberForm.find('#txtAddress').val(),
            phone: jqueryMap.$memberForm.find('#txtPhone').val(),
            mobil: jqueryMap.$memberForm.find('#txtMobil').val(),
            admissionDate: jqueryMap.$memberForm.find('#txtAdmissionDate').val(),
            isActive: jqueryMap.$memberForm.find('#txtIsActive').is(":checked"),
            isAdmin: isAdmin
        };

        console.log(" der neue= " + JSON.stringify(theMember));

        stateMap.saveIsEdit ?
                configMap.general_model.updateItem(configMap.object_type, theMember, memberCallback) :
                configMap.general_model.createItem(configMap.object_type, theMember, memberCallback);
        jqueryMap.$memberFormPopup.fadeOut();
        jqueryMap.$overlay.fadeOut();
        event.preventDefault();
    };

    onLoginSuccess = function (event, login_user) {
        stateMap.currentMember = login_user;
        console.log("current member for member model=" + stateMap.currentMember.username);
        return false;

    }
    //-------------------- END EVENT HANDLERS --------------------
    //-------------------- START CALLBACKS  -------------------- 

    memberCallback = function (error) {

        var $message;
        switch (stateMap.currentAction) {
            case configMap.actionTypes.list:
                $message = error ?
                        $("<span>Die Suche war nicht erfolgreich</span>") : $("<span>Das Ergebnis der Mitgliedersuche:</span>");
                break;
            case configMap.actionTypes.create:
                $message = error ?
                        $("<span>Die 'Neuanlage' war nicht erfolgreich</span>") : $("<span> Es wurde ein neues Mitglied gespeichert.</span>");
                break;
            case configMap.actionTypes.update:
                $message = error ?
                        $("<span>Die 'Aendernung' war nicht erfolgreich</span>") : $("<span> Die Aenderung wurde gespeichert.</span>");
                break;
            case configMap.actionTypes.delete:
                $message = error ?
                        $("<span>Die Transaktion 'Entfernen' war nicht erfolgreich</span>") : $("<span> Das Mitglied wurde deaktiviert.</span>");
                break;
        }
        error ?
                aige.util.messageError($message) :
                aige.util.messageConfirm($message);
        listMembers();
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
        jqueryMap.$memberMenu.on('click', onMenuMember);
        jqueryMap.$adminMemberList.on("click", "#btnDeleteMember", onDeleteMember);
        jqueryMap.$adminMemberList.on("click", "#btnEditMember", onEditMember);
        jqueryMap.$memberForm.on('submit', onSaveMember);
        jqueryMap.$memberForm.on("click", "#btnCloseMember", closePopup);
        jqueryMap.$contentWrapper.on("click", "#btnCreateMember", onCreateMember);
        jqueryMap.$contentWrapper.on("click", "#overlay-bg", closePopup);
        $.gevent.subscribe(jqueryMap.$contentWrapper, 'login-success', onLoginSuccess);
        $(window).resize(aige.util.updatePopup(jqueryMap.$memberFormPopup));


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

