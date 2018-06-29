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
    'package/sequry/template/bin/js/controls/password/PasswordCreate',
    'package/sequry/core/bin/Passwords'

], function (
    QUI,
    QUIControl,
    QUIAjax,
    QUILocale,
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
            title              : false,
            actionButton       : QUILocale.get(lg, 'sequry.panel.button.save'),
            closeButton        : QUILocale.get(lg, 'sequry.panel.button.close'),
            popupConfirmIcon   : '<span class="fa fa-question popup-icon"></span>',
            popupConfirmTitle  : '<span class="popup-title">Aktion abbrechen</span>',
            popupConfirmContent: '<p class="popup-content">Das Passwortfenster wird geschloßen und alle bereits eingegebene Daten gehen verloren.</p>'
        },

        initialize: function (options) {
            this.parent(options);

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
                Passwords.createPassword(
                    self.$PasswordData
                ).then(
                    function (newPasswordId) {
                        if (!newPasswordId) {
                            reject();
                            return;
                        }

                        self.$PasswordData = null;
                        self.fireEvent('finish');
                        resolve();
                    }
                );
            });
        },

        /**
         * Avoid accidentally close the panel
         */
        confirmClose: function () {
            var self      = this,
                title     = QUILocale.get(lg, 'sequry.customPopup.confirm.create.title'),
                content   = QUILocale.get(lg, 'sequry.customPopup.confirm.create.content'),
                btnOk     = QUILocale.get(lg, 'sequry.customPopup.confirm.create.button.ok'),
                btnCancel = QUILocale.get(lg, 'sequry.customPopup.confirm.create.button.cancel');

            var confirmContent = '<span class="fa fa-question popup-icon"></span>';
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
                        onSubmit: self.cancel
                    }
                });

                Popup.open();
            })
        }
    });
});