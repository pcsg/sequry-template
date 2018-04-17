/**
 * @module package/sequry/template/bin/js/controls/Header
 */
define('package/sequry/template/bin/js/controls/Header', [

    'qui/QUI',
    'qui/controls/Control',
    'Mustache',
    'Locale',

    'text!package/sequry/template/bin/js/controls/Header.html',
    'css!package/sequry/template/bin/js/controls/Header.css'

], function (QUI, QUIControl, Mustache, QUILocale, Template) {
    "use strict";

    return new Class({

        Extends: QUIControl,
        Type   : 'package/sequry/template/bin/js/controls/Header',

        Binds: [
            '$onInject'
        ],

        initialize: function (options) {
            this.parent(options);

            this.addEvents({
                onInject: this.$onInject
            });
        },

        /**
         * event: on inject
         */
        $onInject: function () {
            this.$Elm.set('html', Mustache.render(Template, {
//                logout: QUILocale.get('quiqqer/frontend-users', 'login.btn.logout')
                logout: 'Abmelden'
            }));
        }
    });
});