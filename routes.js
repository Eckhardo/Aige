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

var cool = require('cool-ascii-faces');
//------- END MODULE SCOPE VARIABLES -------



configRoutes = function (app, server) {
    app.get('/', function (request, response) {
        console.log("redirect to index.html");
        response.redirect('/index.html');
    });

    app.get('/cool', function (request, response) {
        response.send(cool());
    });

    app.all('/:object_type/*?', function (request, response, next) {
        console.log("set content type to JSON");
        response.contentType('json');
        next();
    });
    app.all('/:object_type/*?', function (error, request, response, next) {
        console.log("error, request, repsonse,next" + JSON.stringify(error));
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

    app.post('/:object_type/updateSaisonEventsForMember', function (request, response) {
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

    });

    app.post('/:object_type/deleteEventsFromSaison', function (request, response) {
        console.log("deleteEventsFromSaison....");
        var result_map, object_type, id, members, events;
        var find_map, set_map, memberName;
        object_type = request.params.object_type;
        id = makeMongoId(request.body.id);

        members = request.body.members;
        events = request.body.events;

        console.log("id =" + JSON.stringify(id));
        console.log("members =" + JSON.stringify(members));
        console.log("events =" + JSON.stringify(events));

        var not_sent = true;
        if (events === false || events.length === 0) {
            console.log("Nothing to do....");
            response.json(result_map);
        } else {
            console.log("DELETE all entries for any member for these events: " + JSON.stringify(events));
            for (var j = 0; j < members.length; j++) {
                memberName = members[j];
                console.log(j + ". saison member =" + JSON.stringify(memberName));
                find_map = {'_id': id, "memberEvents.memberName": memberName};
                set_map = {"memberEvents.$.saisonEvents": {"eventName": {$in: events}}};
                crud.deleteEventsFromSaison(
                        object_type,
                        find_map,
                        set_map,
                        function (result_map) {
                            console.log("deleted event 1=" + JSON.stringify(result_map));

                        }
                );
                console.log("END iterate  members");
            }
            console.log("END iterate  events: Now delete entries from events array:");





            find_map = {'_id': id};
            set_map = {"events": {$in: events}};
            crud.deleteEventsFromSaison(
                    object_type,
                    find_map,
                    set_map,
                    function (result_map) {
                        console.log("deleted event 2=" + JSON.stringify(result_map));
                        if (not_sent) {
                            response.json(result_map);
                            not_sent = true;
                        }
                    }
            );
        }



    });

    app.post('/:object_type/deleteMembersFromSaison', function (request, response) {
        console.log("ROUTE: deleteMembersFromSaison....");
        var empy_result_map = {"delete_count": 0}, object_type, id, members, find_map, set_map;


        object_type = request.params.object_type;
        id = makeMongoId(request.body.id);
        members = request.body.members;

        console.log("id =" + JSON.stringify(id));
        console.log("members =" + JSON.stringify(members));

        if (members === false || members.length === 0) {
            console.log("Nothing to do...." + JSON.stringify(empy_result_map));
            response.json(empy_result_map);
        } else {
            console.log("deleted members =" + JSON.stringify(members));
            find_map = {'_id': id};
            set_map = {"memberEvents": {"memberName": {$in: members}}, "members": {$in: members}};
            crud.deleteMembersFromSaison(
                    object_type,
                    find_map,
                    set_map,
                    function (result_map) {
                        console.log("ROUTE deleted member =" + JSON.stringify(result_map));
                        response.json(result_map);

                    }
            );
        }

    });

    app.post('/:object_type/addMembersToSaison', function (request, response) {
        console.log("ROUTE addMembersToSaison....");
        var empy_result_map = {"add_count": 0}, object_type, id, members, memberEvents, find_map;

        object_type = request.params.object_type;
        id = makeMongoId(request.body.id);
        members = request.body.members;
        memberEvents = request.body.memberEvents;
        console.log("id =" + JSON.stringify(id));
        console.log("members =" + JSON.stringify(members));
        console.log("memberEvents =" + JSON.stringify(memberEvents));

        if (members === false || members.length === 0) {
            console.log("Nothin to do...." + JSON.stringify(empy_result_map));
            response.json(empy_result_map);
        } else {

            console.log("add these  members =" + JSON.stringify(members));
            find_map = {'_id': id};

            crud.addMembersToSaison(
                    object_type,
                    find_map,
                    memberEvents, members,
                    function (result_map) {
                        console.log("ROUTE: added member =" + JSON.stringify(result_map));
                        response.json(result_map);

                    }
            );
        }



    });
// end configRoutes
};
console.log('ROUTE module loaded now ');
module.exports = {configRoutes: configRoutes};


