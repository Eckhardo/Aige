/*
 * aige.util.js
 * General JavaScript utilities
 
 *
 */

/*jslint          browser : true,  continue : true,
 devel  : true,  indent  : 2,     maxerr   : 50,
 newcap : true,  nomen   : true,  plusplus : true,
 regexp : true,  sloppy  : true,  vars     : false,
 white  : true
 */
/*global $, aige */


aige.util = (function () {
//---------------- BEGIN MODULE SCOPE VARIABLES --------------
    var
            configMap = {
                settable_map: {},
                imageMessage: "<img src='../css/images/iconInformation.gif' alt='Nachricht'/>",
                imageError: "<img src='../css/images/iconWarning.gif' alt='Warnung'/>",
            },
            stateMap = {$container: null},
    jqueryMap = {}, getFormData,
            containsItem, getDatepickerOptions, messageConfirm, messageError,
            fetchFormKeys, fetchFormKeyValues, fetchKeys,updatePopup,
            setConfigMap, setJqueryMap, initModule;
    //--------------------- BEGIN DOM METHODS --------------------
    // Begin DOM method /setJqueryMap/
    setJqueryMap = function () {
        var $container = stateMap.$container,
                $menu = $container.find('#cssmenu'),
                $content = $container.find('.aige-shell-main-content');
        jqueryMap = {
            $container: $container,
            $menu: $menu,
            $content: $content
        };
    };
    // End DOM method /setJqueryMap/
    //---------------------- END DOM METHODS ---------------------

    getFormData = function ($form) {
        var result = {};
        var unindexed_array = $form.serializeArray();
        $.map(unindexed_array, function (n, i) {
            result[n['name']] = n['value'];
        });
        return result;
    }
    getDatepickerOptions = function () {

        return  {prevText: '&#x3c;zurueck', prevStatus: '',
            nextText: 'Vor&#x3e;', nextStatus: '',
            showButtonPanel: true,
            gotoCurrent: true,
            todayText: 'heute', currentStatus: '',
            closeText: 'schlie&szlig;en', closeStatus: '',
            monthNames: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
                'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
            monthNamesShort: ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun',
                'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'],
            dayNames: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
            dayNamesShort: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
            dayNamesMin: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
            showMonthAfterYear: false,
            dateFormat: 'dd.mm.yy'}
    }

    containsItem = function (items, itemOfChoice) {
        var _item, i = items.length;
        while (i--) {
            _item = items[i];

            if (_item === itemOfChoice) {
                return true;
            }
        }
        return false;
    }

    // Begin Public method /messageConfirm/
    // Purpose: adds a confim message to the cor. div>
    messageConfirm = function ($message) {
        var $messageDiv = jqueryMap.$content.find('.aige-shell-message');
        $messageDiv.empty();
        $messageDiv.append("&nbsp;");
        $message.prepend(configMap.imageMessage);
        $messageDiv.append($message);
        $messageDiv.fadeIn();
        setTimeout(function () {
            $message.fadeOut();
        }, 1000);
    };
    // Begin Public method /messageError/
    // Purpose: adds a error message to the cor. div>
    messageError = function ($message) {
        var $messageDiv = jqueryMap.$content.find('.aige-shell-message');
        $message.prepend(configMap.imageError);
        $messageDiv.append($message);
        $messageDiv.fadeIn();
        setTimeout(function () {
            $message.fadeOut();
        }, 1000);
    };
    fetchKeys = function (obj) {
        console.log("fetch keys");
        var keys;
        if (obj.keys) {
            keys = obj.keys();
        }
        else {
            keys = [];
            for (var k in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, k)) {

                    keys.push(k);
                }
            }

        }
        return keys;
    }
    /**
     *  fetches keys from a html form and puts them in an array. 
     */
    fetchFormKeys = function ($form) {
        var result = [];
        $.each($form.serializeArray(), function () {
            result.push([this.name]);
        });

        return result;
    };
    /**
     *  fetches keys from a html form and puts them in an array. 
     */
    fetchFormKeyValues = function ($form) {
        var result = {};
        $.each($form.serializeArray(), function () {
            result[this.name] = this.value;
        });

        return result;
    }

    // Begin Public method /setConfigMap/
    // Purpose: Common code to set configs in feature modules
    // Arguments:
    //   * input_map    - map of key-values to set in config
    //   * settable_map - map of allowable keys to set
    //   * config_map   - map to apply settings to
    // Returns: true
    // Throws : Exception if input key not allowed
    //
    setConfigMap = function (arg_map) {
        var
                input_map = arg_map.input_map,
                settable_map = arg_map.settable_map,
                config_map = arg_map.config_map,
                key_name, error;
        for (key_name in input_map) {
            if (input_map.hasOwnProperty(key_name)) {
                if (settable_map.hasOwnProperty(key_name)) {


                    config_map[key_name] = input_map[key_name];
                }
                else {
                    error = makeError('Bad Input',
                            'Setting config key |' + key_name + '| is not supported'
                            );
                    throw error;
                }
            }
        }
    };
     updatePopup= function($popup) {
        var $popupContent = $popup,
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
    // End Public method /setConfigMap/
    // Begin public method /initModule/
    // Purpose    : Initializes module
    // Arguments  :
    //  * $container the jquery element used by this feature
    // Returns    : true
    // Throws     : none
    //
    initModule = function ($container) {
        stateMap.$container = $container;
        setJqueryMap();
        return true;
    };
    // End public method /initModule/
    return {
        updatePopup:updatePopup,
        getFormData:getFormData,
        getDatepickerOptions: getDatepickerOptions,
        containsItem: containsItem,
        messageConfirm: messageConfirm,
        messageError: messageError,
        fetchKeys: fetchKeys,
        fetchFormKeyValues: fetchFormKeyValues,
        fetchFormKeys: fetchFormKeys,
        setConfigMap: setConfigMap,
        initModule: initModule
    };
}());
