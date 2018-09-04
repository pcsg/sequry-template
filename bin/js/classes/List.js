/**
 * Main list class.
 *
 * @module package/sequry/template/bin/js/classes/List
 */
define('package/sequry/template/bin/js/classes/List', [

    'qui/QUI',
    'Ajax'

], function (QUI, QUIAjax) {
    "use strict";

    return new Class({

        Type: 'package/sequry/template/bin/js/classes/List',

        /**
         * Set favorite status
         *
         * @param passwordId
         * @param status
         */
        setFavoriteStatus: function (passwordId, status) {
            return new Promise(function (resolve, reject) {
                QUIAjax.post(
                    'package_sequry_core_ajax_passwords_setFavoriteStatus',
                    resolve, {
                        'package' : 'sequry/core',
                        onError   : reject,
                        passwordId: passwordId,
                        status    : status ? 1 : 0
                    }
                );
            });
        },

        /**
         * Get HTML of Pagination Control
         *
         * @returns {Promise}
         */
        getPaginationHtml: function (sheets) {
            return new Promise(function (resolve, reject) {
                QUIAjax.get('package_sequry_template_ajax_getPaginationHtml', resolve, {
                    'package': 'sequry/template',
                    onError  : reject,
                    sheets: sheets
                });
            });
        }
    });
});