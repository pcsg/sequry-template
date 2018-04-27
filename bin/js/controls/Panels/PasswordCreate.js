/**
 * @module package/sequry/template/bin/js/controls/Panels/PasswordCreate
 */
define('package/sequry/template/bin/js/controls/Panels/PasswordCreate', [

    'qui/QUI',
    'Mustache',

    'package/sequry/template/bin/js/controls/Panels/Password',
    'package/sequry/template/bin/js/Password'

], function (
    QUI,
    Mustache,

    Password,
    PasswordHandler
) {
    "use strict";

    return new Class({

        Extends: Password,
        Type   : 'package/sequry/template/bin/js/controls/Panels/PasswordCreate',

        Binds: [
//            'onOpen'
        ],

        initialize: function (options) {
            this.parent(options);
        },

        onOpen: function () {
            console.log("onOpen");
            this.SequryPanel.setTitle('Neues Passwort hinzufügen');
        }

    });
});