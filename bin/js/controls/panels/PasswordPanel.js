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

    'package/sequry/core/bin/Actors',
    'package/sequry/template/bin/js/controls/panels/Panel',
    'package/sequry/template/bin/js/controls/password/Password',
    'package/sequry/template/bin/js/controls/panels/PasswordCreatePanel',
    'package/sequry/template/bin/js/controls/panels/PasswordSharePanel'
], function (
    QUI,
    QUIControl,
    QUIAjax,
    QUILocale,
    Actors,
    Panel,
    Password,
    PasswordCreatePanel,
    PasswordSharePanel
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
            var self = this,
                passwordId = this.getAttribute('id');

            Actors.getPasswordAccessInfo(passwordId).then(function (AccessInfo) {

                if (!AccessInfo.canAccess) {
                    Passwords.getNoAccessInfoElm(AccessInfo, self).inject(self.$Elm);
                    self.fireEvent('loaded');
                    return;
                }

                self.$Password = new Password({
                    id    : self.getAttribute('id'),
                    events: {
                        onLoad : function (PW) {
                            self.setTitle(PW.getTitle());
                            self.setSubtitle(PW.getType());

                            self.ButtonParser.parse(self.getElm());
                            self.Loader.hide();
                        },
                        onClose: function () {
                            self.Loader.hide();
                            self.cancel();
                        }
                    }
                }).inject(self.getContent());

                // action button - share
                if (self.getAttribute('actionButton')) {
                    self.createActionButton(
                        self.getAttribute('actionButton'),
                        self.$Password.share
                    )
                }

                // close button
                if (self.getAttribute('closeButton')) {
                    self.createCloseButton(self.getAttribute('closeButton'))
                }

                // header button
                if (self.getAttribute('iconHeaderButton')) {
                    self.createHeaderButton(
                        self.getAttribute('iconHeaderButton'),
                        self.getAttribute('iconHeaderButtonFaClass'),
                        self.getAttribute('isOwner')
                    )
                }
            });
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
            // Don't destroy the current background control...
            this.setAttribute('keepBackground', true);

            new PasswordSharePanel({
                passwordId: this.getAttribute('id'),
                Background: this.Background, // ... but pass it as attribute to the new panel control
                events    : {
                    open: function () {
                        this.close();
                    }.bind(this)
                }
            }).open();
        },

        $onSubmitSecondary: function () {
            // Don't destroy the current background control...
            this.setAttribute('keepBackground', true);

            new PasswordCreatePanel({
                passwordId: this.getAttribute('id'),
                mode      : 'edit',
                Background: this.Background, // ... but pass it as attribute to the new panel control
                events    : {
                    open: function () {
                        this.close();
                    }.bind(this)
                }
            }).open();
        }
    });
});