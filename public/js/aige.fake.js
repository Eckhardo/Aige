/*
 * aige.fake.js
 * Fake module
 */

/*jslint         browser : true, continue : true,
 devel  : true, indent  : 2,    maxerr   : 50,
 newcap : true, nomen   : true, plusplus : true,
 regexp : true, sloppy  : true, vars     : false,
 white  : true
 */
/*global $, aige */

aige.fake = (function () {
    'use strict';
    var ajax_call;


    ajax_call = (function () {
        var _check_auth, _find_all_members, _find_active_members, _delete_member, _update_member, _create_member, _find_members_for_membership, _update_active_members_for_membership;

        _check_auth = function (username) {
            var userString = JSON.stringify({name: username});
            var promise = $.Deferred();
            $.ajax('/member/login', {
                type: 'POST',
                data: userString,
                success: function (result) {
                    promise.resolve(result);
                },
                timeout: 3000,
                dataType: 'json',
                contentType: 'application/json',
                error: function () {
                    var error = 'invalid username';
                    promise.reject(error);
                }
            });
            return promise;
        };
        _create_member = function(member){
                    var memberString = JSON.stringify({member: member});
            
            var promise = $.Deferred();
            $.ajax('/member/createMember', {
                type: 'POST',
                success: function (result) {
                     promise.resolve(result);
                },
                data: memberString,
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
        _update_member = function (member) {
            var memberString = JSON.stringify({member: member});
            
            var promise = $.Deferred();
            $.ajax('/member/updateMember', {
                type: 'POST',
                success: function (result) {
                     promise.resolve(result);
                },
                data: memberString,
                timeout: 3000,
                dataType: 'json',
                contentType: 'application/json',
                error: function (result) {
                    console.log("update reject =" + JSON.stringify(result));
                    promise.reject(result);
                }
            });
            return promise;
        };
        _delete_member = function (memberID) {
            var memberString = JSON.stringify({memberid: memberID});
            console.log("delete ajax =" + memberString);
            var promise = $.Deferred();
            $.ajax('/member/deleteByInactivate', {
                type: 'POST',
                success: function (result) {
                    console.log("delete succsess =");
                    promise.resolve(result);
                },
                data: memberString,
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
        _find_active_members = function () {

            var promise = $.Deferred();
            $.ajax('/member/findActiveMembers', {
                type: 'POST',
                success: function (result) {
                    promise.resolve(result);
                },
                timeout: 3000,
                dataType: 'json',
                contentType: 'application/json',
                error: function () {
                    var error = 'invalid request';
                    promise.reject(error);
                }
            });
            return promise;
        };

        _find_all_members = function () {

            var promise = $.Deferred();
            $.ajax('/member/findMembers', {
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
        _find_members_for_membership = function () {

            var promise = $.Deferred();
            $.ajax('/membership/findRegisteredMembers', {
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
        _update_active_members_for_membership = function (memberIds) {
            var idsString = JSON.stringify({members: memberIds});
            var promise = $.Deferred();
            $.ajax('/membership/updateActiveMembers', {
                type: 'POST',
                success: function (result) {
                    promise.resolve(result);
                },
                data: idsString,
                timeout: 3000,
                dataType: 'json',
                contentType: 'application/json',
                error: function (result) {
                    promise.reject(result);
                }
            });
            return promise;
        };
        return {checklogin: _check_auth, deleteMember: _delete_member, updateMember: _update_member, createMember:_create_member, findActiveMembers: _find_active_members, findAllMembers: _find_all_members, findMembersForMembership: _find_members_for_membership, updateActiveMembersForMembership: _update_active_members_for_membership};
    }());

    return {ajaxCall: ajax_call};
}());