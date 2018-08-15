/**
 * Panel control to link a password
 *
 * @module package/sequry/template/bin/js/controls/panels/PasswordLinkPanel
 * @author www.pcsg.de (Michael Danielczok)
 */
define('package/sequry/template/bin/js/controls/panels/PasswordLinkPanel', [

    'qui/QUI',
    'qui/controls/Control',
    'Ajax',
    'Locale',

    'package/sequry/core/bin/Actors',
    'package/sequry/template/bin/js/Password',
    'package/sequry/template/bin/js/controls/panels/Panel',
    'package/sequry/template/bin/js/controls/password/link/List',
    'package/sequry/core/bin/Passwords'

], function (
    QUI, QUIControl, QUIAjax, QUILocale,
    Actors,
    PasswordManager,
    Panel,
    PasswordLinkList,
    Passwords
) {
    "use strict";

    var lg = 'sequry/template';

    return new Class({

        Extends: Panel,
        Type   : 'package/sequry/template/bin/js/controls/panels/PasswordLinkPanel',

        Binds: [
            '$onSubmit',
            '$openBegin',
            '$onOpen',
            '$onDestroy'
        ],

        options: {
            title            : false,
            actionButton     : QUILocale.get(lg, 'sequry.panel.button.save'),
            closeButton      : QUILocale.get(lg, 'sequry.panel.button.close'),
            confirmClosePopup: true,
            passwordId       : false
        },

        initialize: function (options) {
            this.parent(options);

            this.$PasswordShare = null;

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

//            this.setTitle(QUILocale.get(lg, 'sequry.panel.share.title'));
            this.setTitle('Passwort verlinken');

            Actors.getPasswordAccessInfo(pwId).then(function (AccessInfo) {

                if (!AccessInfo.canAccess) {
                    Passwords.getNoAccessInfoElm(AccessInfo, self).inject(self.$Elm);
                    self.close();
                    console.log(1)
                    return;
                }
                console.log(2)
                self.$PasswordLink = new PasswordLinkList({
                    passwordId: pwId,
                    events    : {
                        onLoad : function () {
                            console.log(3)
                            self.Loader.hide();
                        },
                        onClose: function () {
                            self.Loader.hide();
                            self.close();
                        }
                    }
                }).inject(self.getContent());
            });

            // action button - save
            if (this.getAttribute('actionButton')) {
                this.createActionButton(
                    this.getAttribute('actionButton')
                )
            }

            // close button
            if (this.getAttribute('closeButton')) {
                this.createCloseButton(this.getAttribute('closeButton'))
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
            var self = this;

            var shareData = this.$PasswordShare.$ActorSelectUsers.getActors().append(
                this.$PasswordShare.$ActorSelectGroups.getActors()
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