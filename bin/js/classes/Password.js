/**
 * Main password class.
 *
 * @module package/sequry/template/bin/js/classes/Password
 */
define('package/sequry/template/bin/js/classes/Password', [

    'qui/QUI',
    'Ajax',
    'package/sequry/core/bin/AuthAjax',
    'Locale'

], function (
    QUI,
    QUIAjax,
    AuthAjax,
    QUILocale
) {
    "use strict";

    return new Class({

        Type: 'package/sequry/template/bin/js/classes/Password',

        /**
         * Get all data of single password object (authentication required!)
         *
         * @param {number} passwordId
         * @returns {Promise}
         */
        getData: function (passwordId) {
            return AuthAjax.get('package_sequry_core_ajax_passwords_get', {
                passwordId: passwordId
            });
        },

        /**
         * Get all data of single password object (authentication required!)
         *
         * @param {number} passwordId
         * @returns {Promise}
         */
        getDataView: function (passwordId) {
            return AuthAjax.get('package_sequry_core_ajax_passwords_getViewData', {
                passwordId: passwordId
            });
        },

        /**
         * Return translations for password type
         *
         * @param locale
         * @returns string - password type name (title)
         */
        getTypeTranslations: function(locale) {
            var localeStr = 'passwordtypes.' + locale + '.label.title';
            return QUILocale.get('sequry/core', localeStr);
        }
    });
});