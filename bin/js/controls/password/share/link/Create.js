/**
 * Control for creating / viewing password links
 *
 * @module package/sequry/core/bin/controls/password/share/link/Create
 * @author www.pcsg.de (Patrick Müller)
 *
 * @event onSubmit [this] - fires after a new PasswordLink has been successfully created
 * @event onLoaded [this] - fires after everything loaded
 * @event onNoPasswordSites [this] - fires if every is loaded but no sites with the correct password link site type exist
 */
define('package/sequry/template/bin/js/controls/password/share/link/Create', [

    'qui/QUI',
    'qui/controls/Control',
    'qui/controls/buttons/Button',
    'controls/email/Select',


    'package/sequry/core/bin/controls/utils/InputButtons',

    'Ajax',
    'Locale',
    'Mustache',

    'package/sequry/core/bin/Passwords',

    'text!package/sequry/template/bin/js/controls/password/share/link/Create.html',
    'css!package/sequry/template/bin/js/controls/password/share/link/Create.css'

], function (QUI, QUIControl, QUIButton, QUIMailSelect, InputButtons,
    QUIAjax, QUILocale, Mustache, Passwords, template
) {
    "use strict";

    var lg = 'sequry/template';
    var lgCore = 'sequry/core';

    return new Class({

        Extends: QUIControl,
        Type   : 'package/sequry/template/bin/js/controls/password/share/link/Create',

        Binds: [
            'create',
            'submit',
            '$checkPasswordLength'
        ],

        options: {
            passwordId: false // passwordId
        },

        initialize: function (options) {
            this.parent(options);

            this.$PasswordInput = null;
            this.$currentEmailReceiverValue = null;
        },

        /**
         * create the domnode element
         *
         * @return {HTMLDivElement}
         */
        create: function () {
            this.$Elm = this.parent();

            var self = this;
            var lgPrefix = 'controls.password.linkcreate.template.';

            this.$Elm.set({
                'class': 'password-linkcreate',
                html   : Mustache.render(template, {
                    validDateLabel       : QUILocale.get(lgCore, lgPrefix + 'validDateLabel'),
                    maxCallsLabel        : QUILocale.get(lgCore, lgPrefix + 'maxCallsLabel'),
                    passwordLabel        : QUILocale.get(lgCore, lgPrefix + 'passwordLabel'),
                    titleLabel           : QUILocale.get(lgCore, lgPrefix + 'titleLabel'),
                    messageLabel         : QUILocale.get(lgCore, lgPrefix + 'messageLabel'),
                    emailLabel           : QUILocale.get(lgCore, lgPrefix + 'emailLabel'),
                    vhostLabel           : QUILocale.get(lgCore, lgPrefix + 'vhostLabel'),
                    validDateOption1Day  : QUILocale.get(lgCore, lgPrefix + 'validDateOption1Day'),
                    validDateOption3Day  : QUILocale.get(lgCore, lgPrefix + 'validDateOption3Day'),
                    validDateOption1Week : QUILocale.get(lgCore, lgPrefix + 'validDateOption1Week'),
                    validDateOption1Month: QUILocale.get(lgCore, lgPrefix + 'validDateOption1Month'),
                    validDateOptionDate  : QUILocale.get(lgCore, lgPrefix + 'validDateOptionDate'),
                    activeLabel          : QUILocale.get(lg, 'sequry.panel.linkList.createLink.activate')
                })
            });

            // activate / deactivate event
            var ActiveValidDate = this.$Elm.getElement(
                '.password-linkcreate-validDate'
            );

            var ValidDateSelect = this.$Elm.getElement(
                'select[name="validDateSelect"]'
            );

            var ValidDateInput = this.$Elm.getElement(
                'input[name="validDate"]'
            );

            var ValidDateDateSelect = this.$Elm.getElement(
                '.password-linkcreate-date'
            );

            var changeStatusCheckbox = function (Checkbox) {
                var Label = Checkbox.getParent('label');

                if (Checkbox.checked) {
                    Label.addClass('active');
                } else {
                    Label.removeClass('active')
                }
            };

            ValidDateDateSelect.addEvent('change', function (event) {
                ValidDateInput.value = event.target.value;
            });

            ValidDateSelect.addEvent('change', function (event) {
                if (event.target.value !== 'date') {
                    ValidDateDateSelect.setStyle('display', 'none');
                    ValidDateInput.value = event.target.value;
                    return;
                }

                ValidDateDateSelect.setStyle('display', 'block');
                ValidDateInput.value = ValidDateDateSelect.value;
            });

            ActiveValidDate.addEvent('change', function () {
                changeStatusCheckbox(this);

                ValidDateInput.disabled = !ValidDateInput.disabled;
                ValidDateSelect.disabled = !ValidDateSelect.disabled;
            });

            var ActiveMaxCalls = this.$Elm.getElement(
                '.password-linkcreate-maxCalls'
            );

            var MaxCallsInput = this.$Elm.getElement(
                'input[name="maxCalls"]'
            );

            ActiveMaxCalls.addEvent('change', function () {
                MaxCallsInput.disabled = !MaxCallsInput.disabled;

                changeStatusCheckbox(this);

                if (!MaxCallsInput.disabled) {
                    MaxCallsInput.focus();
                }
            });

            var ActivePasswords = this.$Elm.getElement(
                '.password-linkcreate-password'
            );

            this.$PasswordInput = this.$Elm.getElement(
                'input[name="password"]'
            );

            var GeneratePinBtn = new QUIButton({
                icon  : 'fa fa-random',
                title : QUILocale.get(lg, 'sequry.panel.linkList.createLink.generatePinButton'),
                events: {
                    onClick: function (Btn, event) {
                        event.stop();

                        var Elm = Btn.getAttribute('InputElm');

                        Btn.setAttribute('icon', 'fa fa-spin fa-spinner');
                        Btn.disable();

                        self.$generatePin().then(function (pin) {
                            Elm.value = pin;
                            Btn.setAttribute('icon', 'fa fa-random');
                            Btn.enable();
                        });
                    }
                }
            });

            GeneratePinBtn.disable();

            ActivePasswords.addEvent('change', function () {
                changeStatusCheckbox(this);

                self.$PasswordInput.disabled = !self.$PasswordInput.disabled;

                if (!self.$PasswordInput.disabled) {
                    GeneratePinBtn.enable();
                    self.$PasswordInput.focus();
                } else {
                    self.$PasswordInput.value = '';
                    GeneratePinBtn.disable();
                }
            });

            this.$PasswordInput.addEvents({
                blur: function () {
                    (function () {
                        self.$checkPasswordLength();
                    }.delay(200));
                }
            });

            // add random password btn
            var InputButtonsParser = new InputButtons();

            InputButtonsParser.parse(self.$PasswordInput, [], [GeneratePinBtn]);

            // set default title and description
            Passwords.getLinkPasswordData(this.getAttribute('passwordId')).then(function (Password) {
                self.$Elm.getElement(
                    'input[name="title"]'
                ).value = Password.title;

                self.$Elm.getElement(
                    'textarea[name="message"]'
                ).value = Password.description;
            });

            // emails
            var EmailsInput = this.$Elm.getElement(
                'input[name="email"]'
            );

            this.$EmailReceiverSelect = new QUIMailSelect({
                events: {
                    onChange: function (Control) {
                        EmailsInput.value = Control.getValue();
                    }
                }
            }).imports(this.$Elm.getElement('.password-linkcreate-emails'));

            this.$EmailReceiverSelect.getElm().getElement('input.qui-elements-select-list-search').addEvents({
                keyup: function (event) {
                    self.$currentEmailReceiverValue = event.target.value;
                },
                click: function () {
                    self.$currentEmailReceiverValue = '';
                }
            });

            // vhosts
            var VHostRowElm = this.$Elm.getElement(
                '.password-linkcreate-vhost'
            );

            this.$getVHostList().then(function (vhosts) {
                if (!vhosts.length) {
                    self.$Elm.set(
                        'html',
                        '<div class="pcsg-gpm-password-linkcreate-info">' +
                        QUILocale.get(lgCore, 'controls.password.linkcreate.no_password_sites') +
                        '<div class="pcsg-gpm-password-linkcreate-info-btn"></div>' +
                        '</div>'
                    );

                    VHostRowElm.destroy();
                    self.fireEvent('noPasswordSites', [self]);
                    return;
                }

                if (vhosts.length <= 1) {
                    VHostRowElm.destroy();
                    return;
                }

                var VHostSelectElm = self.$Elm.getElement(
                    '.password-linkcreate-vhost-select'
                );

                for (var i = 0, len = vhosts.length; i < len; i++) {
                    new Element('option', {
                        value: vhosts[i],
                        html : vhosts[i]
                    }).inject(VHostSelectElm);
                }

                if (vhosts.length > 1) {
                    VHostRowElm.removeClass('password-linkcreate__hidden');
                }
            });

            self.fireEvent('loaded', [self]);

            return this.$Elm;
        },

        /**
         * Check if password has minimum number of characters (if active)
         *
         * @return {boolean}
         */
        $checkPasswordLength: function () {
            var self = this;

            if (this.$PasswordInput.disabled) {
                return true;
            }

            if (this.$PasswordInput.value.length >= 6) {
                return true;
            }

            QUI.getMessageHandler().then(function (MH) {
                MH.addAttention(
                    QUILocale.get(lgCore, 'controls.password.linkcreate.password_min_length'),
                    self.$PasswordInput
                );
            });

            this.$PasswordInput.focus();

            return false;
        },

        /**
         * Create new password link
         *
         * @returns {Promise}
         */
        submit: function () {
            if (!this.$checkPasswordLength()) {
                return Promise.reject();
            }

            var formElements = this.$Elm.getElements(
                '.password-linkcreate-option'
            );

            var LinkCreateData = {};

            for (var i = 0, len = formElements.length; i < len; i++) {
                var FormElm = formElements[i];

                if (FormElm.disabled) {
                    continue;
                }

                LinkCreateData[FormElm.get('name')] = FormElm.value;
            }

            if (this.$currentEmailReceiverValue) {
                var emails = [];

                if (LinkCreateData.email) {
                    emails = LinkCreateData.email.split(',');
                }

                emails.push(this.$currentEmailReceiverValue);
                LinkCreateData.email = emails.join(',');
            }

            return Passwords.createLink(
                this.getAttribute('passwordId'),
                LinkCreateData
            );
        },

        /**
         * Generate a random PIN
         *
         * @return {Promise}
         */
        $generatePin: function () {
            return new Promise(function (resolve, reject) {
                QUIAjax.get(
                    'package_sequry_core_ajax_passwords_link_generatePin', resolve, {
                        'package': 'sequry/core',
                        onError  : reject
                    }
                );
            });
        },

        /**
         * Get list of virtual hosts
         *
         * @returns {Promise}
         */
        $getVHostList: function () {
            return new Promise(function (resolve, reject) {
                QUIAjax.get(
                    'package_sequry_core_ajax_passwords_link_getVHostList', resolve, {
                        'package': 'sequry/core',
                        onError  : reject
                    }
                );
            });
        }
    });
});
