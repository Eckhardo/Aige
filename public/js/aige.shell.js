/*
 * aige.shell.js
 * Shell module for AIGE
 */

/*jslint         browser : true, continue : true,
 devel  : true, indent  : 2,    maxerr   : 50,
 newcap : true, nomen   : true, plusplus : true,
 regexp : true, sloppy  : true, vars     : false,
 white  : true
 */
/*global $, aige */

aige.shell = (function () {
//---------------- BEGIN MODULE SCOPE VARIABLES --------------
    var
            configMap = {
                anchor_schema_map: {
                    aige: {open: true, closed: true}
                },
                main_html: String()
                        + '<div class="aige-shell-head">'
                        + '<div class="aige-shell-head-logo"></div>'
                        + '<div class="aige-shell-head-acct"></div>'
                        + '<div class="aige-shell-head-search"></div>'
                        + '</div>'
                        + '<div class="aige-shell-main">'
                        + '<div class="aige-shell-main-nav"></div>'
                        + '<div class="aige-shell-main-content">'
                        + '<div class="aige-shell-message">&nbsp;</div>'
                        + '<div id="contentWrapper">'
                        + '<div id="overlay-bg"></div> </div>'
                        + '</div>'
                        + '</div>'
                        + '<div class="aige-shell-foot"></div>'
                ,
                main_menu: String()
                        + '<div id="cssmenu">'
                        + '<ul>'
                        + '<li class="active"><a href="#"><span id="public_home"> Home </span></a> </li>'
                        + '<li class="has-sub"><a href="#"><span> Verwaltung </span></a >'
                        + '<ul>'
                        + '<li> <a href="#"> <span id="admin_member"> Mitglieder </span></a> </li>'
                        + '<li> <a href="#"> <span id="admin_event">Ereignisse</span></a></li>'
                        + '<li> <a href="#"> <span id="admin_membership"> Mitgliedschaft </span></a> </li>'
                        + '<li>  <a href="#"><span id="admin_saison">Termine</span></a></li>'
                        + '<li>  <a href="#"><span id="admin_tasks">Arbeitsdienste</span></a></li>'
                        + '</ul>'
                        + '</li>'
                        + '<li class="has-sub"><a href="#"><span>Dienste</span></a>'
                        + '<ul >'
                        + '<li><a href="#"><span id="image_upload">Bilder hochladen</span></a></li>'
                        + '<li><a href="#"><span id="image_view">Bilder anschauen</span></a></li>'
                        + '<li class="last"><a href="#"><span id="protocols">Protokolle</span></a></li>'
                        + '<li class="last"><a href="#"><span id="treasury">Kassenberichte</span></a></li>'
                        + '</ul>'
                        + '</li>'
                        + '<li class="last"><a href="#"><span id="">Kontakt</span></a></li>'
                        + '</ul>'
                        + '</div>',
                actionTypes: {create: "create",
                    update: "update",
                    delete: "delete",
                    list: "list"}

            },
    stateMap = {
        $container: null,
        anchor_map: {},
        currentUser: null,
        user_is_logged_in: false

    },
    jqueryMap = {},
            copyAnchorMap, setJqueryMap,
            changeAnchorPart, onHashchange,
            onLogin, onLoginFail, onResize, onSignIn, initModule,
            handleMenu, findMenuAction;
    //----------------- END MODULE SCOPE VARIABLES ---------------

    //------------------- BEGIN UTILITY METHODS ------------------
    // Returns copy of stored anchor map; minimizes overhead
    copyAnchorMap = function () {
        return $.extend(true, {}, stateMap.anchor_map);
    };
    //-------------------- END UTILITY METHODS -------------------

    //--------------------- BEGIN DOM METHODS --------------------
    // Begin DOM method /setJqueryMap/
    setJqueryMap = function () {
        var $container = stateMap.$container,
                $nav = $container.find('.aige-shell-main-nav');
        $nav.html(configMap.main_menu);
        var $menu = $nav.find("#cssmenu"),
                $menuHome = $menu.find("#public_home");
        jqueryMap = {
            $container: $container,
            $menu: $menu,
            $menuHome: $menuHome,
            $loginWindow: $container.find('.aige-shell-head-acct')

        };
    };
    // End DOM method /setJqueryMap/

    // Begin DOM method /changeAnchorPart/
    // Purpose    : Changes part of the URI anchor component
    // Arguments  :
    //   * arg_map - The map describing what part of the URI anchor
    //     we want changed.
    // Returns    :
    //   * true  - the Anchor portion of the URI was updated
    //   * false - the Anchor portion of the URI could not be updated
    // Actions    :
    //   The current anchor rep stored in stateMap.anchor_map.
    //   See uriAnchor for a discussion of encoding.
    //   This method
    //     * Creates a copy of this map using copyAnchorMap().
    //     * Modifies the key-values using arg_map.
    //     * Manages the distinction between independent
    //       and dependent values in the encoding.
    //     * Attempts to change the URI using uriAnchor.
    //     * Returns true on success, and false on failure.
    //
    changeAnchorPart = function (arg_map) {
        var
                anchor_map_revise = copyAnchorMap(),
                bool_return = true,
                key_name, key_name_dep;
        // Begin merge changes into anchor map
        KEYVAL:
                for (key_name in arg_map) {
            if (arg_map.hasOwnProperty(key_name)) {

                // skip dependent keys during iteration
                if (key_name.indexOf('_') === 0) {
                    continue KEYVAL;
                }

                // update independent key value
                anchor_map_revise[key_name] = arg_map[key_name];
                // update matching dependent key
                key_name_dep = '_' + key_name;
                if (arg_map[key_name_dep]) {
                    anchor_map_revise[key_name_dep] = arg_map[key_name_dep];
                } else {
                    delete anchor_map_revise[key_name_dep];
                    delete anchor_map_revise['_s' + key_name_dep];
                }
            }
        }
        // End merge changes into anchor map

        // Begin attempt to update URI; revert if not successful
        try {
            $.uriAnchor.setAnchor(anchor_map_revise);
        } catch (error) {
            // replace URI with existing state
            $.uriAnchor.setAnchor(stateMap.anchor_map, null, true);
            bool_return = false;
        }
        // End attempt to update URI...

        return bool_return;
    };
    // End DOM method /changeAnchorPart/
    //--------------------- END DOM METHODS ----------------------

    //------------------- BEGIN EVENT HANDLERS -------------------



    handleMenu = function (event) {
        console.log("handle menu");
        $('#cssmenu li').removeClass('active');
        $(this).closest('li').addClass('active');
        var checkElement = $(this).next();
        if ((checkElement.is('ul')) && (checkElement.is(':visible'))) {
            $(this).closest('li').removeClass('active');
            checkElement.slideUp('normal');
        }
        if ((checkElement.is('ul')) && (!checkElement.is(':visible'))) {
            $('#cssmenu ul ul:visible').slideUp('normal');
            checkElement.slideDown('normal');
        }
        if ($(this).closest('li').find('ul').children().length === 0) {
            return true;
        } else {

            return false;
        }
    };
    findMenuAction = function (event) {
        var x = event.target;
        console.log("findMenuAction target" + x);
        var id = $(this).attr("id");
        console.log("findMenuAction id=" + id);
        return false;
    };
    // Begin Event handler /onHashchange/
    // Purpose    : Handles the hashchange event
    // Arguments  :
    //   * event - jQuery event object.
    // Settings   : none
    // Returns    : false
    // Actions    :
    //   * Parses the URI anchor component
    //   * Compares proposed application state with current
    //   * Adjust the application only where proposed state
    //     differs from existing and is allowed by anchor schema
    //
    onHashchange = function (event) {
        var
                _s_chat_previous, _s_chat_proposed, s_chat_proposed,
                anchor_map_proposed,
                is_ok = true,
                anchor_map_previous = copyAnchorMap();
        // attempt to parse anchor
        try {
            anchor_map_proposed = $.uriAnchor.makeAnchorMap();
        } catch (error) {
            $.uriAnchor.setAnchor(anchor_map_previous, null, true);
            return false;
        }
        stateMap.anchor_map = anchor_map_proposed;
        // convenience vars
        _s_chat_previous = anchor_map_previous._s_chat;
        _s_chat_proposed = anchor_map_proposed._s_chat;
        // Begin adjust chat component if changed
        if (!anchor_map_previous
                || _s_chat_previous !== _s_chat_proposed
                ) {
            s_chat_proposed = anchor_map_proposed.chat;
            switch (s_chat_proposed) {
                case 'opened' :

                    break;
                case 'closed' :

                    break;
                default :

                    delete anchor_map_proposed.chat;
                    $.uriAnchor.setAnchor(anchor_map_proposed, null, true);
            }
        }
        // End adjust chat component if changed

        // Begin revert anchor if slider change denied
        if (!is_ok) {
            if (anchor_map_previous) {
                $.uriAnchor.setAnchor(anchor_map_previous, null, true);
                stateMap.anchor_map = anchor_map_previous;
            } else {
                delete anchor_map_proposed.chat;
                $.uriAnchor.setAnchor(anchor_map_proposed, null, true);
            }
        }
        // End revert anchor if slider change denied

        return false;
    };
    // End Event handler /onHashchange/

    // Begin Event handler /onResize/
    onResize = function () {
        if (stateMap.resize_idto) {
            return true;
        }

        //  spa.chat.handleResize();
        stateMap.resize_idto = setTimeout(
                function () {
                    stateMap.resize_idto = undefined;
                },
                configMap.resize_interval
                );
        return true;
    };
    // End Event handler /onHashchange/

    // Begin Event handler /onSignIn/
    onSignIn = function (event) {

        if (!stateMap.user_is_logged_in) {
            var user_name = prompt('Bitte anmelden', '');
            if (user_name==='Ecki'){
               user_name='Niemand';
            }
            
            if (user_name==='Ebi'){
                user_name='Ecki';
            }
            var searchParams = {searchParams: {username: user_name}};
            console.log("user name input=" + user_name);
            aige.model.member.login(searchParams);
            jqueryMap.$loginWindow.text('... Anfrage wird bearbeitet ...');
        } else {
            aige.model.member.logout();
        }

        return false;
    };
    // Will be called when login was successful
    onLogin = function (event, userMap) {

        stateMap.currentUser = userMap;
        console.log("login for " + stateMap.currentUser.username);
        $(this).text(userMap.username);

        jqueryMap.$menu.fadeIn();
    };
    onLoginFail = function (event, error) {

        var $message, errorMessage;
        for (var prop in error) {
            if (error.hasOwnProperty(prop)) {
                errorMessage = error[prop];
            }
        }
        $message = $("<span>Die Die Anmeldung war nicht erfolgreich:" + errorMessage + "</span>");
        aige.util.messageError($message);
        jqueryMap.$loginWindow
                .text('Bitte anmelden');
    };
    // End Event handler /onClickChat/
    //-------------------- END EVENT HANDLERS --------------------

    //------------------- BEGIN PUBLIC METHODS -------------------
    // Begin Public method /initModule/
    initModule = function ($container) {
        // load HTML and map jQuery collections
        stateMap.$container = $container;
        $container.html(configMap.main_html);
        setJqueryMap();
        // configure uriAnchor to use our schema
        $.uriAnchor.configModule({
            schema_map: configMap.anchor_schema_map
        });

        aige.home.configModule({
            general_model: aige.model.general,
            actionTypes: configMap.actionTypes
        });
        aige.home.initModule(jqueryMap.$container);
        // configure and initialize feature module member
        aige.member.configModule({
            general_model: aige.model.general,
            member_model: aige.model.member,
            actionTypes: configMap.actionTypes
        });
        aige.member.initModule(jqueryMap.$container);
        // configure and initialize feature module event
        aige.event.configModule({
            general_model: aige.model.general,
            event_model: aige.model.event,
            actionTypes: configMap.actionTypes
        });
        aige.event.initModule(jqueryMap.$container);
        // configure and initialize feature module membership
        aige.membership.configModule({
            general_model: aige.model.general,
            membership_model: aige.model.membership,
            event_model: aige.model.event,
            actionTypes: configMap.actionTypes
        });
        aige.membership.initModule(jqueryMap.$container);
        // configure and initialize feature module saison
        aige.saison.configModule({
            general_model: aige.model.general,
            saison_model: aige.model.saison,
            event_model: aige.model.event,
            actionTypes: configMap.actionTypes
        });
        aige.saison.initModule(jqueryMap.$container);

//        aige.task.configModule({
//            general_model: aige.model.general,
//            task_model: aige.model.task,
//            event_model:aige.model.event,
//            actionTypes: configMap.actionTypes
//        });
        aige.task.initModule(jqueryMap.$container);
        // configure and initialize utility module 
        aige.util.initModule(jqueryMap.$container);

        aige.images.configModule({
            general_model: aige.model.general,
            actionTypes: configMap.actionTypes
        });
        aige.images.initModule(jqueryMap.$container);
        // Handle URI anchor change events.
        // This is done /after/ all feature modules are configured
        // and initialized, otherwise they will not be ready to handle
        // the trigger event, which is used to ensure the anchor
        // is considered on-load
        //
        $(window)
                .bind('hashchange', onHashchange)
                .trigger('hashchange');
        $.gevent.subscribe(jqueryMap.$loginWindow, 'login-success', onLogin);
        $.gevent.subscribe(jqueryMap.$loginWindow, 'login-fail', onLoginFail);
        jqueryMap.$loginWindow
                .text('Bitte anmelden')
                .bind('click', onSignIn);
        $('#cssmenu > ul > li >  a ').on('click', handleMenu);
        $('#cssmenu > ul > li.has-sub > ul > li > a').on('click', 'span', findMenuAction);

    };
    // End PUBLIC method /initModule/

    return {initModule: initModule};
    //------------------- END PUBLIC METHODS ---------------------
}());


