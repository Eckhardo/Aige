/*
 * aige.model.js
 
 
 */

/*jslint         browser : true, continue : true,
 devel  : true, indent  : 2,    maxerr   : 50,
 newcap : true, nomen   : true, plusplus : true,
 regexp : true, sloppy  : true, vars     : false,
 white  : true
 */

/*global  $, aige, Event */

aige.model = (function () {

    //---------------- BEGIN MODULE SCOPE VARIABLES --------------
    'use strict';

    var configMap = {
        settable_map: {
            objectTypes: true
        },
        objectTypes: null
    },
    stateMap = {
        count_db_result: null,
        member_id_map: {},
        membership_id_map: {},
        event_id_map: {},
        saison_id_map: {},
        current_member: null,
        current_membership: null,
        current_saison: null,
        member_list: [],
        membership_list: [],
        event_list: [],
        saison_list: [],
        unreg_membership_events: [],
        unreg_membership_members: [],
        ajaxCall: null

    },
    general, member, membership, event, saison, initModule, configModule;

    //----------------- END MODULE SCOPE VARIABLES ---------------

    //----------------- START UTILITY FUNCTIONS-----------------
    function  clear_state_maps(object_type) {
        console.log("clear state maps");
        if (object_type === configMap.objectTypes.member) {
            stateMap.member_list = [];
            stateMap.member_id_map = {};
        }
        else if (object_type === configMap.objectTypes.membership) {
            stateMap.membership_list = [];
            stateMap.membership_id_map = {};
            stateMap.current_membership = null;
        }
        else if (object_type === configMap.objectTypes.event) {
            stateMap.event_list = [];
            stateMap.event_id_map = {};
        }
        else if (object_type === configMap.objectTypes.saison) {
            stateMap.saison_list = [];
            stateMap.saison_id_map = {};
            stateMap.current_saison = null;
        }
    }
    ;
    function fill_state_maps(object_type, item_list) {
        console.log("fill state maps");
        var i = 0, my_member, my_event, my_membership, my_saison;
        if (object_type === configMap.objectTypes.member) {
            stateMap.member_list = item_list;
            for (i = 0; i < stateMap.member_list.length; i++) {
                my_member = stateMap.member_list[i];
                stateMap.member_id_map[my_member._id] = my_member;
            }
        }
        else if (object_type === configMap.objectTypes.membership) {
            stateMap.membership_list = item_list;
            for (i = 0; i < stateMap.membership_list.length; i++) {
                stateMap.current_membership = stateMap.membership_list[i];
                my_membership = stateMap.membership_list[i];
                if (my_membership.isActive) {
                    stateMap.current_membership = my_membership;

                }
                stateMap.membership_id_map[my_membership._id] = my_membership;
            }
        }
        else if (object_type === configMap.objectTypes.event) {
            stateMap.event_list = item_list;
            for (i = 0; i < stateMap.event_list.length; i++) {
                my_event = stateMap.event_list[i];
                stateMap.event_id_map[my_event._id] = my_event;
            }
        }
        else if (object_type === configMap.objectTypes.saison) {
            console.log("fill saison state map");
            stateMap.saison_list = item_list;
            for (i = 0; i < stateMap.saison_list.length; i++) {
                my_saison = stateMap.saison_list[i];

                stateMap.current_saison = my_saison;
                stateMap.saison_id_map[my_saison._id] = my_saison;
            }
        }
    }
    ;
//----------------- END UTILITY FUNCTIONS-----------------

    // The general model object API
    // -------------------
    // The general object is available at all featrue modules.
    // The general model object provides methods and events to manage
    // CRUD actions. Its public methods include:
    //  * count_db_action() - 
    //  * find_all(object_type, callback) - 
    //  * search(object_type, searchParams, callback) -
    //  * delete_item( <object_type, item_id, callback> ) -
    //  * inactivate_item( <object_type, item_id, callback> ) -
    general = (function () {
        var count_db_action,
                find_all,
                search,
                inactivate_item, delete_item,
                create_item,
                update_item,
                get_by_id,
                get_items;


        count_db_action = function () {
            return stateMap.count_db_result;
        };

        /**
         * 
         * @param {type} object_type - the domain type
         * @param {type} callback the callback function
         * @returns {undefined}
         */
        find_all = function (object_type, callback) {
            console.log("find all:model");
            var find_all_promise = stateMap.ajaxCall.findAll(object_type);
            find_all_promise.done(function (item_list) {
                clear_state_maps(object_type);
                fill_state_maps(object_type, item_list);
                if (callback) {
                    callback(null);
                }
            }).fail(function (error) {
                if (callback) {
                    setTimeout(function () {
                        callback(error);
                    }, 3000);
                }
            });
        };

        /**
         * 
         * @param {type} object_type
         * @param {type} searchParams
         * @param {type} callback
         * @returns {undefined}
         */
        search = function (object_type, searchParams, callback) {

            var find_all_promise = stateMap.ajaxCall.search(object_type, searchParams);

            find_all_promise.done(function (item_list) {
                console.log("search result = " + JSON.stringify(item_list));
                clear_state_maps(object_type);
                fill_state_maps(object_type, item_list);
                if (callback) {
                    callback(null);
                }
            }).fail(function (error) {
                if (callback) {
                    setTimeout(function () {
                        callback(error);
                    }, 3000);
                }
            });
        };

        /**
         * 
         * @param {type} object_type
         * @param {type} item_id
         * @param {type} callback
         * @param {type} searchParams
         * @returns {undefined}
         */
        delete_item = function (object_type, item_id, callback, searchParams) {
            var find_all_promise, deletePromise = stateMap.ajaxCall.deleteItem(object_type, item_id);
            clear_state_maps(object_type);
            deletePromise.done(function (countDeletes) {
                stateMap.count_db_result = countDeletes;
                if (searchParams) {
                    find_all_promise = stateMap.ajaxCall.search(object_type, searchParams);
                }
                else {
                    find_all_promise = stateMap.ajaxCall.findAll(object_type);
                }
                find_all_promise.done(function (item_list) {
                    console.log("item list =" + JSON.stringify(item_list));
                    fill_state_maps(object_type, item_list);
                    callback(null);
                }).fail(function (error) {
                    setTimeout(function () {
                        callback(error);
                    }, 3000);
                });

            }).fail(function (error) {
                setTimeout(function () {
                    callback(error);
                }, 3000);
            });

        };
        /**
         * 
         * @param {type} object_type
         * @param {type} item_id
         * @param {type} callback
         * @param {type} searchParams
         * @returns {undefined}
         */
        inactivate_item = function (object_type, item_id, callback, searchParams) {
            var find_all_promise, deletePromise = stateMap.ajaxCall.deactivateItem(object_type, item_id);
            clear_state_maps(object_type);
            deletePromise.done(function (countDeletes) {
                stateMap.count_db_result = countDeletes;
                if (searchParams) {
                    find_all_promise = stateMap.ajaxCall.search(object_type, searchParams);
                }
                else {
                    find_all_promise = stateMap.ajaxCall.findAll(object_type);
                }
                find_all_promise.done(function (item_list) {
                    fill_state_maps(object_type, item_list);
                    callback(null);
                }).fail(function (error) {
                    setTimeout(function () {
                        callback(error);
                    }, 3000);
                });

            }).fail(function (error) {
                setTimeout(function () {
                    callback(error);
                }, 3000);
            });

        };

        /**
         * 
         * @param {type} object_type
         * @param {type} item
         * @param {type} callback
         * @param {type} searchParams
         * @returns {undefined}
         */
        create_item = function (object_type, item, callback, searchParams) {
            console.log("creare  new =" + JSON.stringify(item) + " object type=" + object_type);
            var find_all_promise, create_promise = stateMap.ajaxCall.createItem(object_type, item);
            clear_state_maps(object_type);
            create_promise.done(function (count_inserts) {
                stateMap.count_db_result = count_inserts;
                if (searchParams) {
                    find_all_promise = stateMap.ajaxCall.search(object_type, searchParams);
                }
                else {
                    find_all_promise = stateMap.ajaxCall.findAll(object_type);
                }
                find_all_promise.done(function (item_list) {
                    fill_state_maps(object_type, item_list);
                    callback(null);
                }).fail(function (error) {
                    setTimeout(function () {
                        callback(error);
                    }, 3000);
                });
            }).fail(function (error) {
                setTimeout(function () {
                    callback(error);
                }, 3000);
            });


        };

        /**
         * 
         * @param {type} object_type
         * @param {type} item
         * @param {type} callback
         * @param {type} searchParams
         * @returns {undefined}
         */
        update_item = function (object_type, item, callback, searchParams) {
            console.log("update  =" + JSON.stringify(item) + " object type=" + object_type);
            var find_all_promise, update_promise = stateMap.ajaxCall.updateItem(object_type, item);
            clear_state_maps(object_type);
            update_promise.done(function (count_updates) {
                stateMap.count_db_result = count_updates;
                if (searchParams) {
                    find_all_promise = stateMap.ajaxCall.search(object_type, searchParams);
                }
                else {
                    find_all_promise = stateMap.ajaxCall.findAll(object_type);
                }
                find_all_promise.done(function (item_list) {

                    fill_state_maps(object_type, item_list);
                    callback(null);
                }).fail(function (error) {
                    setTimeout(function () {
                        callback(error);
                    }, 3000);
                });
            }).fail(function (error) {
                setTimeout(function () {
                    callback(error);
                }, 3000);
            });

        };
        /**
         * 
         * @param {type} object_type
         * @param {type} id
         * @returns {stateMap.saison_id_map|stateMap.membership_id_map|stateMap.event_id_map|stateMap.member_id_map}
         */
        get_by_id = function (object_type, id) {
            if (object_type === configMap.objectTypes.member) {
                return stateMap.member_id_map[id];
            }
            else if (object_type === configMap.objectTypes.membership) {
                return stateMap.membership_id_map[id];
            }
            else if (object_type === configMap.objectTypes.event) {
                return stateMap.event_id_map[id];
            }
            else if (object_type === configMap.objectTypes.saison) {
                return stateMap.saison_id_map[id];
            }
        };
        /**
         * 
         * @param {type} object_type
         * @returns {Array|stateMap.member_list|stateMap.saison_list|stateMap.membership_list|stateMap.event_list}
         */
        get_items = function (object_type) {

            console.log(" get items");
            if (object_type === configMap.objectTypes.member) {
                return stateMap.member_list;
            }
            else if (object_type === configMap.objectTypes.membership) {
                return stateMap.membership_list;
            }
            else if (object_type === configMap.objectTypes.event) {
                return stateMap.event_list;
            }
            else if (object_type === configMap.objectTypes.saison) {
                return stateMap.saison_list;
            }
        };

        return {findAll: find_all,
            search: search,
            inactivateItem: inactivate_item,
            deleteItem: delete_item,
            createItem: create_item,
            updateItem: update_item,
            countResult: count_db_action,
            getById: get_by_id,
            getItems: get_items};
    }());

    // The model.member object API
    // -------------------
    // This APi comprises membership specific public methods and works closely togehter
    // with the   model.general object API (this provides generic methods for CRUD, and places the results
    // via the whole model available methods fill_state_maps.
    // The membership object is available at aige.model.membeship.
    // The membership object provides dinstinct methods  to manage
    // memberships. Its public methods include:
    member = (function () {
        var login;
        login = function (searchParams) {
            var loginPromise = stateMap.ajaxCall.search(configMap.objectTypes.member, searchParams);
            loginPromise.done(function (result) {
                if ($.isEmptyObject(result)) {
                    var error = new Error("Unbekannter Benutzer");
                    $.gevent.publish('login-fail', {error: error});
                }
                else {
                    localStorage.setItem("member", JSON.stringify(result));
                    stateMap.current_member = result;
                    $.gevent.publish('login-success', result);
                }
            }).fail(function (error) {
                setTimeout(function () {
                    stateMap.current_member = null;
                    $.gevent.publish('login-fail', {error: error});
                }, 3000);
            });
        };
        return {
            login: login
        };
    }());
    // The model.membership object API
    // -------------------
    // This APi comprises membership specific public methods and works closely togehter
    // with the   model.general object API (this provides generic methods for CRUD, and places the results
    // via the whole model available methods fill_state_maps.
    // The membership object is available at aige.model.membeship.
    // The membership object provides dinstinct methods  to manage
    // memberships. Its public methods include:
    //  * getMembershipById(<id>) - retrieves a membership by its ID using
    //  stateMap.membership_id_map.
    //  * getCurrentMembership() - return the single one active membership,
    //    (only the membership of the current year can be active).
    //  * getMembershipList() - retrieves ALL memberships.
    //  * getUnregisteredEvents() - retrieves all events that have not yet been registered.
    //  *getUnregisteredMembers() -retrieves all members that have not yet been registered.
    //  *findInactiveItems(<memberArray>, <eventArray>, callback  ) -an aige.model.membership-specific 
    //  data retrieval call that retrieves ALL events and ALL members by an ajax call, and later
    //  filters those events and those members, that do not match to the input parameters. These non-matching
    //  events and members are put to stateMap.unregEbvents and stateMap.unregMembers; The callback's only duty is to
    //  captures errors, which can be handled by the feature module aige.membership.
    //
    membership = (function () {
        var get_unregistered_events,
                get_unregistered_members, find_inactive_items, get_current_membership;


        get_unregistered_events = function () {
            return stateMap.unreg_membership_events;
        };
        get_unregistered_members = function () {
            return stateMap.unreg_membership_members;
        };
        get_current_membership = function () {
            return stateMap.current_membership;
        };

        /**
         * 
         * @param {type} memberArray
         * @param {type} eventArray
         * @param {type} searchParams
         * @param {type} callback
         * @returns {undefined}
         */
        find_inactive_items = function (memberArray, eventArray, searchParams, callback) {
            console.log("find inactive items");
            var find_events_promise, find_members_promise, i, myMember, myEvent;
            if (searchParams) {
                find_events_promise = stateMap.ajaxCall.search(configMap.objectTypes.event, searchParams);
            }
            else {
                find_events_promise = stateMap.ajaxCall.findAll(configMap.objectTypes.event);
            }
            find_members_promise = stateMap.ajaxCall.findAll(configMap.objectTypes.member);

            $.when(find_events_promise, find_members_promise).then(function (event_list, member_list) {
                stateMap.unreg_membership_members = [];
                for (i = 0; i < member_list.length; i++) {
                    myMember = member_list[i];
                    console.log("inactive member" + JSON.stringify(myMember));
                    if (myMember.isActive) {
                        if (!aige.util.containsItem(memberArray, myMember.username)) {
                            stateMap.unreg_membership_members.push(myMember.username);
                        }
                    }
                }
                stateMap.unreg_membership_events = [];
                for (i = 0; i < event_list.length; i++) {
                    myEvent = event_list[i];
                    console.log("inactive event" + JSON.stringify(myEvent));
                    if (myEvent.isActive) {
                        if (!aige.util.containsItem(eventArray, myEvent.name)) {
                            stateMap.unreg_membership_events.push(myEvent.name);
                        }
                    }
                }
                callback(null);
            }).fail(function (error) {
                callback(error);
            });
        };

        return {getUnregisteredEvents: get_unregistered_events,
            getUnregisteredMembers: get_unregistered_members,
            getCurrentMembership: get_current_membership,
            findInactiveItems: find_inactive_items
        };
    }());
// The model.event object API
    // -------------------
    // This APi comprises saison specific public methods and works closely together
    // with the   model.general object API (this provides generic methods for CRUD, and places the results
    // via the whole model available methods fill_state_maps.
    // The event object is available at aige.model.event.
    // The event object provides dinstinct methods  to manage
    // events. Its public methods include:

    //  *makeEventObject(event_map) - retrieves ALL memberships.

    //
    event = (function () {
        var searchByNames, makeEventObject;


        /**
         * Retrieves events  for a given year and prepares prototyped event objects .
         * 
         * 
         * @param {type} searchParams  - the year
         * @param {type} eventNames  list of event names
         * @param {type} callback  error callback
         * @returns {undefined}
         */
        searchByNames = function (searchParams, eventNames, callback) {
            console.log("namens = " + JSON.stringify(eventNames));
            var search_promise = stateMap.ajaxCall.search(configMap.objectTypes.event, searchParams);

            search_promise.done(function (item_list) {
                clear_state_maps(configMap.objectTypes.event);
                console.log(JSON.stringify(item_list));

                var eventObjectArray = [];
                for (var i = 0, len = item_list.length; i < len; i++) {

                    if (aige.util.containsItem(eventNames, item_list[i].name)) {
                        eventObjectArray.push(makeEventObject(item_list[i]));
                        console.log("array =" + JSON.stringify(eventObjectArray));
                    }
                }
                ;
                console.log(JSON.stringify(eventObjectArray));
                fill_state_maps(configMap.objectTypes.event, eventObjectArray);
                if (callback) {
                    callback(null);
                }
            }).fail(function (error) {
                if (callback) {
                    setTimeout(function () {
                        callback(error);
                    }, 3000);
                }
            });
        };

        makeEventObject = function (event_map) {
            return new AigeEvent(event_map);
        };
        var AigeEvent = function (data) {

            if (data) {
                this._id = data._id,
                        this.year = data.year,
                        this.type = data.type,
                        this.name = data.name,
                        this.shortname = data.shortname,
                        this.startDate = data.startDate,
                        this.startTime = data.startTime,
                        this.endTime = data.endTime,
                        this.meetingPoint = data.meetingPoint,
                        this.comments = data.comments,
                        this.isActive = data.isActive;

            }

            return this;
        };


        AigeEvent.prototype.displayName = function ( ) {
            return this.name + ' (' + this.startDate + ' : ' + this.startTime + '), ' + this.meetingPoint + ')';

        };
        return {searchByNames: searchByNames,
            makeEventObject: makeEventObject};
    }());
// The model.saison object API
    // -------------------
    // This APi comprises saison specific public methods and works closely together
    // with the   model.general object API (this provides generic methods for CRUD, and places the results
    // via the whole model available methods fill_state_maps.
    // The membership object is available at aige.model.membeship.
    // The membership object provides dinstinct methods  to manage
    // memberships. Its public methods include:
    //  * getMembershipById(<id>) - retrieves a membership by its ID using
    //  stateMap.membership_id_map.
    //  * getCurrentMembership() - return the single one active membership,
    //    (only the membership of the current year can be active).
    //  * getMembershipList() - retrieves ALL memberships.
    //  * getUnregisteredEvents() - retrieves all events that have not yet been registered.
    //  *getUnregisteredMembers() -retrieves all members that have not yet been registered.
    //  *findInactiveItems(<memberArray>, <eventArray>, callback  ) -an aige.model.membership-specific 
    //  data retrieval call that retrieves ALL events and ALL members by an ajax call, and later
    //  filters those events and those members, that do not match to the input parameters. These non-matching
    //  events and members are put to stateMap.unregEbvents and stateMap.unregMembers; The callback's only duty is to
    //  captures errors, which can be handled by the feature module aige.membership.
    //
    saison = (function () {
        var make_saison, create_saison, update_member_events,
                get_saison_by_membership_id, get_current_saison, get_saison_for_member;

        //

        make_saison = function (membership_map) {
            return new AigeSaison(membership_map);
        };

        var AigeSaison = function (membership_map) {
            if (membership_map) {

                console.log("ms = " + JSON.stringify(membership_map));

                this.year = membership_map.year;
                this.name = membership_map.name;
                this.comment = membership_map.comment;
                this.isActive = membership_map.isActive;
                this.events = membership_map.events;
                this.memberEvents = [];


                var i, j, myMember, myEvent;

                for (i = 0; i <= membership_map.members.length; i++) {
                    myMember = {memberName: membership_map.members[i], saisonEvents: []};
                    for (j = 0; j < this.events.length; j++) {
                        myEvent = {eventName: this.events[j], confirmed: false, tookPart: false};
                        myMember.saisonEvents.push(myEvent);
                    }
                    this.memberEvents.push(myMember);
                }
            }
            return this;
        };

        /**
         * 
         */
        AigeSaison.prototype.saisonProto = {
            get_is_active: function () {
                return this.isActive;
            }
        };
        /**
         * 
         * @param {type} membership
         * @param {type} callback
         * @returns {undefined}
         */
        create_saison = function (membership, callback) {
            stateMap.current_saison = make_saison(membership);
            console.log("current saison new =" + JSON.stringify(stateMap.current_saison));

            aige.model.general.createItem(configMap.objectTypes.saison, stateMap.current_saison, function (error) {
                if (error) {
                    callback(error);
                }
                else {
                    callback(null);
                }
            });
        };


        /**
         * This routine captures user inputs (checked/unchecked checkboxes represening whether a user 
         * would confimr to take part at an event and/or actually took part (for hsitory).
         * @param {type} saisonId the saison
         * @param {type} memberName the member of choice for the sasion
         * @param {type} checkedFormParamEventKeys - checked checkboxes representing whehther
         *  an event is confirmed and/or tookPart
         * @param {type} eventKeyValues - the 'original' values (confimred && || tookpart) for each event
         * @param {type} callback a callback thhat handles errors and delegates to the view.
         * @returns {undefined}
         */
        update_member_events = function (saisonId, memberName, checkedFormParamEventKeys, eventKeyValues, callback) {
            console.log("checkedFormParamEventKeys=" + JSON.stringify(checkedFormParamEventKeys));
            console.log("eventKeyValues=" + JSON.stringify(eventKeyValues));
            var saisonEvents = extractSaisonEvents(checkedFormParamEventKeys, eventKeyValues),
                    searchParams = {searchParams: {isActive: true}}, update_promise, find_all_promise;
            console.log("saisonEvents=" + JSON.stringify(saisonEvents));
            update_promise = stateMap.ajaxCall.updateEvents(configMap.objectTypes.saison, saisonId, memberName, saisonEvents);
            clear_state_maps(configMap.objectTypes.saison);
            update_promise.done(function (count_updates) {
                stateMap.count_db_result = count_updates;
                find_all_promise = stateMap.ajaxCall.search(configMap.objectTypes.saison, searchParams);
                find_all_promise.done(function (item_list) {
                    fill_state_maps(configMap.objectTypes.saison, item_list);
                    callback(null);
                }).fail(function (error) {
                    setTimeout(function () {
                        callback(error);
                    }, 3000);
                });
            }).fail(function (error) {
                setTimeout(function () {
                    callback(error);
                }, 3000);
            });

        };
        function extractSaisonEvents(checkedFormParamEventKeys, eventKeyValues) {
            var saisonEvents = [], myEvent = {}, eventName, latestEventName, createNewEvent, j = 0;
            for (var field in eventKeyValues) {
                if (eventKeyValues.hasOwnProperty(field)) {
                    var saison_event = eventKeyValues[field];
                    for (var event_key in saison_event) {
                        var eventNameStatusNameArray = event_key.split("XYZ", event_key.length);
                        for (j = 0; j < eventNameStatusNameArray.length; j++) {
                            if (j === 0) {
                                eventName = eventNameStatusNameArray[j];
                                latestEventName === eventName ? createNewEvent = true :
                                        myEvent.eventName = eventName;
                            }
                            else {
                                if (checkedFormParamEventKeys[event_key]) {
                                    eventNameStatusNameArray[j] === "confirmed" ?
                                            myEvent.confirmed = true : myEvent.tookPart = true;
                                }
                                else {
                                    eventNameStatusNameArray[j] === "confirmed" ?
                                            myEvent.confirmed = false : myEvent.tookPart = false;

                                }
                            }
                        }

                    }
                    if (createNewEvent) {
                        saisonEvents.push(myEvent);
                        myEvent = {};
                        createNewEvent = false;
                    }

                    latestEventName = eventName;
                }
            }
            return saisonEvents;
        }

        get_saison_for_member = function (name, callback) {
            
            var result, members = stateMap.current_saison.memberEvents,
            membersLength = members.length;

            for (var i = 0; i < membersLength; i++) {
                if (members[i].memberName === name) {
                   result=  members[i];
                   break;
                }
            }
            callback(result);
        };


        get_current_saison = function () {
            return stateMap.current_saison;
        };

        get_saison_by_membership_id = function (membership_id) {
            return stateMap.saison_id_map[membership_id];
        };

        return {
            getSaisonByMembershipId: get_saison_by_membership_id,
            createSaison: create_saison,
            updateMemberEvents: update_member_events,
            getSaisonForMember: get_saison_for_member,
            getCurrentSaison: get_current_saison};
    }());
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
    // Purpose    : Initializes module with collection specific ajax calls;
    // Arguments  :

    // Returns    : true
    // Throws     : none
    //
    initModule = function () {
        stateMap.ajaxCall = aige.data.ajaxCall;
        return true;
    };
    // End public method /initModule/

    // return public methods
    return {
        configModule: configModule,
        initModule: initModule,
        general: general,
        member: member,
        membership: membership,
        event: event,
        saison: saison
    };
    //------------------- END PUBLIC METHODS ---------------------
}());

