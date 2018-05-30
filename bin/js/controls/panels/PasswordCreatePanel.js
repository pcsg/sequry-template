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
    'Locale',

    'package/sequry/template/bin/js/controls/panels/Panel',
    'package/sequry/template/bin/js/controls/password/PasswordCreate'
], function (
    QUI,
    QUIControl,
    QUIAjax,
    QUILocale,
    Panel,
    PasswordCreate
) {
    "use strict";

    var lg = 'sequry/template';

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
            actionButton: QUILocale.get(lg, 'sequry.panel.button.save'),
            closeButton : QUILocale.get(lg, 'sequry.panel.button.close')
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
                        self.setTitle(QUILocale.get(lg, 'sequry.panel.createPassword.title'));
                        self.ButtonParser.parse(self.getElm());
                        self.Loader.hide();
                    }
                }
            }).inject(this.getContent());

            // action button - save
            if (this.getAttribute('actionButton')) {
                this.createActionButton(
                    this.getAttribute('actionButton')
//                    this.$Password.share
                )

            }

            // close button
            if (this.getAttribute('closeButton')) {
                this.createCloseButton(this.getAttribute('closeButton')
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
        }

    });
});