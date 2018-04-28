/**
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
            '$onOpen'
        ],

        options: {
            title                  : false,
            actionButton           : true,
            actionButtonText       : 'Teilen',
            closeButton            : true,
            closeButtonText        : 'Schließen',
            iconHeaderButton       : true,
            iconHeaderButtonFaClass: 'fa fa-edit',
            iconHeaderButtonText   : 'Passwort bearbeiten'
        },

        initialize: function (options) {
            this.parent(options);

            this.$Password = null;

            this.addEvents({
                onOpen   : this.$onOpen,
                openBegin: this.$openBegin,
                obSubmit : this.$onSubmit
            });

//            this.PasswordClass = new Password();
        },

        /**
         * event: on open
         * integrate password
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
        },

        /**
         * event: on open begin
         * let the load display before the animation starts
         */
        $openBegin: function () {
            this.Loader.show();
        },


        $onSubmit: function () {
            // password speichern
            console.log(this);
        }

    });
});