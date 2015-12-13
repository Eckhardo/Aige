/* 
 module to provide routing
 */
/*
 * routes.js - module to provide routing
 */

/*jslint         node    : true, continue : true,
 devel  : true, indent  : 2,    maxerr   : 50,
 newcap : true, nomen   : true, plusplus : true,
 regexp : true, sloppy  : true, vars     : false,
 white  : true
 */
/*global */

// ------------ BEGIN MODULE SCOPE VARIABLES --------------
'use strict';

var configRoutes,
        crud = require("./crud"),
        makeMongoId = crud.makeMongoId;


//------- END MODULE SCOPE VARIABLES -------



configRoutes = function (app, server) {
    app.get('/', function (request, response) {

        console.log("redirect to aige.html");

        response.redirect('/aige.html');
    });



    app.all('/:object_type/*?', function (request, response, next) {
        console.log("set content type to JSON");
        response.contentType('json');
        next();
    });

    app.post('/:object_type/login', function (request, response) {

        var find_map = {'firstname': request.body.name};
        crud.read(request.params.object_type, find_map, {},
                function (map_list) {
                    response.json(map_list);
                }
        );
    });


    app.post('/:object_type/findAll', function (request, response) {

        var object_type = request.params.object_type,
                find_map = {},
                field_map = {};

        crud.read(object_type, find_map, field_map,
                function (map_list) {
                    response.json(map_list);
                }
        );
    });


    app.post('/:object_type/search', function (request, response) {
        console.log("search route");
        var object_type = request.params.object_type,
                search = request.body.search.searchParams,
                find_map = {},
                field_map = {},
                prop;
        for (prop in search) {
            if (search.hasOwnProperty(prop)) {
                find_map[prop] = search[prop];
            }
        }
        console.log("search=" + JSON.stringify(find_map));
        crud.read(object_type, find_map, field_map,
                function (map_list) {
                    response.json(map_list);
                }
        );
    });

    app.post('/:object_type/createItem', function (request, response) {
        console.log("routes create item");
        var object_type, item, set_map;

        object_type = request.params.object_type;
        item = request.body.item;
        delete item._id;
        set_map = item;

        crud.construct(
                object_type,
                set_map,
                function (result_map) {
                    response.json(result_map);
                }
        );
    });


    app.post('/:object_type/updateItem', function (request, response) {
        var object_type, item, id, find_map, set_map;

        object_type = request.params.object_type;
        item = request.body.item;
        id = makeMongoId(item._id);

        delete item._id;

        find_map = {'_id': id};
        set_map = item;
        crud.update(
                object_type,
                find_map,
                set_map,
                function (result_map) {
                    console.log("update =" + JSON.stringify(result_map));
                    response.json(result_map);
                }
        );
    });
    app.post('/:object_type/deleteByInactivate', function (request, response) {
        var object_type, requestedId, id, find_map, set_map;

        object_type = request.params.object_type;
        requestedId = request.body.id + "";
        id = makeMongoId(requestedId);
        find_map = {'_id': id},
        set_map = {'isActive': false};

        crud.update(
                object_type,
                find_map,
                set_map,
                function (result_map) {
                    response.json(result_map);
                }
        );
    });

    app.post('/:object_type/deleteItem', function (request, response) {
        var object_type, requestedId, id, find_map;

        object_type = request.params.object_type;
        requestedId = request.body.id;
        id = makeMongoId(requestedId);
        find_map = {'_id': id};

        crud.destroy(object_type, find_map,
                function (map_list) {
                    response.json(map_list);
                }
        );
    });

    app.post('/:object_type/updateEvents', function (request, response) {
        var object_type, requestedId, id, name, find_map, events, set_map, id, name;

        object_type = request.params.object_type;
        requestedId = request.body.id;
        id = makeMongoId(requestedId);
        name = request.body.name;

        events = request.body.events;
        console.log("id =" + JSON.stringify(id));
        console.log("name =" + JSON.stringify(name));
        console.log("events =" + JSON.stringify(events));
        find_map = {'_id': id, "memberEvents.memberName": name};
        set_map = {"memberEvents.$.saisonEvents": events};
        crud.update(
                object_type,
                find_map,
                set_map,
                function (result_map) {
                    console.log("update =" + JSON.stringify(result_map));
                    response.json(result_map);
                }
        );
//  response.json({"Hello":"Goodbye"});
        //      {"name": "Saison 2015", "myMembers.memberName":"Chrischi"}, {$set:{"myMembers.$.myEvents":[]}}

    });
// end configRoutes
};
console.log('ROUTE module loaded now ');
module.exports = {configRoutes: configRoutes};


