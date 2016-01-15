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

/**
 * Create new item for given object type
 */
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

/**
 *  Update item by id
 */
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
    
    /**
     *  Inactivate item by id
     */
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

/**
 * Delete item by id
 */
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

/**
 *  Update saison events for given member
 */
    app.post('/:object_type/updateSaisonEventsForMember', function (request, response) {
        var object_type, requestedId, id, name, find_map, events, set_map, id, name;

        object_type = request.params.object_type;
        requestedId = request.body.id;
        id = makeMongoId(requestedId);
        name = request.body.name;

        events = request.body.events;
         find_map = {'_id': id, "memberEvents.memberName": name};
        set_map = {"memberEvents.$.saisonEvents": events};
        crud.update(
                object_type,
                find_map,
                set_map,
                function (result_map) {
                    response.json(result_map);
                }
        );
    });

    /**
     * Delete events and delete saison events from members
     */
    app.post('/:object_type/deleteEventsFromSaison', function (request, response) {
        console.log("deleteEventsFromSaison....");
        var empy_result_map = {"delete_count": 0}, object_type, id, members, memberName, events, not_sent = true,
                find_map, set_map;

        object_type = request.params.object_type;
        id = makeMongoId(request.body.id);
        members = request.body.members;
        events = request.body.events;

        if (events === false || events.length === 0) {
            response.json(empy_result_map);
        } else {
            for (var j = 0; j < members.length; j++) {
                memberName = members[j];
                find_map = {'_id': id, "memberEvents.memberName": memberName};
                set_map = {"memberEvents.$.saisonEvents": {"eventName": {$in: events}}};
                crud.pull(
                        object_type,
                        find_map,
                        set_map,
                        function (result_map) {
                            // do nothing
                        }
                );
            }

            find_map = {'_id': id};
            set_map = {"events": {$in: events}};
            crud.pull(
                    object_type,
                    find_map,
                    set_map,
                    function (result_map) {
                        if (not_sent) {
                            response.json(result_map);
                            not_sent = false;
                        }
                    }
            );
        }

    });

    /**
     * Add events and add saison events to members
     */
    app.post('/:object_type/addEventsToSaison', function (request, response) {
        console.log("ROUTE addEventsToSaison....");
        var empy_result_map = {"add_count": 0}, object_type, id, members, _member, events, saisonEvents, find_member_map, push_all_map;

        object_type = request.params.object_type;
        id = makeMongoId(request.body.id);
        events = request.body.events;
        members = request.body.members;
        saisonEvents = request.body.saisonEvents;

        if (events === false || events.length === 0) {
            response.json(empy_result_map);
        } else {
            // first step: delete saiosn events
            for (var j = 0; j < members.length; j++) {
                _member = members[j];
                find_member_map = {'_id': id, "memberEvents.memberName": _member};
                push_all_map = {"memberEvents.$.saisonEvents": saisonEvents};
                crud.pushAll(
                        object_type,
                        find_member_map,
                        push_all_map,
                        function (result_map) {
                            // Do nothing
                        }
                );

            }
            // second step: delete events 
            var find_map = {'_id': id};
            var set_map = {"events": events};
            var not_sent = true;
            crud.pushAll(
                    object_type,
                    find_map,
                    set_map,
                    function (result_map) {

                        if (not_sent) {
                            response.json(result_map);
                            not_sent = false;
                        }
                    }
            );
        }

    });


    /**
     * Delete members & member events from saison
     */
    app.post('/:object_type/deleteMembersFromSaison', function (request, response) {
        console.log("ROUTE: deleteMembersFromSaison....");
        var empy_result_map = {"delete_count": 0}, object_type, id, members, find_map, set_map;

        object_type = request.params.object_type;
        id = makeMongoId(request.body.id);
        members = request.body.members;

        if (members === false || members.length === 0) {
            response.json(empy_result_map);
        } else {
            find_map = {'_id': id};
            set_map = {"memberEvents": {"memberName": {$in: members}}, "members": {$in: members}};
            crud.pull(
                    object_type,
                    find_map,
                    set_map,
                    function (result_map) {
                        response.json(result_map);

                    }
            );
        }
    });

    /**
     *  Add members and member vents to the saison
     */
    app.post('/:object_type/addMembersToSaison', function (request, response) {
        console.log("ROUTE addMembersToSaison....");
        var empy_result_map = {"add_count": 0}, object_type, id, members, memberEvents, find_map, set_map;

        object_type = request.params.object_type;
        id = makeMongoId(request.body.id);
        members = request.body.members;
        memberEvents = request.body.memberEvents;

        if (members === false || members.length === 0) {
            response.json(empy_result_map);
        } else {
            find_map = {'_id': id};
            set_map = {memberEvents: memberEvents, members: members};
            crud.pushAll(
                    object_type,
                    find_map,
                    set_map,
                    function (result_map) {
                        response.json(result_map);
                    }
            );
        }
    });


// end configRoutes
};
console.log('ROUTE module loaded now ');
module.exports = {configRoutes: configRoutes};


