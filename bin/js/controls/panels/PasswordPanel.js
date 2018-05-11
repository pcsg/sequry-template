/**
 * Panel control for showing the password data.
 * It inherits from Panel.js
 *
 * @module package/sequry/template/bin/js/controls/panels/PasswordPanel
 */
define('package/sequry/template/bin/js/controls/panels/PasswordPanel', [

    'qui/QUI',
    'qui/controls/Control',
    'Ajax',

    'package/sequry/template/bin/js/controls/panels/Panel',
    'package/sequry/template/bin/js/controls/password/Password'
], function (
    QUI,
    QUIControl,
    QUIAjax,
    Panel,
    Password
) {
    "use strict";

    return new Class({

        Extends: Panel,
        Type   : 'package/sequry/template/bin/js/controls/panels/PasswordPanel',

        Binds: [
            '$onSubmit',
            '$openBegin',
            '$onOpen',
            'openSharePassword',
            'openEditPassword'
        ],

        options: {
            title                  : false,
            actionButton           : 'Teilen',
            closeButton            : 'Schließen',
            iconHeaderButton       : 'Passwort bearbeiten',
            iconHeaderButtonFaClass: 'fa fa-edit'
        },

        initialize: function (options) {
            this.parent(options);

            this.$Password = null;

            // panel events
            this.addEvents({
                onOpen   : this.$onOpen,
                openBegin: this.$openBegin,
                onSubmit : this.$onSubmit
            });
        },

        $onLoad: function () {
            console.log("Password Panel onLoad");
        },

        /**
         * event: on open
         * Integrate password
         */
        $onOpen: function () {
            var self = this;

            this.$Password = new Password({
                id    : this.getAttribute('id'),
                events: {
                    onLoad: function (PW) {
                        self.setTitle(PW.getTitle());
                        self.Loader.hide();
                    }
                }
            }).inject(this.getContent());

            // create buttons
            if (this.getAttribute('actionButton')) {
                this.createActionButton(this.getAttribute('actionButton'))
            }

            if (this.getAttribute('closeButton')) {
                this.createCloseButton(this.getAttribute('closeButton'))
            }

            if (this.getAttribute('iconHeaderButton')) {
                this.createHeaderButton(
                    this.getAttribute('iconHeaderButton'),
                    this.getAttribute('iconHeaderButtonFaClass')
                )
            }

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
        },

        openSharePassword: function () {
            console.log("Password wird geteilt");
            this.cancel();
        },

        openEditPassword: function () {
            console.log("Password wird bearbeitet!");
            this.cancel();
        }

    });
});