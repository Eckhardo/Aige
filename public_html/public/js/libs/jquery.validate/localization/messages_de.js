/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
$.extend($.validator.messages, {
	required: "Dieses Feld ist ein Pflichtfeld.",
	maxlength: $.validator.format("Gebe  bitte maximal {0} Zeichen ein."),
	minlength: $.validator.format("Gebe bitte mindestens {0} Zeichen ein."),
	rangelength: $.validator.format("Gebe bitte mindestens {0} und maximal {1} Zeichen ein."),
	email: "Gebe bitte eine gültige E-Mail Adresse ein.",
	url: "Gebe bitte eine gültige URL ein.",
	date: "Bitte gebe ein gültiges Datum ein.",
	number: "Gebe bitte eine Nummer ein.",
	digits: "Gebe bitte nur Ziffern ein.",
	equalTo: "Bitte denselben Wert wiederholen.",
	range: $.validator.format("Gebe bitte einen Wert zwischen {0} und {1} ein."),
	max: $.validator.format("Gebe bitte einen Wert kleiner oder gleich {0} ein."),
	min: $.validator.format("Gebe bitte einen Wert größer oder gleich {0} ein."),
	creditcard: "Gebe bitte eine gültige Kreditkarten-Nummer ein."
});


