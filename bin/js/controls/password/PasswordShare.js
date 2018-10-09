/**
 * @module package/sequry/template/bin/js/controls/password/PasswordShare
 */
define('package/sequry/template/bin/js/controls/password/PasswordShare', [

    'qui/QUI',
    'qui/controls/Control',
    'qui/controls/loader/Loader',
    'Mustache',
    'Ajax',
    'Locale',

    'package/sequry/core/bin/Actors',
    'package/sequry/core/bin/Passwords',
    'package/sequry/template/bin/js/controls/password/PasswordShareIntern',
    'package/sequry/template/bin/js/controls/password/link/List',

    'text!package/sequry/template/bin/js/controls/password/PasswordShare.html',
    'css!package/sequry/template/bin/js/controls/password/PasswordShare.css'

], function (
    QUI, QUIControl, QUILoader, Mustache, QUIAjax, QUILocale,
    Actors,
    Passwords,
    PasswordShareIntern,
    PasswordLinkList,
    template
) {
    "use strict";

    var lg = 'sequry/template';

    return new Class({

        Extends: QUIControl,
        Type   : 'package/sequry/template/bin/js/controls/password/PasswordShare',

        Binds: [
            '$onInject',
            'toggleShareTypes'
        ],

        options: {
            passwordId: false //passwordId
        },

        initialize: function (options) {
            this.parent(options);

            this.Loader = new QUILoader();
            this.TabButtons = null;
            this.ShareContainer = null;
            this.$PasswordLink = null;
            this.$PasswordShare = null;

            this.addEvents({
                onInject: this.$onInject
            });
        },

        /**
         * event: on inject
         *
         * Create the password html stuff
         */
        $onInject: function () {
            var self    = this,
                pwId    = this.getAttribute('passwordId'),
                pwTitle = this.getAttribute('passwordTitle');

            if (pwTitle) {
                this.setSubtitle(pwTitle);
            }

            this.$Elm = this.getElm();

            self.$Elm.set('html', Mustache.render(template));

            // tab buttons to switch between "share intern" and "create link"
            this.TabButtons = self.$Elm.getElements('.share-password-tab-btn');

            this.TabButtons.addEvent(
                'click', self.toggleShareTypes
            );

            this.ShareContainer = this.$Elm.getElement('.share-password-wrapper');

            this.Loader.inject(this.ShareContainer);

            Actors.getPasswordAccessInfo(pwId).then(function (AccessInfo) {

                if (!AccessInfo.canAccess) {
                    Passwords.getNoAccessInfoElm(AccessInfo, self).inject(self.$Elm);
                    self.close();
                    return;
                }

                Promise.all([
                    self.createPasswordShareIntern(pwId),
                    self.createPasswordShareLink(pwId, pwTitle)
                ]).then(function () {
                    self.fireEvent('load');
                });
            });
        },

        /**
         * Toggle Button status and slide content (share intern / share link)
         *
         * @param event
         */
        toggleShareTypes: function (event) {
            event.stop();

            var Button = event.target;

            if (Button.hasClass('active')) {
                return;
            }

            this.Loader.show();
            this.TabButtons.removeClass('active');

            Button.addClass('active');

            // share type: intern | link
            var self            = this,
                shareType       = Button.getProperty('data-qui-share-type'),
                shareContainers = this.ShareContainer.getElements('.qui-control'),
                leftValue       = 0; // show "share password intern"

            if (shareType === 'link') {
                leftValue = '-100%'; // show "share password link"
            }

            moofx(shareContainers).animate({
                left: leftValue
            }, {
                duration: 350,
                callback: function () {
                    self.Loader.hide();
                }
            });
        },

        /**
         * Created Password Share Intern control and inject into the password wrapper
         *
         * @param pwId
         * @returns {Promise}
         */
        createPasswordShareIntern: function (pwId) {
            var self = this;

            return new Promise(function (resolve, reject) {
                self.$PasswordShare = new PasswordShareIntern({
                    passwordId: pwId,
                    events    : {
                        onLoad : function () {
                            resolve();
                        },
                        onClose: function () {
                            reject();
                        }
                    }
                }).inject(self.ShareContainer);
            })
        },

        /**
         * Created Password Share Link control and inject into the password wrapper
         *
         * @param pwId
         * @param pwTitle
         * @returns {Promise}
         */
        createPasswordShareLink: function (pwId, pwTitle) {
            var self = this;

            return new Promise(function (resolve, reject) {

                self.$PasswordLink = new PasswordLinkList({
                    passwordId   : pwId,
                    passwordTitle: pwTitle,
                    events       : {
                        onLoad : function () {
                            resolve()
                        },
                        onClose: function () {
                            reject();
                        }
                    }
                }).inject(self.ShareContainer);
            })
        }
    });
});