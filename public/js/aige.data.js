/*
 * aige.data.js
 * Data module
 */

/*jslint         browser : true, continue : true,
 devel  : true, indent  : 2,    maxerr   : 50,
 newcap : true, nomen   : true, plusplus : true,
 regexp : true, sloppy  : true, vars     : false,
 white  : true
 */
/*global $, aige */

aige.data = (function () {
    'use strict';
    var initModule, ajax_call;
    ajax_call = (function () {
        var find_all,
                search,
                search_by_in_clause,
                deactivate_item,
                delete_item,
                create_item,
                update_item,
                update_events;

        find_all = function (object_type) {
            var promise = $.Deferred();
            $.ajax('/' + object_type + '/findAll', {
                type: 'POST',
                success: function (result) {
                    promise.resolve(result);
                },
                timeout: 3000,
                dataType: 'json',
                contentType: 'application/json',
                error: function () {
                    var error = 'invalid update';
                    promise.reject(error);
                }
            });
            return promise;
        };
        search = function (object_type, searchParams) {
            var promise = $.Deferred();
            $.ajax('/' + object_type + '/search', {
                type: 'POST',
                success: function (result) {
                    promise.resolve(result);
                },
                timeout: 3000,
                data: JSON.stringify({search: searchParams}),
                dataType: 'json',
                contentType: 'application/json',
                error: function () {
                    var error = 'invalid update';
                    promise.reject(error);
                }
            });
            return promise;
        };
   
        /**
         * 
         * @param {type} object_type
         * @param {type} id
         * @returns {aige_L16.aigeAnonym$1.data_L17.deactivate_item.promise|Function.data_L17.deactivate_item.promise|Deferred}
         */
        deactivate_item = function (object_type, id) {
            var promise = $.Deferred();
            $.ajax('/' + object_type + '/deleteByInactivate', {
                type: 'POST',
                success: function (result) {
                    console.log("deactivate succsess =");
                    promise.resolve(result);
                },
                data: JSON.stringify({id: id}),
                timeout: 3000,
                dataType: 'json',
                contentType: 'application/json',
                error: function (result) {
                    console.log("deactivate reject =" + JSON.stringify(result));
                    promise.reject(result);
                }
            });
            return promise;
        };
        delete_item = function (object_type, id) {
            var promise = $.Deferred();
            $.ajax('/' + object_type + '/deleteItem', {
                type: 'POST',
                success: function (result) {
                    console.log("delete item succsess =");
                    promise.resolve(result);
                },
                data: JSON.stringify({id: id}),
                timeout: 3000,
                dataType: 'json',
                contentType: 'application/json',
                error: function (result) {
                    console.log("delete reject =" + JSON.stringify(result));
                    promise.reject(result);
                }
            });
            return promise;
        };
        create_item = function (object_type, item) {
            var promise = $.Deferred();
            $.ajax('/' + object_type + '/createItem', {
                type: 'POST',
                success: function (result) {
                    promise.resolve(result);
                },
                data: JSON.stringify({item: item}),
                timeout: 10000,
                dataType: 'json',
                contentType: 'application/json',
                error: function (result) {
                    console.log("create reject =" + JSON.stringify(result));
                    promise.reject(result);
                }
            });
            return promise;
        };
        update_item = function (object_type, item) {
            var promise = $.Deferred();
            $.ajax('/' + object_type + '/updateItem', {
                type: 'POST',
                success: function (result) {
                    promise.resolve(result);
                },
                data: JSON.stringify({item: item}),
                timeout: 10000,
                dataType: 'json',
                contentType: 'application/json',
                error: function (result) {
                    console.log("update reject =" + JSON.stringify(result));
                    promise.reject(result);
                }
            });
            return promise;
        };
        update_events = function (object_type, id, name, setMap) {
            console.log("update_events," + JSON.stringify(setMap));
            var promise = $.Deferred();
            $.ajax('/' + object_type + '/updateEvents', {
                type: 'POST',
                success: function (result) {
                    promise.resolve(result);
                },
                data: JSON.stringify({id: id, name: name, events: setMap}),
                timeout: 10000,
                dataType: 'json',
                contentType: 'application/json',
                error: function (result) {
                    console.log("update reject =" + JSON.stringify(result));
                    promise.reject(result);
                }
            });
            return promise;
        };


        return {
            findAll: find_all,
            search: search,
            createItem: create_item,
            deleteItem: delete_item,
            deactivateItem: deactivate_item,
            updateItem: update_item,
            updateEvents: update_events};
    }());

//    
    initModule = function () {
        // nothing so far
        return true;
    };
    return {initModule: initModule, ajaxCall: ajax_call};
}());