/**
 * @module package/sequry/template/bin/js/classes/Password
 */
define('package/sequry/template/bin/js/classes/Password', [

    'qui/QUI',
    'Ajax'

], function (
    QUI,
    QUIAjax
) {
    "use strict";

    return new Class({

        Type   : 'package/sequry/template/bin/js/classes/Password',

        Binds: [
        ],

        initialize: function (options) {

        },

        /**
         *
         */
        getData: function (passId) {
            return new Promise(function (resolve, reject) {
                QUIAjax.get(
                    'package_sequry_template_ajax_passwords_getPasswordData',
                    resolve, {
                        'package': 'sequry/template',
                        'passId' : passId,
                        onError  : reject
                    }
                );
            });
        },

        /**
         *
         */
        saveData: function () {
            console.log("Passwort gespeichert");
        }

    });
});