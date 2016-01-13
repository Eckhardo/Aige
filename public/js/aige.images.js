/*
 * aige.images
 * A public feature module that offers the service to upload images.
 *
 
 */

/*jslint         browser : true, continue : true,
 devel  : true, indent  : 2,    maxerr   : 50,
 newcap : true, nomen   : true, plusplus : true,
 regexp : true, sloppy  : true, vars     : false,
 white  : true
 */

/*global $, aige */

aige.images = (function () {

    //---------------- BEGIN MODULE SCOPE VARIABLES --------------
    var
            configMap = {
                image_upload_html: String()
                        + '<div id= "imageUpload" class="aige-admin-member-list">'
                        + ' <br>Please select an image'
                        + '  <input type="file" id="image"> <br><img id="preview">'
                        + '</div>',
                settable_map: {
                    general_model: true,
                    actionTypes: true}
            },
    stateMap = {$container: null},
    jqueryMap = {}, onMenuImageUpload,
            setJqueryMap, configModule, initModule;
    //----------------- END MODULE SCOPE VARIABLES ---------------

    //------------------- BEGIN UTILITY METHODS ------------------
    // example : getTrimmedString
    //-------------------- END UTILITY METHODS -------------------

    //--------------------- BEGIN DOM METHODS --------------------
    // Begin DOM method /setJqueryMap/
    setJqueryMap = function () {
        var $container = stateMap.$container,
                $menu = $container.find('#cssmenu'),
                $content = $container.find('.aige-shell-main-content'),
                $contentWrapper = $container.find("#contentWrapper");
        $contentWrapper.append($(configMap.image_upload_html));
           var fileUpload = $contentWrapper.find('#imageUpload');
        jqueryMap = {
            $container: $container,
            $imageUploadMenu: $menu.find('#image_upload'),
            $overlay: $content.find("#overlay-bg"),
            $contentWrapper:$contentWrapper,
            $fileUpload:fileUpload

        };
    };
    // End DOM method /setJqueryMap/
    //---------------------- END DOM METHODS ---------------------

    //------------------- BEGIN EVENT HANDLERS -------------------

    onMenuImageUpload = function (event) {
        stateMap.currentAction = configMap.actionTypes.list;
        event.preventDefault();
        jqueryMap.$contentWrapper.children().hide();
           jqueryMap.$fileUpload.show();
    };
    //-------------------- END EVENT HANDLERS --------------------



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
        stateMap.$container = $container;
        setJqueryMap();
        jqueryMap.$imageUploadMenu.on('click', onMenuImageUpload);

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
