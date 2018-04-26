/**
 * @module package/sequry/template/bin/js/classes/List
 */
define('package/sequry/template/bin/js/classes/List', [

    'qui/QUI',
    'qui/controls/Control',
    'Ajax'

], function (QUI, QUIControl, QUIAjax) {
    "use strict";

    return new Class({

        Extends: QUIControl,
        Type   : 'package/sequry/template/bin/js/classes/List',

        Binds: [
            '$onInject',
            'changeFavorite'
        ],

        initialize: function (options) {
            this.parent(options);
        },

        /**
         * todo @michael function description
         *
         */
        getData: function () {
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
         * todo @michael function description
         * @param passwordId
         * @param status
         */
        setFavoriteStatus: function (passwordId, status) {
            console.log(status)
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