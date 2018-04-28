/**
 * Panel control to create a new password.
 * It inherits from Panel.js
 *
 * * @module package/sequry/template/bin/js/controls/panels/PasswordCreatePanel
 */
define('package/sequry/template/bin/js/controls/panels/PasswordCreatePanel', [

    'qui/QUI',
    'qui/controls/Control',
    'Ajax',

    'package/sequry/template/bin/js/controls/panels/Panel',
    'package/sequry/template/bin/js/controls/password/PasswordCreate'
], function (
    QUI,
    QUIControl,
    QUIAjax,
    Panel,
    PasswordCreate
) {
    "use strict";

    return new Class({

        Extends: Panel,
        Type   : 'package/sequry/template/bin/js/controls/panels/PasswordCreatePanel',

        Binds: [
            '$onSubmit',
            '$openBegin',
            '$onOpen'
        ],

        options: {
            title       : false,
            actionButton: 'Speichern',
            closeButton : 'Schließen'
        },

        initialize: function (options) {
            this.parent(options);

            this.$Password = null;

            // panel events
            this.addEvents({
                onOpen   : this.$onOpen,
                openBegin: this.$openBegin,
                obSubmit : this.$onSubmit
            });
        },

        /**
         * event: on open
         * integrate password
         */
        $onOpen: function () {
            var self = this;

            this.$Password = new PasswordCreate({
                id    : this.getAttribute('id'),
                events: {
                    onLoad: function () {
                        self.setTitle('Neues Passwort erstellen');
                        self.Loader.hide();
                    }
                }
            }).inject(this.getContent());
        },

        /**
         * event:on open begin
         * Let the loader display before the animation starts
         */
        $openBegin: function () {
            this.Loader.show();
        },

        /**
         * event: on submit form
         */
        $onSubmit: function () {
            // password speichern
            console.log(this);
        }

    });
});