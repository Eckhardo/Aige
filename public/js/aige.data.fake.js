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

aige.data.fake = (function () {
    'use strict';
    var initModule, ajax_call;
    ajax_call = (function () {
        var find_all,
                search,
                deactivate_item,
                delete_item,
                create_item,
                update_item,
                update_saison_events_for_member,
                add_members_to_saison,
                delete_members_from_saison,
                add_events_to_saison,
                delete_events_from_saison,
                add_subtask_to_workingtask, update_subtask_in_workingtask
                ;

        find_all = function (object_type) {
            console.log("find all =" + JSON.stringify(object_type));
            var FakeDeferred = function () {
                this.done = function (fn) {
                    if (object_type === 'member') {
                        fn([{"_id": "567e7461e4b081d81c9eabc1", "firstname": "Eckhard", "lastname": "Kirschning", "username": "Ecki", "password": "abc", "email": "eckhard.kirschning@freenet.de", "zip": "20259", "city": "Hamburg", "address": "Lutterothtstrasse 89", "phone": "", "mobil": "016097023201", "admissionDate": "2008", "isAdmin": true, "isActive": true}, {"_id": "567e7475e4b081d81c9eabc2", "firstname": "Frank", "lastname": "Schneider", "username": "Frank", "password": "abc", "email": "info@schneider-koi.de", "zip": "25451", "city": "Quickborn", "address": "Ulzburger Landstrasse 85", "phone": "04106-620591", "mobil": "0172-5651150", "admissionDate": "2000 ?", "isAdmin": true, "isActive": true}, {"_id": "56812787de0bd70300b5aa47", "firstname": "Christian", "lastname": "Adloff", "username": "Christian", "email": "christian-adloff@web.de", "zip": "25451", "city": "Quickborn", "address": "Eschenweg 18", "phone": "04106-60864", "mobil": "0170-5833680", "admissionDate": "2003", "isActive": true, "isAdmin": true}, {"_id": "56a21b11e77d7a03004d2cae", "firstname": "Serafim", "lastname": "Skafidas", "username": "Serafim", "email": "info@skafidas.de", "zip": "25451", "city": "Quickborn", "address": "Kieler Strasse 6", "phone": "04106-5529", "mobil": "0172-2356324", "admissionDate": "1994 ?", "isActive": true, "isAdmin": true}, {"_id": "56a2274a2bf3c103001c0167", "firstname": "Peter", "lastname": "Gotthard", "username": "Peter", "email": "peter.gotthard@stella-distribution.de", "zip": "25451", "city": "Quickborn", "address": "Langenkamp 48", "phone": "04106-4636", "mobil": "015154056893", "admissionDate": "2013", "isActive": true, "isAdmin": false}, {"_id": "56a267e6b336e80300f990a9", "firstname": "Torsten", "lastname": "Kitzmann", "username": "Torsten", "email": "tkitzmann@freenet.de", "zip": "25474", "city": "Hasloh", "address": "Großer Dorn 5", "phone": "", "mobil": "0173-6379109", "admissionDate": "1999 ?", "isActive": true, "isAdmin": false}, {"_id": "56a2683db336e80300f990aa", "firstname": "Guenter", "lastname": "Hauser", "username": "Guenther", "email": "guenther-hauser@tquick.de", "zip": "25451", "city": "Quickborn", "address": "Marktstrasse 20", "phone": "04106-8042452", "mobil": "0170-4838111", "admissionDate": "1970 ?", "isActive": true, "isAdmin": false}, {"_id": "56a26b90b336e80300f990af", "firstname": "Torge", "lastname": "Grabau", "username": "Torge", "email": "torgegrabau@gmail.com", "zip": "25479", "city": "Ellerau", "address": "Ellerauer Str. 4", "phone": "", "mobil": "0174-9788880", "admissionDate": "2000 ?", "isActive": true, "isAdmin": false}, {"_id": "56a26bfbb336e80300f990b0", "firstname": "Claus-Peter", "lastname": "David", "username": "Claus-Peter", "email": "c.p.david@gmx.de", "zip": "22846", "city": "Norderstedt", "address": "Kastanienweg 19", "phone": "040-5218850", "mobil": "", "admissionDate": "1970 ?", "isActive": true, "isAdmin": true}, {"_id": "56a26c4cb336e80300f990b1", "firstname": "Roland", "lastname": "Gertz", "username": "Rollo", "email": "roland.gertz@airbus.com", "zip": "25451", "city": "Quickborn", "address": "Hermann-Löns-Str. 16a", "phone": "04106-773377", "mobil": "0160-5356523", "admissionDate": "1990 ?", "isActive": true, "isAdmin": false}, {"_id": "56a34a2733bcda030048746c", "firstname": "Stephan", "lastname": "Hauser", "username": "Stephan", "email": "info@stephanhauser.de", "zip": "25451", "city": "Quickborn", "address": "Marktstrasse 20a", "phone": "04106-8042452", "mobil": "0170-4838111", "admissionDate": "2015", "isActive": true, "isAdmin": false}, {"_id": "56a34b9e33bcda030048746d", "firstname": "Clemens", "lastname": "Hansen", "username": "Clemens", "email": "clemens.hansen@t-online.de", "zip": "25451", "city": "Quickborn", "address": "Am Ahrensfeld 25", "phone": "", "mobil": "0157-30445404", "admissionDate": "2014 ?", "isActive": true, "isAdmin": false}, {"_id": "56a34c4233bcda030048746e", "firstname": "Martin", "lastname": "Hansen", "username": "MartinHa", "email": "martin.hansen@tquick.de", "zip": "25451", "city": "Quickborn", "address": "Erlenweg 9", "phone": "04106-4991", "mobil": "0170-3204568", "admissionDate": "1990 ?", "isActive": true, "isAdmin": false}, {"_id": "56a514ed275b960300695f5f", "firstname": "Martin", "lastname": "Heyland", "username": "MartinHe", "email": "", "zip": "25451", "city": "Quickborn", "address": "Hermann-Löns-Str. 16", "phone": "04106-73251", "mobil": "0177-1465429", "admissionDate": "1995 ?", "isActive": true, "isAdmin": false}, {"_id": "56a5157d275b960300695f60", "firstname": "Stefan", "lastname": "Karl", "username": "StefanK", "email": "sk@compu-max.de", "zip": "22419", "city": "Hamburg", "address": "Bärenhof 2", "phone": "040-5279463", "mobil": "0176-30583655", "admissionDate": "2000 ?", "isActive": true, "isAdmin": false}, {"_id": "56a515e7275b960300695f61", "firstname": "Holger", "lastname": "Kilian", "username": "Holger", "email": "umzuege-hamburg@holger-kilian.com", "zip": "22335", "city": "Hamburg", "address": "Niedernstegen 15", "phone": "", "mobil": "0157-74244365", "admissionDate": "2005 ?", "isActive": true, "isAdmin": false}, {"_id": "56a51636275b960300695f62", "firstname": "Jörg", "lastname": "Kunkel", "username": "Jörg", "email": "", "zip": "25451", "city": "Quickborn", "address": "Marktstrasse 25", "phone": "", "mobil": "0151-56930907", "admissionDate": "1990 ?", "isActive": true, "isAdmin": false}, {"_id": "56a51691275b960300695f63", "firstname": "Sven", "lastname": "Lob", "username": "Sven", "email": "sven.lob@web.de", "zip": "25451", "city": "Quickborn", "address": "Potsdamer Kehre 7", "phone": "04106-998575", "mobil": "0176-21698338", "admissionDate": "2000", "isActive": true, "isAdmin": false}, {"_id": "56a51aeffeb534e8224fc30b", "firstname": "Thomas", "lastname": "Mewes", "username": "Thomas", "email": "thomas.mewes@gmx.net", "zip": "22147", "city": "Hamburg", "address": "Scharbeutzer Str. 125 b", "phone": "040-6472956", "mobil": "151-43122459", "admissionDate": "2015", "isActive": true, "isAdmin": false}, {"_id": "56a51b44feb534e8224fc30c", "firstname": "Harald", "lastname": "Möller", "username": "Harald", "email": "mail@oldtimerreifen-moeller.de", "zip": "25451", "city": "Quickborn", "address": "Pascalstr. 10", "phone": "04106-618880", "mobil": "0172-4204063", "admissionDate": "2014", "isActive": true, "isAdmin": false}, {"_id": "56a51bb5feb534e8224fc30d", "firstname": "Rainer", "lastname": "Speckmann", "username": "Rainer", "email": "r.speckmann@loll-feinmechanik.de", "zip": "25451", "city": "Quickborn", "address": "Heinrich-Lohse Str. 1", "phone": "04106-68398", "mobil": "0176-49432775", "admissionDate": "1990", "isActive": true, "isAdmin": false}]
                                );
                    } else if (object_type === 'message') {
                        fn([{
                                "_id": {
                                    "$oid": "56acd85492d28a902b48abb5"
                                },
                                "year": "2016",
                                "name": "Ecki",
                                "shortMessage": "RE:Mitgliederliste",
                                "dateTime": "30/01/2016 @ 16:32:42",
                                "message": "Die Daten, die ich für jedes einzelne Mitglied eingegeben habe, könnten teilweise fehlerhaft sein. Deshalb hatte ich auch in meiner mail vom 28.01. darum gebeten, dass jedes Mitglied mal seine Einträge auf Richtigkeit überprüft.\n\nAlso lieber Rollo: Wenn Du Fehler entdeckst, bitte kurz selber korrigieren.  "
                            }, {
                                "_id": {
                                    "$oid": "56ae5f0c9488ee030050b1d3"
                                },
                                "year": "2016",
                                "name": "Ecki",
                                "shortMessage": "RE:Mitgliederliste",
                                "dateTime": "31/01/2016 @ 19:59:26",
                                "message": "In Deiner abschliessenden Kommentarzeile hast Du von \"einer schlichten Seite \" gesprochen die \"wir noch mit Leben füllen müssen \". \n\nWas genau erscheint Dir als schlicht ? \n\nIch nehme Anregungen gerne auf und meine Aufgabe sehe ich insbesondere darin, auf eure Wünsche einzugehen. Nur Gedanken lesen kann leider nicht.  Du müsstest also schon ein bisschen konkreter werden.\n\nUnd was genau \"müssen wir mit Leben füllen\" ?  \n\nAuch diese Anmerkung erscheint mir ein wenig zu diffus, um daraus irgendeinen konkreten Wunsch ableiten zu können. Wie schon gesagt: Auf Wünsche eingehen kann ich nur, wenn klar wird, was gemeint ist. \n\nHolmes, übernehmen Sie :-)\n\n   \n\n\n\n "
                            }]);
                    }
                };
                this.fail = function (fn) {
                    if (object_type === 'member') {
                        fn([{"_id": "567e7461e4b081d81c9eabc1", "firstname": "Eckhard", "lastname": "Kirschning", "username": "Ecki", "password": "abc", "email": "eckhard.kirschning@freenet.de", "zip": "20259", "city": "Hamburg", "address": "Lutterothtstrasse 89", "phone": "", "mobil": "016097023201", "admissionDate": "2008", "isAdmin": true, "isActive": true}, {"_id": "567e7475e4b081d81c9eabc2", "firstname": "Frank", "lastname": "Schneider", "username": "Frank", "password": "abc", "email": "info@schneider-koi.de", "zip": "25451", "city": "Quickborn", "address": "Ulzburger Landstrasse 85", "phone": "04106-620591", "mobil": "0172-5651150", "admissionDate": "2000 ?", "isAdmin": true, "isActive": true}, {"_id": "56812787de0bd70300b5aa47", "firstname": "Christian", "lastname": "Adloff", "username": "Christian", "email": "christian-adloff@web.de", "zip": "25451", "city": "Quickborn", "address": "Eschenweg 18", "phone": "04106-60864", "mobil": "0170-5833680", "admissionDate": "2003", "isActive": true, "isAdmin": true}, {"_id": "56a21b11e77d7a03004d2cae", "firstname": "Serafim", "lastname": "Skafidas", "username": "Serafim", "email": "info@skafidas.de", "zip": "25451", "city": "Quickborn", "address": "Kieler Strasse 6", "phone": "04106-5529", "mobil": "0172-2356324", "admissionDate": "1994 ?", "isActive": true, "isAdmin": true}, {"_id": "56a2274a2bf3c103001c0167", "firstname": "Peter", "lastname": "Gotthard", "username": "Peter", "email": "peter.gotthard@stella-distribution.de", "zip": "25451", "city": "Quickborn", "address": "Langenkamp 48", "phone": "04106-4636", "mobil": "015154056893", "admissionDate": "2013", "isActive": true, "isAdmin": false}, {"_id": "56a267e6b336e80300f990a9", "firstname": "Torsten", "lastname": "Kitzmann", "username": "Torsten", "email": "tkitzmann@freenet.de", "zip": "25474", "city": "Hasloh", "address": "Großer Dorn 5", "phone": "", "mobil": "0173-6379109", "admissionDate": "1999 ?", "isActive": true, "isAdmin": false}, {"_id": "56a2683db336e80300f990aa", "firstname": "Guenter", "lastname": "Hauser", "username": "Guenther", "email": "guenther-hauser@tquick.de", "zip": "25451", "city": "Quickborn", "address": "Marktstrasse 20", "phone": "04106-8042452", "mobil": "0170-4838111", "admissionDate": "1970 ?", "isActive": true, "isAdmin": false}, {"_id": "56a26b90b336e80300f990af", "firstname": "Torge", "lastname": "Grabau", "username": "Torge", "email": "torgegrabau@gmail.com", "zip": "25479", "city": "Ellerau", "address": "Ellerauer Str. 4", "phone": "", "mobil": "0174-9788880", "admissionDate": "2000 ?", "isActive": true, "isAdmin": false}, {"_id": "56a26bfbb336e80300f990b0", "firstname": "Claus-Peter", "lastname": "David", "username": "Claus-Peter", "email": "c.p.david@gmx.de", "zip": "22846", "city": "Norderstedt", "address": "Kastanienweg 19", "phone": "040-5218850", "mobil": "", "admissionDate": "1970 ?", "isActive": true, "isAdmin": true}, {"_id": "56a26c4cb336e80300f990b1", "firstname": "Roland", "lastname": "Gertz", "username": "Rollo", "email": "roland.gertz@airbus.com", "zip": "25451", "city": "Quickborn", "address": "Hermann-Löns-Str. 16a", "phone": "04106-773377", "mobil": "0160-5356523", "admissionDate": "1990 ?", "isActive": true, "isAdmin": false}, {"_id": "56a34a2733bcda030048746c", "firstname": "Stephan", "lastname": "Hauser", "username": "Stephan", "email": "info@stephanhauser.de", "zip": "25451", "city": "Quickborn", "address": "Marktstrasse 20a", "phone": "04106-8042452", "mobil": "0170-4838111", "admissionDate": "2015", "isActive": true, "isAdmin": false}, {"_id": "56a34b9e33bcda030048746d", "firstname": "Clemens", "lastname": "Hansen", "username": "Clemens", "email": "clemens.hansen@t-online.de", "zip": "25451", "city": "Quickborn", "address": "Am Ahrensfeld 25", "phone": "", "mobil": "0157-30445404", "admissionDate": "2014 ?", "isActive": true, "isAdmin": false}, {"_id": "56a34c4233bcda030048746e", "firstname": "Martin", "lastname": "Hansen", "username": "MartinHa", "email": "martin.hansen@tquick.de", "zip": "25451", "city": "Quickborn", "address": "Erlenweg 9", "phone": "04106-4991", "mobil": "0170-3204568", "admissionDate": "1990 ?", "isActive": true, "isAdmin": false}, {"_id": "56a514ed275b960300695f5f", "firstname": "Martin", "lastname": "Heyland", "username": "MartinHe", "email": "", "zip": "25451", "city": "Quickborn", "address": "Hermann-Löns-Str. 16", "phone": "04106-73251", "mobil": "0177-1465429", "admissionDate": "1995 ?", "isActive": true, "isAdmin": false}, {"_id": "56a5157d275b960300695f60", "firstname": "Stefan", "lastname": "Karl", "username": "StefanK", "email": "sk@compu-max.de", "zip": "22419", "city": "Hamburg", "address": "Bärenhof 2", "phone": "040-5279463", "mobil": "0176-30583655", "admissionDate": "2000 ?", "isActive": true, "isAdmin": false}, {"_id": "56a515e7275b960300695f61", "firstname": "Holger", "lastname": "Kilian", "username": "Holger", "email": "umzuege-hamburg@holger-kilian.com", "zip": "22335", "city": "Hamburg", "address": "Niedernstegen 15", "phone": "", "mobil": "0157-74244365", "admissionDate": "2005 ?", "isActive": true, "isAdmin": false}, {"_id": "56a51636275b960300695f62", "firstname": "Jörg", "lastname": "Kunkel", "username": "Jörg", "email": "", "zip": "25451", "city": "Quickborn", "address": "Marktstrasse 25", "phone": "", "mobil": "0151-56930907", "admissionDate": "1990 ?", "isActive": true, "isAdmin": false}, {"_id": "56a51691275b960300695f63", "firstname": "Sven", "lastname": "Lob", "username": "Sven", "email": "sven.lob@web.de", "zip": "25451", "city": "Quickborn", "address": "Potsdamer Kehre 7", "phone": "04106-998575", "mobil": "0176-21698338", "admissionDate": "2000", "isActive": true, "isAdmin": false}, {"_id": "56a51aeffeb534e8224fc30b", "firstname": "Thomas", "lastname": "Mewes", "username": "Thomas", "email": "thomas.mewes@gmx.net", "zip": "22147", "city": "Hamburg", "address": "Scharbeutzer Str. 125 b", "phone": "040-6472956", "mobil": "151-43122459", "admissionDate": "2015", "isActive": true, "isAdmin": false}, {"_id": "56a51b44feb534e8224fc30c", "firstname": "Harald", "lastname": "Möller", "username": "Harald", "email": "mail@oldtimerreifen-moeller.de", "zip": "25451", "city": "Quickborn", "address": "Pascalstr. 10", "phone": "04106-618880", "mobil": "0172-4204063", "admissionDate": "2014", "isActive": true, "isAdmin": false}, {"_id": "56a51bb5feb534e8224fc30d", "firstname": "Rainer", "lastname": "Speckmann", "username": "Rainer", "email": "r.speckmann@loll-feinmechanik.de", "zip": "25451", "city": "Quickborn", "address": "Heinrich-Lohse Str. 1", "phone": "04106-68398", "mobil": "0176-49432775", "admissionDate": "1990", "isActive": true, "isAdmin": false}]
                                );
                    } else if (object_type === 'message') {
                        fn([{'Error': 'message'}]);
                    }
                };
                this.error = function (fn) {
                    if (object_type === 'member') {
                        fn({Error: 'member'});
                    }
                    return this;
                };
                this.data = function (fn) {
                    if (object_type === 'member') {
                        fn([{"_id": "567e7461e4b081d81c9eabc1", "firstname": "Eckhard", "lastname": "Kirschning", "username": "Ecki", "password": "abc", "email": "eckhard.kirschning@freenet.de", "zip": "20259", "city": "Hamburg", "address": "Lutterothtstrasse 89", "phone": "", "mobil": "016097023201", "admissionDate": "2008", "isAdmin": true, "isActive": true}, {"_id": "567e7475e4b081d81c9eabc2", "firstname": "Frank", "lastname": "Schneider", "username": "Frank", "password": "abc", "email": "info@schneider-koi.de", "zip": "25451", "city": "Quickborn", "address": "Ulzburger Landstrasse 85", "phone": "04106-620591", "mobil": "0172-5651150", "admissionDate": "2000 ?", "isAdmin": true, "isActive": true}, {"_id": "56812787de0bd70300b5aa47", "firstname": "Christian", "lastname": "Adloff", "username": "Christian", "email": "christian-adloff@web.de", "zip": "25451", "city": "Quickborn", "address": "Eschenweg 18", "phone": "04106-60864", "mobil": "0170-5833680", "admissionDate": "2003", "isActive": true, "isAdmin": true}, {"_id": "56a21b11e77d7a03004d2cae", "firstname": "Serafim", "lastname": "Skafidas", "username": "Serafim", "email": "info@skafidas.de", "zip": "25451", "city": "Quickborn", "address": "Kieler Strasse 6", "phone": "04106-5529", "mobil": "0172-2356324", "admissionDate": "1994 ?", "isActive": true, "isAdmin": true}, {"_id": "56a2274a2bf3c103001c0167", "firstname": "Peter", "lastname": "Gotthard", "username": "Peter", "email": "peter.gotthard@stella-distribution.de", "zip": "25451", "city": "Quickborn", "address": "Langenkamp 48", "phone": "04106-4636", "mobil": "015154056893", "admissionDate": "2013", "isActive": true, "isAdmin": false}, {"_id": "56a267e6b336e80300f990a9", "firstname": "Torsten", "lastname": "Kitzmann", "username": "Torsten", "email": "tkitzmann@freenet.de", "zip": "25474", "city": "Hasloh", "address": "Großer Dorn 5", "phone": "", "mobil": "0173-6379109", "admissionDate": "1999 ?", "isActive": true, "isAdmin": false}, {"_id": "56a2683db336e80300f990aa", "firstname": "Guenter", "lastname": "Hauser", "username": "Guenther", "email": "guenther-hauser@tquick.de", "zip": "25451", "city": "Quickborn", "address": "Marktstrasse 20", "phone": "04106-8042452", "mobil": "0170-4838111", "admissionDate": "1970 ?", "isActive": true, "isAdmin": false}, {"_id": "56a26b90b336e80300f990af", "firstname": "Torge", "lastname": "Grabau", "username": "Torge", "email": "torgegrabau@gmail.com", "zip": "25479", "city": "Ellerau", "address": "Ellerauer Str. 4", "phone": "", "mobil": "0174-9788880", "admissionDate": "2000 ?", "isActive": true, "isAdmin": false}, {"_id": "56a26bfbb336e80300f990b0", "firstname": "Claus-Peter", "lastname": "David", "username": "Claus-Peter", "email": "c.p.david@gmx.de", "zip": "22846", "city": "Norderstedt", "address": "Kastanienweg 19", "phone": "040-5218850", "mobil": "", "admissionDate": "1970 ?", "isActive": true, "isAdmin": true}, {"_id": "56a26c4cb336e80300f990b1", "firstname": "Roland", "lastname": "Gertz", "username": "Rollo", "email": "roland.gertz@airbus.com", "zip": "25451", "city": "Quickborn", "address": "Hermann-Löns-Str. 16a", "phone": "04106-773377", "mobil": "0160-5356523", "admissionDate": "1990 ?", "isActive": true, "isAdmin": false}, {"_id": "56a34a2733bcda030048746c", "firstname": "Stephan", "lastname": "Hauser", "username": "Stephan", "email": "info@stephanhauser.de", "zip": "25451", "city": "Quickborn", "address": "Marktstrasse 20a", "phone": "04106-8042452", "mobil": "0170-4838111", "admissionDate": "2015", "isActive": true, "isAdmin": false}, {"_id": "56a34b9e33bcda030048746d", "firstname": "Clemens", "lastname": "Hansen", "username": "Clemens", "email": "clemens.hansen@t-online.de", "zip": "25451", "city": "Quickborn", "address": "Am Ahrensfeld 25", "phone": "", "mobil": "0157-30445404", "admissionDate": "2014 ?", "isActive": true, "isAdmin": false}, {"_id": "56a34c4233bcda030048746e", "firstname": "Martin", "lastname": "Hansen", "username": "MartinHa", "email": "martin.hansen@tquick.de", "zip": "25451", "city": "Quickborn", "address": "Erlenweg 9", "phone": "04106-4991", "mobil": "0170-3204568", "admissionDate": "1990 ?", "isActive": true, "isAdmin": false}, {"_id": "56a514ed275b960300695f5f", "firstname": "Martin", "lastname": "Heyland", "username": "MartinHe", "email": "", "zip": "25451", "city": "Quickborn", "address": "Hermann-Löns-Str. 16", "phone": "04106-73251", "mobil": "0177-1465429", "admissionDate": "1995 ?", "isActive": true, "isAdmin": false}, {"_id": "56a5157d275b960300695f60", "firstname": "Stefan", "lastname": "Karl", "username": "StefanK", "email": "sk@compu-max.de", "zip": "22419", "city": "Hamburg", "address": "Bärenhof 2", "phone": "040-5279463", "mobil": "0176-30583655", "admissionDate": "2000 ?", "isActive": true, "isAdmin": false}, {"_id": "56a515e7275b960300695f61", "firstname": "Holger", "lastname": "Kilian", "username": "Holger", "email": "umzuege-hamburg@holger-kilian.com", "zip": "22335", "city": "Hamburg", "address": "Niedernstegen 15", "phone": "", "mobil": "0157-74244365", "admissionDate": "2005 ?", "isActive": true, "isAdmin": false}, {"_id": "56a51636275b960300695f62", "firstname": "Jörg", "lastname": "Kunkel", "username": "Jörg", "email": "", "zip": "25451", "city": "Quickborn", "address": "Marktstrasse 25", "phone": "", "mobil": "0151-56930907", "admissionDate": "1990 ?", "isActive": true, "isAdmin": false}, {"_id": "56a51691275b960300695f63", "firstname": "Sven", "lastname": "Lob", "username": "Sven", "email": "sven.lob@web.de", "zip": "25451", "city": "Quickborn", "address": "Potsdamer Kehre 7", "phone": "04106-998575", "mobil": "0176-21698338", "admissionDate": "2000", "isActive": true, "isAdmin": false}, {"_id": "56a51aeffeb534e8224fc30b", "firstname": "Thomas", "lastname": "Mewes", "username": "Thomas", "email": "thomas.mewes@gmx.net", "zip": "22147", "city": "Hamburg", "address": "Scharbeutzer Str. 125 b", "phone": "040-6472956", "mobil": "151-43122459", "admissionDate": "2015", "isActive": true, "isAdmin": false}, {"_id": "56a51b44feb534e8224fc30c", "firstname": "Harald", "lastname": "Möller", "username": "Harald", "email": "mail@oldtimerreifen-moeller.de", "zip": "25451", "city": "Quickborn", "address": "Pascalstr. 10", "phone": "04106-618880", "mobil": "0172-4204063", "admissionDate": "2014", "isActive": true, "isAdmin": false}, {"_id": "56a51bb5feb534e8224fc30d", "firstname": "Rainer", "lastname": "Speckmann", "username": "Rainer", "email": "r.speckmann@loll-feinmechanik.de", "zip": "25451", "city": "Quickborn", "address": "Heinrich-Lohse Str. 1", "phone": "04106-68398", "mobil": "0176-49432775", "admissionDate": "1990", "isActive": true, "isAdmin": false}]
                                );
                    }
                    return this.done;
                };
            };

            return new FakeDeferred();


        };
        search = function (object_type, searchParams) {
            console.log("search =" + JSON.stringify(object_type));
            var FakeDeferred = function () {
                this.done = function (fn) {
                    if (object_type === 'member') {
                        fn([{"_id": "567e7461e4b081d81c9eabc1", "firstname": "Eckhard", "lastname": "Kirschning", "username": "Ecki", "password": "abc", "email": "eckhard.kirschning@freenet.de", "zip": "20259", "city": "Hamburg", "address": "Lutterothtstrasse 89", "phone": "", "mobil": "016097023201", "admissionDate": "2008", "isAdmin": true, "isActive": true}, {"_id": "567e7475e4b081d81c9eabc2", "firstname": "Frank", "lastname": "Schneider", "username": "Frank", "password": "abc", "email": "info@schneider-koi.de", "zip": "25451", "city": "Quickborn", "address": "Ulzburger Landstrasse 85", "phone": "04106-620591", "mobil": "0172-5651150", "admissionDate": "2000 ?", "isAdmin": true, "isActive": true}, {"_id": "56812787de0bd70300b5aa47", "firstname": "Christian", "lastname": "Adloff", "username": "Christian", "email": "christian-adloff@web.de", "zip": "25451", "city": "Quickborn", "address": "Eschenweg 18", "phone": "04106-60864", "mobil": "0170-5833680", "admissionDate": "2003", "isActive": true, "isAdmin": true}, {"_id": "56a21b11e77d7a03004d2cae", "firstname": "Serafim", "lastname": "Skafidas", "username": "Serafim", "email": "info@skafidas.de", "zip": "25451", "city": "Quickborn", "address": "Kieler Strasse 6", "phone": "04106-5529", "mobil": "0172-2356324", "admissionDate": "1994 ?", "isActive": true, "isAdmin": true}, {"_id": "56a2274a2bf3c103001c0167", "firstname": "Peter", "lastname": "Gotthard", "username": "Peter", "email": "peter.gotthard@stella-distribution.de", "zip": "25451", "city": "Quickborn", "address": "Langenkamp 48", "phone": "04106-4636", "mobil": "015154056893", "admissionDate": "2013", "isActive": true, "isAdmin": false}, {"_id": "56a267e6b336e80300f990a9", "firstname": "Torsten", "lastname": "Kitzmann", "username": "Torsten", "email": "tkitzmann@freenet.de", "zip": "25474", "city": "Hasloh", "address": "Großer Dorn 5", "phone": "", "mobil": "0173-6379109", "admissionDate": "1999 ?", "isActive": true, "isAdmin": false}, {"_id": "56a2683db336e80300f990aa", "firstname": "Guenter", "lastname": "Hauser", "username": "Guenther", "email": "guenther-hauser@tquick.de", "zip": "25451", "city": "Quickborn", "address": "Marktstrasse 20", "phone": "04106-8042452", "mobil": "0170-4838111", "admissionDate": "1970 ?", "isActive": true, "isAdmin": false}, {"_id": "56a26b90b336e80300f990af", "firstname": "Torge", "lastname": "Grabau", "username": "Torge", "email": "torgegrabau@gmail.com", "zip": "25479", "city": "Ellerau", "address": "Ellerauer Str. 4", "phone": "", "mobil": "0174-9788880", "admissionDate": "2000 ?", "isActive": true, "isAdmin": false}, {"_id": "56a26bfbb336e80300f990b0", "firstname": "Claus-Peter", "lastname": "David", "username": "Claus-Peter", "email": "c.p.david@gmx.de", "zip": "22846", "city": "Norderstedt", "address": "Kastanienweg 19", "phone": "040-5218850", "mobil": "", "admissionDate": "1970 ?", "isActive": true, "isAdmin": true}, {"_id": "56a26c4cb336e80300f990b1", "firstname": "Roland", "lastname": "Gertz", "username": "Rollo", "email": "roland.gertz@airbus.com", "zip": "25451", "city": "Quickborn", "address": "Hermann-Löns-Str. 16a", "phone": "04106-773377", "mobil": "0160-5356523", "admissionDate": "1990 ?", "isActive": true, "isAdmin": false}, {"_id": "56a34a2733bcda030048746c", "firstname": "Stephan", "lastname": "Hauser", "username": "Stephan", "email": "info@stephanhauser.de", "zip": "25451", "city": "Quickborn", "address": "Marktstrasse 20a", "phone": "04106-8042452", "mobil": "0170-4838111", "admissionDate": "2015", "isActive": true, "isAdmin": false}, {"_id": "56a34b9e33bcda030048746d", "firstname": "Clemens", "lastname": "Hansen", "username": "Clemens", "email": "clemens.hansen@t-online.de", "zip": "25451", "city": "Quickborn", "address": "Am Ahrensfeld 25", "phone": "", "mobil": "0157-30445404", "admissionDate": "2014 ?", "isActive": true, "isAdmin": false}, {"_id": "56a34c4233bcda030048746e", "firstname": "Martin", "lastname": "Hansen", "username": "MartinHa", "email": "martin.hansen@tquick.de", "zip": "25451", "city": "Quickborn", "address": "Erlenweg 9", "phone": "04106-4991", "mobil": "0170-3204568", "admissionDate": "1990 ?", "isActive": true, "isAdmin": false}, {"_id": "56a514ed275b960300695f5f", "firstname": "Martin", "lastname": "Heyland", "username": "MartinHe", "email": "", "zip": "25451", "city": "Quickborn", "address": "Hermann-Löns-Str. 16", "phone": "04106-73251", "mobil": "0177-1465429", "admissionDate": "1995 ?", "isActive": true, "isAdmin": false}, {"_id": "56a5157d275b960300695f60", "firstname": "Stefan", "lastname": "Karl", "username": "StefanK", "email": "sk@compu-max.de", "zip": "22419", "city": "Hamburg", "address": "Bärenhof 2", "phone": "040-5279463", "mobil": "0176-30583655", "admissionDate": "2000 ?", "isActive": true, "isAdmin": false}, {"_id": "56a515e7275b960300695f61", "firstname": "Holger", "lastname": "Kilian", "username": "Holger", "email": "umzuege-hamburg@holger-kilian.com", "zip": "22335", "city": "Hamburg", "address": "Niedernstegen 15", "phone": "", "mobil": "0157-74244365", "admissionDate": "2005 ?", "isActive": true, "isAdmin": false}, {"_id": "56a51636275b960300695f62", "firstname": "Jörg", "lastname": "Kunkel", "username": "Jörg", "email": "", "zip": "25451", "city": "Quickborn", "address": "Marktstrasse 25", "phone": "", "mobil": "0151-56930907", "admissionDate": "1990 ?", "isActive": true, "isAdmin": false}, {"_id": "56a51691275b960300695f63", "firstname": "Sven", "lastname": "Lob", "username": "Sven", "email": "sven.lob@web.de", "zip": "25451", "city": "Quickborn", "address": "Potsdamer Kehre 7", "phone": "04106-998575", "mobil": "0176-21698338", "admissionDate": "2000", "isActive": true, "isAdmin": false}, {"_id": "56a51aeffeb534e8224fc30b", "firstname": "Thomas", "lastname": "Mewes", "username": "Thomas", "email": "thomas.mewes@gmx.net", "zip": "22147", "city": "Hamburg", "address": "Scharbeutzer Str. 125 b", "phone": "040-6472956", "mobil": "151-43122459", "admissionDate": "2015", "isActive": true, "isAdmin": false}, {"_id": "56a51b44feb534e8224fc30c", "firstname": "Harald", "lastname": "Möller", "username": "Harald", "email": "mail@oldtimerreifen-moeller.de", "zip": "25451", "city": "Quickborn", "address": "Pascalstr. 10", "phone": "04106-618880", "mobil": "0172-4204063", "admissionDate": "2014", "isActive": true, "isAdmin": false}, {"_id": "56a51bb5feb534e8224fc30d", "firstname": "Rainer", "lastname": "Speckmann", "username": "Rainer", "email": "r.speckmann@loll-feinmechanik.de", "zip": "25451", "city": "Quickborn", "address": "Heinrich-Lohse Str. 1", "phone": "04106-68398", "mobil": "0176-49432775", "admissionDate": "1990", "isActive": true, "isAdmin": false}]
                                );
                    } else if (object_type === 'message') {
                        fn([{
                                "_id": {
                                    "$oid": "56acd85492d28a902b48abb5"
                                },
                                "year": "2016",
                                "name": "Ecki",
                                "shortMessage": "RE:Mitgliederliste",
                                "dateTime": "30/01/2016 @ 16:32:42",
                                "message": "Die Daten, die ich für jedes einzelne Mitglied eingegeben habe, könnten teilweise fehlerhaft sein. Deshalb hatte ich auch in meiner mail vom 28.01. darum gebeten, dass jedes Mitglied mal seine Einträge auf Richtigkeit überprüft.\n\nAlso lieber Rollo: Wenn Du Fehler entdeckst, bitte kurz selber korrigieren.  "
                            }, {
                                "_id": {
                                    "$oid": "56ae5f0c9488ee030050b1d3"
                                },
                                "year": "2016",
                                "name": "Ecki",
                                "shortMessage": "RE:Mitgliederliste",
                                "dateTime": "31/01/2016 @ 19:59:26",
                                "message": "In Deiner abschliessenden Kommentarzeile hast Du von \"einer schlichten Seite \" gesprochen die \"wir noch mit Leben füllen müssen \". \n\nWas genau erscheint Dir als schlicht ? \n\nIch nehme Anregungen gerne auf und meine Aufgabe sehe ich insbesondere darin, auf eure Wünsche einzugehen. Nur Gedanken lesen kann leider nicht.  Du müsstest also schon ein bisschen konkreter werden.\n\nUnd was genau \"müssen wir mit Leben füllen\" ?  \n\nAuch diese Anmerkung erscheint mir ein wenig zu diffus, um daraus irgendeinen konkreten Wunsch ableiten zu können. Wie schon gesagt: Auf Wünsche eingehen kann ich nur, wenn klar wird, was gemeint ist. \n\nHolmes, übernehmen Sie :-)\n\n   \n\n\n\n "
                            }]);
                    }
                };
                this.fail = function (fn) {
                    if (object_type === 'member') {
                        fn([{"_id": "567e7461e4b081d81c9eabc1", "firstname": "Eckhard", "lastname": "Kirschning", "username": "Ecki", "password": "abc", "email": "eckhard.kirschning@freenet.de", "zip": "20259", "city": "Hamburg", "address": "Lutterothtstrasse 89", "phone": "", "mobil": "016097023201", "admissionDate": "2008", "isAdmin": true, "isActive": true}, {"_id": "567e7475e4b081d81c9eabc2", "firstname": "Frank", "lastname": "Schneider", "username": "Frank", "password": "abc", "email": "info@schneider-koi.de", "zip": "25451", "city": "Quickborn", "address": "Ulzburger Landstrasse 85", "phone": "04106-620591", "mobil": "0172-5651150", "admissionDate": "2000 ?", "isAdmin": true, "isActive": true}, {"_id": "56812787de0bd70300b5aa47", "firstname": "Christian", "lastname": "Adloff", "username": "Christian", "email": "christian-adloff@web.de", "zip": "25451", "city": "Quickborn", "address": "Eschenweg 18", "phone": "04106-60864", "mobil": "0170-5833680", "admissionDate": "2003", "isActive": true, "isAdmin": true}, {"_id": "56a21b11e77d7a03004d2cae", "firstname": "Serafim", "lastname": "Skafidas", "username": "Serafim", "email": "info@skafidas.de", "zip": "25451", "city": "Quickborn", "address": "Kieler Strasse 6", "phone": "04106-5529", "mobil": "0172-2356324", "admissionDate": "1994 ?", "isActive": true, "isAdmin": true}, {"_id": "56a2274a2bf3c103001c0167", "firstname": "Peter", "lastname": "Gotthard", "username": "Peter", "email": "peter.gotthard@stella-distribution.de", "zip": "25451", "city": "Quickborn", "address": "Langenkamp 48", "phone": "04106-4636", "mobil": "015154056893", "admissionDate": "2013", "isActive": true, "isAdmin": false}, {"_id": "56a267e6b336e80300f990a9", "firstname": "Torsten", "lastname": "Kitzmann", "username": "Torsten", "email": "tkitzmann@freenet.de", "zip": "25474", "city": "Hasloh", "address": "Großer Dorn 5", "phone": "", "mobil": "0173-6379109", "admissionDate": "1999 ?", "isActive": true, "isAdmin": false}, {"_id": "56a2683db336e80300f990aa", "firstname": "Guenter", "lastname": "Hauser", "username": "Guenther", "email": "guenther-hauser@tquick.de", "zip": "25451", "city": "Quickborn", "address": "Marktstrasse 20", "phone": "04106-8042452", "mobil": "0170-4838111", "admissionDate": "1970 ?", "isActive": true, "isAdmin": false}, {"_id": "56a26b90b336e80300f990af", "firstname": "Torge", "lastname": "Grabau", "username": "Torge", "email": "torgegrabau@gmail.com", "zip": "25479", "city": "Ellerau", "address": "Ellerauer Str. 4", "phone": "", "mobil": "0174-9788880", "admissionDate": "2000 ?", "isActive": true, "isAdmin": false}, {"_id": "56a26bfbb336e80300f990b0", "firstname": "Claus-Peter", "lastname": "David", "username": "Claus-Peter", "email": "c.p.david@gmx.de", "zip": "22846", "city": "Norderstedt", "address": "Kastanienweg 19", "phone": "040-5218850", "mobil": "", "admissionDate": "1970 ?", "isActive": true, "isAdmin": true}, {"_id": "56a26c4cb336e80300f990b1", "firstname": "Roland", "lastname": "Gertz", "username": "Rollo", "email": "roland.gertz@airbus.com", "zip": "25451", "city": "Quickborn", "address": "Hermann-Löns-Str. 16a", "phone": "04106-773377", "mobil": "0160-5356523", "admissionDate": "1990 ?", "isActive": true, "isAdmin": false}, {"_id": "56a34a2733bcda030048746c", "firstname": "Stephan", "lastname": "Hauser", "username": "Stephan", "email": "info@stephanhauser.de", "zip": "25451", "city": "Quickborn", "address": "Marktstrasse 20a", "phone": "04106-8042452", "mobil": "0170-4838111", "admissionDate": "2015", "isActive": true, "isAdmin": false}, {"_id": "56a34b9e33bcda030048746d", "firstname": "Clemens", "lastname": "Hansen", "username": "Clemens", "email": "clemens.hansen@t-online.de", "zip": "25451", "city": "Quickborn", "address": "Am Ahrensfeld 25", "phone": "", "mobil": "0157-30445404", "admissionDate": "2014 ?", "isActive": true, "isAdmin": false}, {"_id": "56a34c4233bcda030048746e", "firstname": "Martin", "lastname": "Hansen", "username": "MartinHa", "email": "martin.hansen@tquick.de", "zip": "25451", "city": "Quickborn", "address": "Erlenweg 9", "phone": "04106-4991", "mobil": "0170-3204568", "admissionDate": "1990 ?", "isActive": true, "isAdmin": false}, {"_id": "56a514ed275b960300695f5f", "firstname": "Martin", "lastname": "Heyland", "username": "MartinHe", "email": "", "zip": "25451", "city": "Quickborn", "address": "Hermann-Löns-Str. 16", "phone": "04106-73251", "mobil": "0177-1465429", "admissionDate": "1995 ?", "isActive": true, "isAdmin": false}, {"_id": "56a5157d275b960300695f60", "firstname": "Stefan", "lastname": "Karl", "username": "StefanK", "email": "sk@compu-max.de", "zip": "22419", "city": "Hamburg", "address": "Bärenhof 2", "phone": "040-5279463", "mobil": "0176-30583655", "admissionDate": "2000 ?", "isActive": true, "isAdmin": false}, {"_id": "56a515e7275b960300695f61", "firstname": "Holger", "lastname": "Kilian", "username": "Holger", "email": "umzuege-hamburg@holger-kilian.com", "zip": "22335", "city": "Hamburg", "address": "Niedernstegen 15", "phone": "", "mobil": "0157-74244365", "admissionDate": "2005 ?", "isActive": true, "isAdmin": false}, {"_id": "56a51636275b960300695f62", "firstname": "Jörg", "lastname": "Kunkel", "username": "Jörg", "email": "", "zip": "25451", "city": "Quickborn", "address": "Marktstrasse 25", "phone": "", "mobil": "0151-56930907", "admissionDate": "1990 ?", "isActive": true, "isAdmin": false}, {"_id": "56a51691275b960300695f63", "firstname": "Sven", "lastname": "Lob", "username": "Sven", "email": "sven.lob@web.de", "zip": "25451", "city": "Quickborn", "address": "Potsdamer Kehre 7", "phone": "04106-998575", "mobil": "0176-21698338", "admissionDate": "2000", "isActive": true, "isAdmin": false}, {"_id": "56a51aeffeb534e8224fc30b", "firstname": "Thomas", "lastname": "Mewes", "username": "Thomas", "email": "thomas.mewes@gmx.net", "zip": "22147", "city": "Hamburg", "address": "Scharbeutzer Str. 125 b", "phone": "040-6472956", "mobil": "151-43122459", "admissionDate": "2015", "isActive": true, "isAdmin": false}, {"_id": "56a51b44feb534e8224fc30c", "firstname": "Harald", "lastname": "Möller", "username": "Harald", "email": "mail@oldtimerreifen-moeller.de", "zip": "25451", "city": "Quickborn", "address": "Pascalstr. 10", "phone": "04106-618880", "mobil": "0172-4204063", "admissionDate": "2014", "isActive": true, "isAdmin": false}, {"_id": "56a51bb5feb534e8224fc30d", "firstname": "Rainer", "lastname": "Speckmann", "username": "Rainer", "email": "r.speckmann@loll-feinmechanik.de", "zip": "25451", "city": "Quickborn", "address": "Heinrich-Lohse Str. 1", "phone": "04106-68398", "mobil": "0176-49432775", "admissionDate": "1990", "isActive": true, "isAdmin": false}]
                                );
                    } else if (object_type === 'message') {
                        fn([{'Error': 'message'}]);
                    }
                };
                this.error = function (fn) {
                    if (object_type === 'member') {
                        fn({Error: 'member'});
                    }
                    return this;
                };
                this.data = function (fn) {
                    if (object_type === 'member') {
                        fn([{"_id": "567e7461e4b081d81c9eabc1", "firstname": "Eckhard", "lastname": "Kirschning", "username": "Ecki", "password": "abc", "email": "eckhard.kirschning@freenet.de", "zip": "20259", "city": "Hamburg", "address": "Lutterothtstrasse 89", "phone": "", "mobil": "016097023201", "admissionDate": "2008", "isAdmin": true, "isActive": true}, {"_id": "567e7475e4b081d81c9eabc2", "firstname": "Frank", "lastname": "Schneider", "username": "Frank", "password": "abc", "email": "info@schneider-koi.de", "zip": "25451", "city": "Quickborn", "address": "Ulzburger Landstrasse 85", "phone": "04106-620591", "mobil": "0172-5651150", "admissionDate": "2000 ?", "isAdmin": true, "isActive": true}, {"_id": "56812787de0bd70300b5aa47", "firstname": "Christian", "lastname": "Adloff", "username": "Christian", "email": "christian-adloff@web.de", "zip": "25451", "city": "Quickborn", "address": "Eschenweg 18", "phone": "04106-60864", "mobil": "0170-5833680", "admissionDate": "2003", "isActive": true, "isAdmin": true}, {"_id": "56a21b11e77d7a03004d2cae", "firstname": "Serafim", "lastname": "Skafidas", "username": "Serafim", "email": "info@skafidas.de", "zip": "25451", "city": "Quickborn", "address": "Kieler Strasse 6", "phone": "04106-5529", "mobil": "0172-2356324", "admissionDate": "1994 ?", "isActive": true, "isAdmin": true}, {"_id": "56a2274a2bf3c103001c0167", "firstname": "Peter", "lastname": "Gotthard", "username": "Peter", "email": "peter.gotthard@stella-distribution.de", "zip": "25451", "city": "Quickborn", "address": "Langenkamp 48", "phone": "04106-4636", "mobil": "015154056893", "admissionDate": "2013", "isActive": true, "isAdmin": false}, {"_id": "56a267e6b336e80300f990a9", "firstname": "Torsten", "lastname": "Kitzmann", "username": "Torsten", "email": "tkitzmann@freenet.de", "zip": "25474", "city": "Hasloh", "address": "Großer Dorn 5", "phone": "", "mobil": "0173-6379109", "admissionDate": "1999 ?", "isActive": true, "isAdmin": false}, {"_id": "56a2683db336e80300f990aa", "firstname": "Guenter", "lastname": "Hauser", "username": "Guenther", "email": "guenther-hauser@tquick.de", "zip": "25451", "city": "Quickborn", "address": "Marktstrasse 20", "phone": "04106-8042452", "mobil": "0170-4838111", "admissionDate": "1970 ?", "isActive": true, "isAdmin": false}, {"_id": "56a26b90b336e80300f990af", "firstname": "Torge", "lastname": "Grabau", "username": "Torge", "email": "torgegrabau@gmail.com", "zip": "25479", "city": "Ellerau", "address": "Ellerauer Str. 4", "phone": "", "mobil": "0174-9788880", "admissionDate": "2000 ?", "isActive": true, "isAdmin": false}, {"_id": "56a26bfbb336e80300f990b0", "firstname": "Claus-Peter", "lastname": "David", "username": "Claus-Peter", "email": "c.p.david@gmx.de", "zip": "22846", "city": "Norderstedt", "address": "Kastanienweg 19", "phone": "040-5218850", "mobil": "", "admissionDate": "1970 ?", "isActive": true, "isAdmin": true}, {"_id": "56a26c4cb336e80300f990b1", "firstname": "Roland", "lastname": "Gertz", "username": "Rollo", "email": "roland.gertz@airbus.com", "zip": "25451", "city": "Quickborn", "address": "Hermann-Löns-Str. 16a", "phone": "04106-773377", "mobil": "0160-5356523", "admissionDate": "1990 ?", "isActive": true, "isAdmin": false}, {"_id": "56a34a2733bcda030048746c", "firstname": "Stephan", "lastname": "Hauser", "username": "Stephan", "email": "info@stephanhauser.de", "zip": "25451", "city": "Quickborn", "address": "Marktstrasse 20a", "phone": "04106-8042452", "mobil": "0170-4838111", "admissionDate": "2015", "isActive": true, "isAdmin": false}, {"_id": "56a34b9e33bcda030048746d", "firstname": "Clemens", "lastname": "Hansen", "username": "Clemens", "email": "clemens.hansen@t-online.de", "zip": "25451", "city": "Quickborn", "address": "Am Ahrensfeld 25", "phone": "", "mobil": "0157-30445404", "admissionDate": "2014 ?", "isActive": true, "isAdmin": false}, {"_id": "56a34c4233bcda030048746e", "firstname": "Martin", "lastname": "Hansen", "username": "MartinHa", "email": "martin.hansen@tquick.de", "zip": "25451", "city": "Quickborn", "address": "Erlenweg 9", "phone": "04106-4991", "mobil": "0170-3204568", "admissionDate": "1990 ?", "isActive": true, "isAdmin": false}, {"_id": "56a514ed275b960300695f5f", "firstname": "Martin", "lastname": "Heyland", "username": "MartinHe", "email": "", "zip": "25451", "city": "Quickborn", "address": "Hermann-Löns-Str. 16", "phone": "04106-73251", "mobil": "0177-1465429", "admissionDate": "1995 ?", "isActive": true, "isAdmin": false}, {"_id": "56a5157d275b960300695f60", "firstname": "Stefan", "lastname": "Karl", "username": "StefanK", "email": "sk@compu-max.de", "zip": "22419", "city": "Hamburg", "address": "Bärenhof 2", "phone": "040-5279463", "mobil": "0176-30583655", "admissionDate": "2000 ?", "isActive": true, "isAdmin": false}, {"_id": "56a515e7275b960300695f61", "firstname": "Holger", "lastname": "Kilian", "username": "Holger", "email": "umzuege-hamburg@holger-kilian.com", "zip": "22335", "city": "Hamburg", "address": "Niedernstegen 15", "phone": "", "mobil": "0157-74244365", "admissionDate": "2005 ?", "isActive": true, "isAdmin": false}, {"_id": "56a51636275b960300695f62", "firstname": "Jörg", "lastname": "Kunkel", "username": "Jörg", "email": "", "zip": "25451", "city": "Quickborn", "address": "Marktstrasse 25", "phone": "", "mobil": "0151-56930907", "admissionDate": "1990 ?", "isActive": true, "isAdmin": false}, {"_id": "56a51691275b960300695f63", "firstname": "Sven", "lastname": "Lob", "username": "Sven", "email": "sven.lob@web.de", "zip": "25451", "city": "Quickborn", "address": "Potsdamer Kehre 7", "phone": "04106-998575", "mobil": "0176-21698338", "admissionDate": "2000", "isActive": true, "isAdmin": false}, {"_id": "56a51aeffeb534e8224fc30b", "firstname": "Thomas", "lastname": "Mewes", "username": "Thomas", "email": "thomas.mewes@gmx.net", "zip": "22147", "city": "Hamburg", "address": "Scharbeutzer Str. 125 b", "phone": "040-6472956", "mobil": "151-43122459", "admissionDate": "2015", "isActive": true, "isAdmin": false}, {"_id": "56a51b44feb534e8224fc30c", "firstname": "Harald", "lastname": "Möller", "username": "Harald", "email": "mail@oldtimerreifen-moeller.de", "zip": "25451", "city": "Quickborn", "address": "Pascalstr. 10", "phone": "04106-618880", "mobil": "0172-4204063", "admissionDate": "2014", "isActive": true, "isAdmin": false}, {"_id": "56a51bb5feb534e8224fc30d", "firstname": "Rainer", "lastname": "Speckmann", "username": "Rainer", "email": "r.speckmann@loll-feinmechanik.de", "zip": "25451", "city": "Quickborn", "address": "Heinrich-Lohse Str. 1", "phone": "04106-68398", "mobil": "0176-49432775", "admissionDate": "1990", "isActive": true, "isAdmin": false}]
                                );
                    }
                    return this.done;
                };
            };

            return new FakeDeferred();
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
                timeout: 10000,
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
                timeout: 10000,
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
        update_saison_events_for_member = function (object_type, id, name, setMap) {
            console.log("update_events," + JSON.stringify(setMap));
            var promise = $.Deferred();
            $.ajax('/' + object_type + '/updateSaisonEventsForMember', {
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
        add_members_to_saison = function (object_type, id, members, memberEvents) {
            console.log("add_members_to_saison," + JSON.stringify(members));
            var promise = $.Deferred();
            $.ajax('/' + object_type + '/addMembersToSaison', {
                type: 'POST',
                success: function (result) {
                    promise.resolve(result);
                },
                data: JSON.stringify({id: id, members: members, memberEvents: memberEvents}),
                timeout: 10000,
                dataType: 'json',
                contentType: 'application/json',
                error: function (result) {
                    console.log("add members reject =" + JSON.stringify(result));
                    promise.reject(result);
                }
            });
            return promise;
        };

        delete_members_from_saison = function (object_type, id, members) {
            console.log("DATA: delete_members_from_saison," + JSON.stringify(members));
            var promise = $.Deferred();
            $.ajax('/' + object_type + '/deleteMembersFromSaison', {
                type: 'POST',
                success: function (result) {
                    promise.resolve(result);
                },
                data: JSON.stringify({id: id, members: members}),
                timeout: 10000,
                dataType: 'json',
                contentType: 'application/json',
                error: function (result) {
                    console.log("DATA: delete members reject =" + JSON.stringify(result));
                    promise.reject(result);
                }
            });
            return promise;
        };

        add_events_to_saison = function (object_type, id, events, saisonEvents, members) {
            console.log("add_events_to_saison," + JSON.stringify(events));
            var promise = $.Deferred();
            $.ajax('/' + object_type + '/addEventsToSaison', {
                type: 'POST',
                success: function (result) {
                    promise.resolve(result);
                },
                data: JSON.stringify({id: id, events: events, saisonEvents: saisonEvents, members: members}),
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

        delete_events_from_saison = function (object_type, id, events, members) {
            console.log("deleteEventsFromSaison," + JSON.stringify(events));
            var promise = $.Deferred();
            $.ajax('/' + object_type + '/deleteEventsFromSaison', {
                type: 'POST',
                success: function (result) {
                    promise.resolve(result);
                },
                data: JSON.stringify({id: id, members: members, events: events}),
                timeout: 10000,
                dataType: 'json',
                contentType: 'application/json',
                error: function (result) {
                    console.log("DATA: deleteEventsFromSaison reject =" + JSON.stringify(result));
                    promise.reject(result);
                }
            });
            return promise;
        };

        add_subtask_to_workingtask = function (object_type, _id, workingTask, _subtask_array) {
            console.log("addSubtaskToWorkingtask," + JSON.stringify(_subtask_array));
            var promise = $.Deferred();
            $.ajax('/' + object_type + '/addSubtask', {
                type: 'POST',
                success: function (result) {
                    promise.resolve(result);
                },
                data: JSON.stringify({id: _id, workingTask: workingTask, subTaskList: _subtask_array}),
                timeout: 10000,
                dataType: 'json',
                contentType: 'application/json',
                error: function (result) {
                    console.log("add subtask reject =" + JSON.stringify(result));
                    promise.reject(result);
                }
            });
            return promise;
        };

        update_subtask_in_workingtask = function (object_type, _id, workingTask, _subtask_array) {
            console.log("addSubtaskToWorkingtask," + JSON.stringify(_subtask_array));
            var promise = $.Deferred();
            $.ajax('/' + object_type + '/updateSubtask', {
                type: 'POST',
                success: function (result) {
                    promise.resolve(result);
                },
                data: JSON.stringify({id: _id, workingTask: workingTask, subTaskList: _subtask_array}),
                timeout: 10000,
                dataType: 'json',
                contentType: 'application/json',
                error: function (result) {
                    console.log("add subtask reject =" + JSON.stringify(result));
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
            updateSaisonEventsForMember: update_saison_events_for_member,
            addMembersToSaison: add_members_to_saison,
            deleteMembersFromSaison: delete_members_from_saison,
            addEventsToSaison: add_events_to_saison,
            deleteEventsFromSaison: delete_events_from_saison,
            addSubtaskToWorkingtask: add_subtask_to_workingtask,
            updateSubtaskInWorkingtask: update_subtask_in_workingtask

        };
    }());

//    
    initModule = function () {
        // nothing so far
        return true;
    };
    return {initModule: initModule, ajaxCall: ajax_call};
}());