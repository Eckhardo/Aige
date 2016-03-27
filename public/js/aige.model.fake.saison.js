/*
 * aige.model.saison
 
 
 */

/*jslint         browser : true, continue : true,
 devel  : true, indent  : 2,    maxerr   : 50,
 newcap : true, nomen   : true, plusplus : true,
 regexp : true, sloppy  : true, vars     : false,
 white  : true
 */

/*global  $, aige, Event */

aige.model.fake.saison = (function () {

    //---------------- BEGIN MODULE SCOPE VARIABLES --------------
    'use strict';

    var configMap = {
        settable_map: {
            objectTypes: true
        },
        objectTypes: null
    },
    stateMap = {
        ajaxCall: null
    },
    initModule, configModule, make_saison, create_saison, update_saison_events_for_member, add_saison__members_and_events,
            delete_saison__members_and_events, get_saison_events_by_name;

    //----------------- END MODULE SCOPE VARIABLES ---------------

    //----------------- START UTILITY FUNCTIONS-----------------
    function make_member_events(members, events) {
        var i, j, _member, _saisonEvent, _member_events = [];
        for (i = 0; i < members.length; i++) {
            _member = {memberName: members[i], saisonEvents: []};
            for (j = 0; j < events.length; j++) {
                _saisonEvent = {eventName: events[j], confirmed: false, tookPart: false};
                _member.saisonEvents.push(_saisonEvent);
            }
            _member_events.push(_member);
        }

        return _member_events;
    }

    function make_saison_events(events) {
        var saison_events = [], _saisonEvent;
        for (var i = 0; i < events.length; i++) {
            _saisonEvent = {eventName: events[i], confirmed: false, tookPart: false};
            saison_events.push(_saisonEvent)
        }
        return saison_events;
    }

    function checkForModifications(membership, saison) {
        var deltas = {addedMembers: [], deletedMembers: [], addedEvents: [],
            deletedEvents: []};
        var members = membership.members;
        var events = membership.events;
        var saisonMembers = saison.members;
        var saisonEvents = saison.events;


        console.log(" members:" + JSON.stringify(members));
        console.log(" saison members: " + JSON.stringify(saisonMembers));
        console.log(" events:" + JSON.stringify(events));
        console.log(" saison events: " + JSON.stringify(saisonEvents));

        deltas.addedMembers = findItems(members, saisonMembers, true);
        deltas.deletedMembers = findItems(members, saisonMembers, false);
        deltas.addedEvents = findItems(events, saisonEvents, true);
        deltas.deletedEvents = findItems(events, saisonEvents, false);
        console.log(" deltas added : " + JSON.stringify(deltas));

        return deltas;
    }

    function findItems(membershipArray, saisonArray, searchAdded) {
        var result = [], _object, checkword;
        if (searchAdded) {
            _object = buildObjectFromArray(saisonArray);
            for (var i = 0; i < membershipArray.length; i++) {
                checkword = membershipArray[i];
                _object[checkword] ? null : result.push(checkword);
            }

        } else {
            _object = buildObjectFromArray(membershipArray);
            for (var i = 0; i < saisonArray.length; i++) {
                checkword = saisonArray[i];
                _object[checkword] ? null : result.push(checkword);
            }
        }
        return result;
    }


    function buildObjectFromArray(array) {
        var result = {};
        if (array) {
            for (var i = 0; i < array.length; i++) {
                result[array[i]] = true;
            }
        }
        return result;
    }
    /**
     * 
     * @param {type} checkedFormParamEventKeys
     * @param {type} eventKeyValues
     * @returns {Array}
     */
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
                        } else {
                            if (checkedFormParamEventKeys[event_key]) {
                                eventNameStatusNameArray[j] === "confirmed" ?
                                        myEvent.confirmed = true : myEvent.tookPart = true;
                            } else {
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

//----------------- END UTILITY FUNCTIONS-----------------


// The model.saison object API
    // -------------------
    // This APi comprises saison specific public methods and works closely together
    // with the   model.general object API (this provides generic methods for CRUD, and places the results
    // via the whole model available methods fill_state_maps.

    make_saison = function (membership_map) {
        return new AigeSaison(membership_map);
    };

    var AigeSaison = function (membership_map) {
        var i, j, _member, _saisonEvent;
        if (membership_map) {
            this.year = membership_map.year;
            this.name = membership_map.name;
            this.comment = membership_map.comment;
            this.isActive = membership_map.isActive;
            this.events = membership_map.events;
            this.members = membership_map.members;
            this.memberEvents = [];

            for (i = 0; i < membership_map.members.length; i++) {
                _member = {memberName: membership_map.members[i], saisonEvents: []};
                for (j = 0; j < this.events.length; j++) {
                    _saisonEvent = {eventName: this.events[j], confirmed: false, tookPart: false};
                    _member.saisonEvents.push(_saisonEvent);
                }
                this.memberEvents.push(_member);
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
        var saison = make_saison(membership);
        console.log("current saison new =" + JSON.stringify(saison));

        aige.model.general.createItem(configMap.objectTypes.saison, saison, function (error) {
            if (error) {
                callback(error);
            } else {
                callback(null);
            }
        });
    };

    /**
     * 
     * @param {type} searchParams
     * @param {type} callback
     * @returns {undefined}
     */
    add_saison__members_and_events = function (searchParams, callback) {
        var _membership, search_membership, _saison, add_events, add_members, search_saison;
        search_membership = stateMap.ajaxCall.search(configMap.objectTypes.membership, searchParams);
        search_membership.done(function (membership_list) {
            // 1. fetch fresh membership
            aige.model.clearStateMaps(configMap.objectTypes.membership);
            aige.model.fillStateMaps(configMap.objectTypes.membership, membership_list);
            _membership = aige.model.general.getCurrentItem(configMap.objectTypes.membership);
            _saison = aige.model.general.getCurrentItem(configMap.objectTypes.saison);
            // 2. look for meber/event candidates to be added/deleted
            var deltas = checkForModifications(_membership, _saison);
            console.log("deltas=" + JSON.stringify(deltas));

            var events = _membership.events;
            var members = _membership.members;


            var memberSaisonEvents = [];

            var saisonEvents = make_saison_events(deltas.addedEvents);
            console.log("add saison events: " + JSON.stringify(saisonEvents));
            if (aige.util.objectFieldsNotEmpty(deltas)) {
                console.log("NOW:  add events: " + JSON.stringify(deltas.addedEvents));
                add_events = stateMap.ajaxCall.addEventsToSaison(configMap.objectTypes.saison, _saison._id, deltas.addedEvents, saisonEvents, members);
                add_events.done(function (count_adds) {
                    console.log("# added events: " + JSON.stringify(count_adds));
                    console.log("NOW:  add members: " + JSON.stringify(deltas.addedMembers));
                    memberSaisonEvents = make_member_events(deltas.addedMembers, events);
                    console.log("# member events: " + JSON.stringify(memberSaisonEvents));
                    add_members = stateMap.ajaxCall.addMembersToSaison(configMap.objectTypes.saison, _saison._id, deltas.addedMembers, memberSaisonEvents);
                    add_members.done(function (count_adds) {
                        console.log("# added members: " + JSON.stringify(count_adds));
                        search_saison = stateMap.ajaxCall.search(configMap.objectTypes.saison, searchParams);
                        search_saison.done(function (item_list) {
                            console.log("# searched done: " + JSON.stringify(count_adds));
                            aige.model.clearStateMaps(configMap.objectTypes.saison);
                            aige.model.fillStateMaps(configMap.objectTypes.saison, item_list);
                            callback(null);
                        }).fail(function (error) {
                            setTimeout(function () {
                                callback(error);
                            }, 3000);
                        });

                    }).fail(function (error) {
                        setTimeout(function () {
                            console.log("# updates error: " + JSON.stringify(error));
                            callback(error);
                        }, 3000);
                    });


                }).fail(function (error) {
                    setTimeout(function () {
                        console.log("callback error 1: " + JSON.stringify(error));
                        callback(error);
                    }, 3000);
                });




            } else {
                // nothing to be updated
                callback(null);
            }
        }).fail(function (error) {
            setTimeout(function () {
                console.log("callback error 3: " + JSON.stringify(error));
                callback(error);
            }, 3000);
        });
    };


    /**
     * 
     * @param {type} searchParams
     * @param {type} callback
     * @returns {undefined}
     */
    delete_saison__members_and_events = function (searchParams, callback) {
        var _membership, search_membership, _saison, delete_events, delete_members, search_saison;
        search_membership = stateMap.ajaxCall.search(configMap.objectTypes.membership, searchParams);
        search_membership.done(function (membership_list) {
            // 1. fetch fresh membership
            aige.model.clearStateMaps(configMap.objectTypes.membership);
            aige.model.fillStateMaps(configMap.objectTypes.membership, membership_list);
            _membership = aige.model.general.getCurrentItem(configMap.objectTypes.membership);
            _saison = aige.model.general.getCurrentItem(configMap.objectTypes.saison);
            // 2. look for meber/event candidates to be added/deleted
            var deltas = checkForModifications(_membership, _saison);
            console.log("deltas=" + JSON.stringify(deltas));
            var members = _membership.members;
            var events = _membership.events;
            var memberSaisonEvents = [];


            if (aige.util.objectFieldsNotEmpty(deltas)) {
                console.log("NOW:  delete members: " + JSON.stringify(deltas.deletedMembers));
                delete_members = stateMap.ajaxCall.deleteMembersFromSaison(configMap.objectTypes.saison, _saison._id, deltas.deletedMembers);
                delete_members.done(function (count_deletes) {
                    console.log("# deleted members: " + JSON.stringify(count_deletes));

                    console.log("NOW:  delete events: " + JSON.stringify(deltas.deletedEvents));
                    delete_events = stateMap.ajaxCall.deleteEventsFromSaison(configMap.objectTypes.saison, _saison._id, deltas.deletedEvents, members);
                    delete_events.done(function (count_deletes) {
                        console.log("# deleted events: " + JSON.stringify(count_deletes));
                        search_saison = stateMap.ajaxCall.search(configMap.objectTypes.saison, searchParams);
                        search_saison.done(function (item_list) {
                            console.log("# searched done: " + JSON.stringify(item_list));
                            aige.model.clearStateMaps(configMap.objectTypes.saison);
                            aige.model.fillStateMaps(configMap.objectTypes.saison, item_list);
                            callback(null);
                        }).fail(function (error) {
                            setTimeout(function () {
                                callback(error);
                            }, 3000);
                        });

                    }).fail(function (error) {
                        setTimeout(function () {
                            console.log("callback error 2: " + JSON.stringify(error));
                            callback(error);
                        }, 3000);
                    });


                }).fail(function (error) {
                    setTimeout(function () {
                        callback(error);
                    }, 3000);
                });



            } else {
                // nothing to be updated
                callback(null);
            }
        }).fail(function (error) {
            setTimeout(function () {
                callback(error);
            }, 3000);
        });

    };



    /**
     * This routine captures user inputs (checked/unchecked checkboxes represening whether a user 
     * would confimr to take part at an event and/or actually took part (for hsitory).
     * @param {type} saisonId - the saison
     * @param {type} memberName the member of choice for the sasion
     * @param {type} checkedFormParamEventKeys - checked checkboxes representing whehther
     *  an event is confirmed and/or tookPart
     * @param {type} eventKeyValues - the 'original' values (confimred && || tookpart) for each event
     * @param {type} callback - a callback thhat handles errors and delegates to the view.
     * @returns {undefined}
     */
    update_saison_events_for_member = function (saisonId, year, memberName, checkedFormParamEventKeys, eventKeyValues, callback) {

        //    console.log("checkedFormParamEventKeys=" + JSON.stringify(checkedFormParamEventKeys));
        //    console.log("eventKeyValues=" + JSON.stringify(eventKeyValues));

        console.log("year=" + JSON.stringify(year));
        var saisonEvents = extractSaisonEvents(checkedFormParamEventKeys, eventKeyValues);
        var searchParams = {searchParams: {year: year}};
        var update, search;

        update = stateMap.ajaxCall.updateSaisonEventsForMember(configMap.objectTypes.saison, saisonId, memberName, saisonEvents);
        aige.model.clearStateMaps(configMap.objectTypes.saison);
        update.done(function (count_updates) {
            search = stateMap.ajaxCall.search(configMap.objectTypes.saison, searchParams);
            search.done(function (item_list) {
                console.log("saions=" + JSON.stringify(item_list));
                aige.model.fillStateMaps(configMap.objectTypes.saison, item_list);
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
     * Fetches the saiosn events for a given name
     * @param {type} name
     * @param {type} callback
     * @returns {undefined}
     */
    get_saison_events_by_name = function (name, callback) {

        var result;
        var saison = aige.model.general.getCurrentItem(configMap.objectTypes.saison);
        var members = saison.memberEvents;
        var membersLength = members.length;

        for (var i = 0; i < membersLength; i++) {
            if (members[i].memberName === name) {
                result = members[i];
                break;
            }
        }
        console.log("saison for member =" + JSON.stringify(result));
        callback(result);
    };



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
        createSaison: create_saison,
        addSaisonEventsAndMembers: add_saison__members_and_events,
        deleteSaisonEventsAndMembers: delete_saison__members_and_events,
        updateSaisonEventsForMember: update_saison_events_for_member,
        getSaisonEventsByName: get_saison_events_by_name
    };
    //------------------- END PUBLIC METHODS ---------------------
}());

