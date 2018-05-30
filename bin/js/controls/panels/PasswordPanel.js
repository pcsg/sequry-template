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
    'Locale',

    'package/sequry/template/bin/js/controls/panels/Panel',
    'package/sequry/template/bin/js/controls/password/Password',
    'package/sequry/template/bin/js/controls/utils/InputButtons'
], function (
    QUI,
    QUIControl,
    QUIAjax,
    QUILocale,
    Panel,
    Password,
    InputButtons
) {
    "use strict";

    var lg = 'sequry/template';

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
            actionButton           : QUILocale.get(lg, 'sequry.panel.button.share'),
            closeButton            : QUILocale.get(lg, 'sequry.panel.button.close'),
            iconHeaderButton       : QUILocale.get(lg, 'sequry.panel.button.edit'),
            iconHeaderButtonFaClass: 'fa fa-edit'
        },

        initialize: function (options) {
            this.parent(options);

            this.$Password = null;

            // panel events
            this.addEvents({
                onOpen           : this.$onOpen,
                openBegin        : this.$openBegin,
                onSubmit         : this.$onSubmit,
                onSubmitSecondary: this.$onSubmitSecondary
            });
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

                        var BtnParser = new InputButtons;
                        BtnParser.parse(self.getElm());

                        self.Loader.hide();
                    }
                }
            }).inject(this.getContent());


            // create buttons
            // action button (save, share)
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

            // header button
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
            console.log("Password wird geteilt");
            this.$Password.share();
            this.cancel();
        },

        $onSubmitSecondary: function () {
            console.log("Password wird bearbeitet!");
            this.cancel();
            this.$Password.edit();
        },

        test: function () {
            alert("das ist nur ein test")
        }

    });
});