/**
 * Main password class.
 *
 * @module package/sequry/template/bin/js/classes/Password
 */
define('package/sequry/template/bin/js/classes/Password', [

    'qui/QUI',
    'Ajax',
    'package/sequry/core/bin/AuthAjax'

], function (
    QUI,
    QUIAjax,
    AuthAjax
) {
    "use strict";

    return new Class({

        Type: 'package/sequry/template/bin/js/classes/Password',

        /**
         * Get the data from password
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
         * Get all data of single password object (authentication required!)
         *
         * @param {number} passwordId
         * @returns {Promise}
         */
        getDataNew: function (passwordId) {
            return AuthAjax.get('package_sequry_core_ajax_passwords_get', {
                passwordId: passwordId
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