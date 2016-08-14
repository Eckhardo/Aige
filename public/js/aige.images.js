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
                image_upload_form_html: String()
                        + '<div id= "imageUpload" class="aige-admin-member-list">'
                        + '<h2>Your avatar</h2>'
                        + ' <br>Please select an image'
                        + '  <input type="file" id="file_input"> <br><img id="preview">'
                        + '  <h2>Your information</h2>'
                        + ' <form method="POST" action="/submit_form/">'
                        + ' <input type="hidden" id="avatar_url" name="avatar_url" value="/images/default.png" />'
                        + ' <input type="text" name="username" placeholder="Username" /><br />'
                        + '  <input type="text" name="full_name" placeholder="Full name" /><br /><br />'
                        + '  <hr />'
              
                        + '  <h2>Save changes</h2>'
                        + '  <input type="submit" value="Update profile" />'
                        + '</form>'
                  +  ' <a href="https://aige-file-upload.s3.amazonaws.com/AIGE_2015_JHV_Protokoll.pdf" title="mehr Informationen">Das href-Attribut</a> </a>'
                        + '</div>',
                settable_map: {
                    general_model: true,
                    actionTypes: true}
            },
    stateMap = {$container: null},
    jqueryMap = {}, onMenuImageUpload, onUploadImage,
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
       $contentWrapper.append($(configMap.image_upload_form_html));
        var fileUploadForm = $contentWrapper.find('#imageUpload');
        jqueryMap = {
            $container: $container,
            $imageUploadMenu: $menu.find('#image_upload'),
            $overlay: $content.find("#overlay-bg"),
            $contentWrapper: $contentWrapper,
            $fileUploadForm: fileUploadForm

        };
    };
    // End DOM method /setJqueryMap/
    //---------------------- END DOM METHODS ---------------------

    //------------------- BEGIN EVENT HANDLERS -------------------

    // Begin event handler /onMenuImageUpload/
    onMenuImageUpload = function (event) {
        stateMap.currentAction = configMap.actionTypes.list;
        event.preventDefault();
        var file='https://aige-file-upload.s3.amazonaws.com/AIGE_2015_JHV_Protokoll.pdf';
        jqueryMap.$contentWrapper.children().hide();
          jqueryMap.$contentWrapper.append(file);
        jqueryMap.$fileUploadForm.show();
    };
    // End event handler /onMenuImageUpload/

    // // Begin event handler /onUploadImage/
    onUploadImage = function (event) {
        stateMap.currentAction = configMap.actionTypes.upload;
        event.preventDefault();
        console.log("Juhuu");

        var files = document.getElementById("file_input").files;
        var file = files[0];
        if (file == null) {
            alert("No file selected.");
            return;
        }
        console.log("here");
        get_signed_request(file);
    };

    function get_signed_request(file) {
        var xhr = new XMLHttpRequest();
         console.log("file_name=" + file.name + "&file_type=" + file.type);
        xhr.open("GET", "/sign_s3?file_name=" + file.name + "&file_type=" + file.type);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                   console.log("xhr 200");
                    var response = JSON.parse(xhr.responseText);
                      console.log("xhr 2000");
                    upload_file(file, response.signed_request, response.url);
                      console.log("xhr 20000");
                } else {
                    alert("Could not get signed URL.");
                }
            }
        };
        xhr.send();
    }


    function upload_file(file, signed_request, url) {
            console.log("start");
        var xhr = new XMLHttpRequest();
         console.log("start 2");
        xhr.open("PUT", signed_request);
         console.log("start 3");
        xhr.setRequestHeader('x-amz-acl', 'public-read');
        xhr.onload = function () {
             console.log("start 4");
            if (xhr.status === 200) {
                document.getElementById("preview").src = url;
                document.getElementById("avatar_url").value = url;
            }
        };
        xhr.onerror = function () {
             console.log("start 5");
            alert("Could not upload file.");
        };
         console.log("start 6");
        xhr.send(file);
    }
    // // Begin event handler /onUploadImage/
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
        jqueryMap.$fileUploadForm.on('submit', onUploadImage);
        var seed = "https://aige-file-upload.s3.amazonaws.com/AIGE_2015_JHV_Protokoll.pdf";
$("a").on('click',function(){
    $(this).attr('href', $(this).attr('href')+seed);
});

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
