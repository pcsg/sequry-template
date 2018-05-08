/**
 * Main password class.
 *
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

        Type: 'package/sequry/template/bin/js/classes/Password',

        /**
         * Get the data from a password
         *
         * @param passId (integer)
         * @return {Promise}
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
         * Return all passwords data.
         *
         * @return {Promise}
         */
        getDataAll: function () {
            return new Promise(function (resolve, reject) {
                QUIAjax.get(
                    'package_sequry_template_ajax_passwords_getList',
                    resolve, {
                        'package': 'sequry/template',
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