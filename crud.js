/* 
 module to provide routing
 */
/*
 * crud.js - module to provide basic crud actions against MongoDB.
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
var checkType, constructObject, readObject, updateObject, pushAll,pull,
        destroyObject, mongo, db, ObjectID, makeMongoId, objectTypeMap

mongo = require('mongoskin');
ObjectID = mongo.ObjectID;
db = mongo.db("mongodb://127.0.0.1/aige", {native_parser: true});
//db = mongo.db("mongodb://heroku_0km7pw02:fhqjappnkttvhhfk8ll6ddqku2@ds035975.mongolab.com:35975/heroku_0km7pw02", {native_parser: true});

objectTypeMap = {'member': {}, 'membership': {}, 'event': {}, 'saison': {}, 'message': {}, 'task':{}};
//------------- END MODULE SCOPED VARIABLES ------------------

//------------- BEGIN PUBLIC METHODS ------------------

/**
 * 
 * @param {type} id
 * @returns {unresolved}
 */
makeMongoId = function (id) {
    return ObjectID.createFromHexString(id);
};

/**
 * 
 * @param {type} obj_type
 * @returns {nm$_crud.checkType.crudAnonym$1}
 */
checkType = function (obj_type) {
    if (!objectTypeMap[obj_type]) {
        console.log("check type  =" + obj_type);
        return ({error_msg: 'Object Type' + obj_type + ' is not supported'});
    }
    return null;

};
/**
 * 
 * @param {type} obj_type
 * @param {type} obj_map
 * @param {type} callback
 * @returns {undefined}
 */
constructObject = function (obj_type, obj_map, callback) {
    console.log("crud create obj_map =" + JSON.stringify(obj_map));
    var type_check_map = checkType(obj_type);
    if (type_check_map) {
        callback(type_check_map);
        return;
    }
    db.collection(obj_type, function (errors, collection) {
        if (errors) {
            callback(errors);
            return;
        }

        var options_map = {safe: true};
        collection.insert(obj_map, options_map, function (error, result_map) {
            if (error) {
                callback(result_map);
            }
            callback(result_map);
        });
    });
};
/**
 * 
 * @param {type} obj_type
 * @param {type} find_map
 * @param {type} fields_map
 * @param {type} callback
 * @returns {undefined}
 */
readObject = function (obj_type, find_map, fields_map, callback) {
    var type_check_map = checkType(obj_type);
    if (type_check_map) {
        callback(type_check_map);
        return;
    }

    db.collection(obj_type, function (errors, collection) {
        if (errors) {
            callback(errors);
            return;
        }

        collection.find(find_map, fields_map).toArray(function (error, result_map) {
            if (errors) {
                callback(result_map);
            }
            callback(result_map);
        });
    });
};
/**
 * 
 * @param {type} obj_type
 * @param {type} find_map
 * @param {type} set_map
 * @param {type} callback
 * @returns {undefined}
 */
updateObject = function (obj_type, find_map, set_map, callback) {
    console.log("crud update find map =" + JSON.stringify(find_map));
    var type_check_map = checkType(obj_type);
    if (type_check_map) {
        callback(type_check_map);
        return;
    }

    db.collection(obj_type, function (errors, collection) {
        if (errors) {
            callback(errors);
            return;
        }
        var options_map = {safe: true, multi: true, upsert: false};
        console.log("crud update set_map" + JSON.stringify(set_map));
        collection.update(find_map, {$set: set_map}, options_map, function (error, update_count) {
            if (errors) {
                callback(error);
            }
            callback({update_count: update_count});
        });
    });

};


/**
 * 
 * @param {type} obj_type
 * @param {type} find_map
 * @param {type} set_map
 * @param {type} callback
 * @returns {undefined}
 */
pushAll = function (obj_type, find_map, set_map, callback) {
    console.log("crud push all find map =" + JSON.stringify(find_map));
         console.log("crud push all set_map" + JSON.stringify(set_map));
    var type_check_map = checkType(obj_type);
    if (type_check_map) {
        callback(type_check_map);
        return;
    }

    db.collection(obj_type, function (errors, collection) {
        if (errors) {
            callback(errors);
            return;
        }
        var options_map = {safe: true, multi: false, upsert: false};
   
        collection.update(find_map, {$pushAll: set_map}, options_map, function (error, push_all_count) {
            if (errors) {
                callback(error);
            }
            callback({push_all_count: push_all_count});
        });
    });

};




/**
 * 
 * @param {type} obj_type
 * @param {type} find_map
 * @param {type} set_map
 * @param {type} callback
 * @returns {undefined}
 */
pull = function (obj_type, find_map, set_map, callback) {
    console.log("crud pull all find map =" + JSON.stringify(find_map));
      console.log("crud pull set_map" + JSON.stringify(set_map));
    var type_check_map = checkType(obj_type);
    if (type_check_map) {
        callback(type_check_map);
        return;
    }

    db.collection(obj_type, function (errors, collection) {
        if (errors) {
            callback(errors);
            return;
        }
        var options_map = {safe: true, multi: false, upsert: false};
      
        collection.update(find_map, {$pull: set_map}, options_map, function (error, push_all_count) {
            if (errors) {
                callback(error);
            }
            callback({push_all_count: push_all_count});
        });
    });

};
/**
 * 
 * @param {type} obj_type
 * @param {type} find_map
 * @param {type} callback
 * @returns {undefined}
 */
destroyObject = function (obj_type, find_map, callback) {
    var type_check_map = checkType(obj_type);
    if (type_check_map) {
        callback(type_check_map);
        return;
    }
    db.collection(obj_type, function (errors, collection) {
        if (errors) {
            callback(errors);
            return;
        }
        var options_map = {safe: true, single: true};

        collection.remove(find_map, options_map, function (error, delete_count) {
            if (errors) {
                callback(error);
            }
            callback({delete_count: delete_count});
        });
    });
};

module.exports = {checkType: checkType,
    makeMongoId: makeMongoId,
    construct: constructObject,
    read: readObject,
    update: updateObject,
    destroy: destroyObject,
    pull:pull,
    pushAll:pushAll
};

//------------- END PUBLIC METHODS ------------------


//------------- BEGIN MODULE INITIALIZATION ------------------

console.log(" CRUD module loaded.");