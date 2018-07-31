/**
 * Panel control to create a new password.
 * It inherits from Panel.js
 *
 * @module package/sequry/template/bin/js/controls/panels/PasswordCreatePanel
 * @author www.pcsg.de (Michael Danielczok)
 */
define('package/sequry/template/bin/js/controls/panels/PasswordCreatePanel', [

    'qui/QUI',
    'qui/controls/Control',
    'Ajax',
    'Locale',

    'package/sequry/core/bin/Actors',
    'package/sequry/template/bin/js/Password',
    'package/sequry/template/bin/js/controls/panels/Panel',
    'package/sequry/template/bin/js/controls/password/PasswordCreate',
    'package/sequry/core/bin/Passwords'

], function (
    QUI,
    QUIControl,
    QUIAjax,
    QUILocale,
    Actors,
    PasswordManager,
    Panel,
    PasswordCreate,
    Passwords
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
            closeButton : QUILocale.get(lg, 'sequry.panel.button.close'),
            mode        : 'create',
            passwordId  : false
        },

        initialize: function (options) {
            this.parent(options);

            this.setAttribute('confirmClosePopup', true);

            this.$Password = null;
            this.$PasswordData = null;

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
            var self = this;

            /**
             * edit or create new password?
             */
            if (this.getAttribute('mode') === 'edit') {
                // edit
                var passwordId = this.getAttribute('passwordId');

                Actors.getPasswordAccessInfo(passwordId).then(function (AccessInfo) {

                    if (!AccessInfo.canAccess) {
                        Passwords.getNoAccessInfoElm(AccessInfo, self).inject(self.$Elm);
                        self.fireEvent('loaded');
                        return;
                    }

                    PasswordManager.getData(passwordId).then(function (PasswordData) {
                        if (!PasswordData) {
                            self.close();
                            return false;
                        }

                        self.$Password = new PasswordCreate({
                            id    : passwordId,
                            data  : PasswordData,
                            mode  : 'edit',
                            events: {
                                onLoad: function (PWCreate) {
                                    self.setTitle(QUILocale.get(lg, 'sequry.panel.createPassword.edit.title'));
                                    PWCreate.setData();
                                    self.ButtonParser.parse(self.getElm());
                                    self.Loader.hide();
                                }
                            }
                        }).inject(self.getContent());
                    })
                });

            } else {
                // create
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
            }

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

            this.$PasswordData = {
                securityClassId   : this.$Password.$SecurityClassSelect.getValue(),
                title             : this.$Password.$Elm.getElement('input.pcsg-gpm-password-title').value,
                description       : this.$Password.$Elm.getElement('input.pcsg-gpm-password-description').value,
                dataType          : this.$Password.$PasswordTypes.getPasswordType(),
                payload           : this.$Password.$PasswordTypes.getData(),
                categoryIds       : this.$Password.$CategorySelect.getValue(),
                categoryIdsPrivate: this.$Password.$CategorySelectPrivate.getValue()
            };

            var actors = this.$Password.$OwnerSelect.getActors();

            if (!actors.length) {
                QUI.getMessageHandler(function (MH) {
                    MH.addAttention(
                        QUILocale.get(lg, 'password.create.submit.no.owner.assigned')
                    );
                });

                return Promise.resolve();
            }

            this.$PasswordData.owner = actors[0];

            return new Promise(function (resolve, reject) {
                self.submitAction().then(function (passwordId) {
                    if (!passwordId) {
                        reject();
                        return;
                    }

                    self.$PasswordData = null;
                    self.fireEvent('finish');
                })
            });
        },

        /**
         * Depend on mode (edit or create new password) execute the right function
         *
         * @return {Promise}
         */
        submitAction: function () {
            if (this.getAttribute('mode') === 'edit') {
                return Passwords.editPassword(
                    this.getAttribute('passwordId'),
                    this.$PasswordData
                )
            }

            return Passwords.createPassword(
                this.$PasswordData
            )
        },

        /**
         * Prevent accidentally closing the panel
         */
        confirmClose: function () {
            var self      = this,
                title     = QUILocale.get(lg, 'sequry.customPopup.confirm.create.title'),
                content   = QUILocale.get(lg, 'sequry.customPopup.confirm.create.content'),
                btnOk     = QUILocale.get(lg, 'sequry.customPopup.confirm.create.button.ok'),
                btnCancel = QUILocale.get(lg, 'sequry.customPopup.confirm.create.button.cancel');

            var confirmContent = '<span class="fa fa-times popup-icon"></span>';
            confirmContent += '<span class="popup-title">' + title + '</span>';
            confirmContent += '<p class="popup-content">' + content + '</p>';

            require(['qui/controls/windows/Confirm'], function (QUIConfirm) {
                var Popup = new QUIConfirm({
                    'class'           : 'sequry-customPopup',
                    maxWidth          : 400, // please note extra styling in style.css
                    backgroundClosable: false,
                    title             : false,
                    titleCloseButton  : false,
                    icon              : false,
                    texticon          : false,
                    content           : confirmContent,
                    ok_button         : {
                        text     : btnOk,
                        textimage: false
                    },
                    cancel_button     : {
                        text     : btnCancel,
                        textimage: false
                    },
                    events            : {
                        onSubmit: self.close
                    }
                });

                Popup.open();
            })
        }
    });
});