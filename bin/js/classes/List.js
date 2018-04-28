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
         * todo @michael function description
         * @param passwordId
         * @param status
         */
        setFavoriteStatus: function (passwordId, status) {
            return new Promise(function (resolve, reject) {
                QUIAjax.post(
                    'package_sequry_template_ajax_passwords_setFavoriteStatus',
                    resolve, {
                        'package' : 'sequry/template',
                        onError   : reject,
                        passwordId: passwordId,
                        status    : status ? 1 : 0
                    }
                );
            });
        }
    });
});