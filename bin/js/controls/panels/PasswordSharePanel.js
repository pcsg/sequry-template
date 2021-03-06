/**
 * Panel control to share a password
 *
 * @module package/sequry/template/bin/js/controls/panels/PasswordSharePanel
 * @author www.pcsg.de (Michael Danielczok)
 */
define('package/sequry/template/bin/js/controls/panels/PasswordSharePanel', [

    'qui/QUI',
    'qui/controls/Control',
    'Ajax',
    'Locale',

    'package/sequry/core/bin/Actors',
    'package/sequry/template/bin/js/Password',
    'package/sequry/template/bin/js/controls/panels/Panel',
    'package/sequry/template/bin/js/controls/password/PasswordShare',
    'package/sequry/core/bin/Passwords'

], function (
    QUI, QUIControl, QUIAjax, QUILocale,
    Actors,
    PasswordManager,
    Panel,
    PasswordShare,
    Passwords
) {
    "use strict";

    var lg = 'sequry/template';

    return new Class({

        Extends: Panel,
        Type   : 'package/sequry/template/bin/js/controls/panels/PasswordSharePanel',

        Binds: [
            '$onSubmit',
            '$openBegin',
            '$onOpen',
            '$onDestroy'
        ],

        options: {
            title            : QUILocale.get(lg, 'sequry.panel.share.title'),
            actionButton     : QUILocale.get(lg, 'sequry.panel.button.save'),
            closeButton      : QUILocale.get(lg, 'sequry.panel.button.close'),
            confirmClosePopup: false,
            passwordId       : false
        },

        initialize: function (options) {
            this.parent(options);

            this.$PasswordShareControl = null;

            // panel events
            this.addEvents({
                onOpen     : this.$onOpen,
                onOpenBegin: this.$openBegin,
                onSubmit   : this.$onSubmit,
                onFinish   : this.$onFinish
            });
        },

        /**
         * event: on open
         * integrate password
         */
        $onOpen: function () {
            var self = this,
                pwId = this.getAttribute('passwordId');

            Actors.getPasswordAccessInfo(pwId).then(function (AccessInfo) {

                if (!AccessInfo.canAccess) {
                    Passwords.getNoAccessInfoElm(AccessInfo, self).inject(self.$Elm);
                    self.close();
                    return;
                }

                self.$PasswordShareControl = new PasswordShare({
                    passwordId: pwId,
                    events    : {
                        onLoad : function () {
                            self.Loader.hide();
                        },
                        onClose: function () {
                            self.Loader.hide();
                            self.close();
                        }
                    }
                }).inject(self.getContent());
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
            var self = this;

            var shareData = this.$PasswordShareControl.$PasswordShare.$ActorSelectUsers.getActors().append(
                this.$PasswordShareControl.$PasswordShare.$ActorSelectGroups.getActors()
            );

            return new Promise(function (resolve, reject) {
                Passwords.setShareData(
                    self.getAttribute('passwordId'),
                    shareData
                ).then(
                    function () {
                        self.fireEvent('finish');
                    },
                    reject
                );
            });
        }
    });
});