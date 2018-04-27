/**
 * @module package/sequry/template/bin/js/controls/Panels/Password
 */
define('package/sequry/template/bin/js/controls/Panels/PasswordPanel', [

    'qui/QUI',
    'qui/controls/Control',
    'Ajax',

    'package/sequry/template/bin/js/controls/Panels/Panel',
    'package/sequry/template/bin/js/controls/Panels/Password'
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
        Type   : 'package/sequry/template/bin/js/controls/Panels/Password',

        Binds: [
            '$onSubmit',
            '$openBegin',
            '$onOpen'
        ],

        options: {
            title             : false,	// {false|string} [optional] title of the window
            backgroundClosable: true, // {bool} [optional] closes the window on click? standard = true
            closeButton       : true, // {bool} show the close button
            closeButtonText   : 'Abbrechen',
            id                : false
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