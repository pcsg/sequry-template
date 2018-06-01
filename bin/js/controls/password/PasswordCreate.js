/**
 * @module package/sequry/template/bin/js/controls/password/PasswordCreate
 */
define('package/sequry/template/bin/js/controls/password/PasswordCreate', [

    'qui/QUI',
    'qui/controls/Control',
    'Mustache',
    'Ajax',
    'Locale',

    'package/sequry/template/bin/js/Password',
    'package/sequry/core/bin/Authentication',
    'package/sequry/core/bin/controls/actors/Select',
    'package/sequry/core/bin/controls/securityclasses/SelectSlider',
    'package/sequry/core/bin/Actors',

    'text!package/sequry/template/bin/js/controls/password/PasswordCreate.html',
    'css!package/sequry/template/bin/js/controls/password/PasswordCreate.css'

], function (
    QUI,
    QUIControl,
    Mustache,
    QUIAjax,
    QUILocale,

    PasswordHandler,
    Authentication,
    ActorSelect,
    SecurityClassSelectSlider,
    Actors,

    template
) {
    "use strict";

    var lg = 'sequry/core';

    return new Class({

        Extends: QUIControl,
        Type   : 'package/sequry/template/bin/js/controls/password/PasswordCreate',

        Binds: [
            '$onInject',
            '$onSecurityClassSelectLoaded',
            '$onSecurityClassChange',
            '$onOwnerChange',
            '$showSetOwnerInformation'

        ],

        options: {
            id  : false,
            data: false
        },

        initialize: function (options) {
            this.parent(options);

            this.$OwnerSelectElm = null;

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
            var self = this;

            this.$Elm = this.getElm();

            PasswordHandler.getData(this.getAttribute('id')).then(function (result) {

                // @todo password muss von sequry kommen!
                // das hier ist nur eine zwischenlösung
                self.$Elm.set('html', Mustache.render(template, {
                    'userText'    : 'Benutzer',
                    'passwordText': 'Passwort',
                    'urlText'     : 'Url',
                    'noteText'    : 'Notiz'
                }));

                // insert security class select
                var SecurityClassElm = self.$Elm.getElement(
                    '.pass-stuffe'
                );

                self.$OwnerSelectElm = self.$Elm.getElement(
                    '.password-user-select'
                );

                self.$SecurityClassSelect = new SecurityClassSelectSlider({
                    events: {
                        onLoaded: self.$onSecurityClassSelectLoaded
                    }
                }).inject(
                    SecurityClassElm
                );

//
//                require([result.type], function(PWControl) {
//                    new PWControl().inject(self.getElm());
//                });
//
                // result.type

                self.setAttribute('data', result);
                self.fireEvent('load', [self]);
            });
        },

        /**
         * Return the title of the password
         *
         * @returns {string}
         */
        getTitle: function () {
            var data = this.getAttribute('data');

            if (!data) {
                return '';
            }

            if (typeof data.title === 'undefined') {
                return '';
            }

            return data.title;
        },

        /**
         * Return the typeof the password
         *
         * @returns {string|bool}
         */
        getType: function () {
            var data = this.getAttribute('data');

            if (!data) {
                return false;
            }

            if (typeof data.type === 'undefined') {
                return false;
            }

            return data.type;
        },

        /**
         * Get the string for type class.
         *
         * @returns {string}
         */
        getTypeClass: function () {
            return 'package/sequry/template/bin/js/controls/password/Password' + this.getType();
        },

        getTemplate: function () {
            require([this.getTypeClass()], function (Panel) {

            });
        },

        save: function () {
            PasswordHandler.save(this.getAttribute('id'), data);
        },

        /**
         * Execute if the security class select has loaded
         */
        $onSecurityClassSelectLoaded: function () {
            var self = this;

            Promise.all([
                Authentication.getDefaultSecurityClassId(),
                self.$getSettings()
            ]).then(function (result) {
                var securityClassId = result[0];
                self.$Settings = result[1];

                self.$SecurityClassSelect.addEvents({
                    onChange: self.$onSecurityClassChange
                });

                if (securityClassId) {
                    self.$SecurityClassSelect.setValue(
                        securityClassId
                    );
                } else {
                    securityClassId = self.$SecurityClassSelect.getValue();
                    self.$SecurityClassSelect.setValue(securityClassId);
                }

                self.fireEvent('loaded');
            });
        },

        /**
         * Get Password create settings
         *
         * @returns {Promise}
         */
        $getSettings: function () {
            return new Promise(function (resolve, reject) {
                QUIAjax.get('package_sequry_core_ajax_passwords_create_getSettings', resolve, {
                    'package': 'sequry/core',
                    onError  : reject
                });
            });
        },

        /**
         * Perform certain actions if the selected security class changes:
         *
         * - Check if the currently selected owner is eligible for security class
         *
         * @param {number} securityClassId - security class ID
         */
        $onSecurityClassChange: function (securityClassId) {
            var self = this;


            this.$OwnerSelectElm.set('html', '');
            var ActorSelectAttributes = {
                popupInfo       : QUILocale.get(lg,
                    'controls.password.create.ownerselect.info'
                ),
                max             : 1,
                securityClassIds: [securityClassId],

                events: {
                    onChange: this.$onOwnerChange
                }
            };

            switch (this.$Settings.actorTypePasswordCreate) {
                case 'users':
                    ActorSelectAttributes.selectedActorType = 'users';
                    ActorSelectAttributes.showEligibleOnly = false;
                    break;

                case 'users_eligible':
                    ActorSelectAttributes.selectedActorType = 'users';
                    ActorSelectAttributes.showEligibleOnly = true;
                    break;

                case 'groups':
                    ActorSelectAttributes.selectedActorType = 'groups';
                    ActorSelectAttributes.showEligibleOnly = false;
                    break;

                case 'groups_eligible':
                    ActorSelectAttributes.selectedActorType = 'groups';
                    ActorSelectAttributes.showEligibleOnly = true;
                    break;
            }

            this.$OwnerSelect = new ActorSelect(ActorSelectAttributes).inject(this.$OwnerSelectElm);

            if (!this.$loaded) {
                Authentication.isActorEligibleForSecurityClass(
                    QUIQQER_USER.id.toInt(),
                    'user',
                    securityClassId
                ).then(
                    function (isEligible) {
                        if (isEligible) {
                            console.log(999);
                            self.$OwnerSelect.addItem('u' + QUIQQER_USER.id.toInt());
                            console.log(111)

                        } else {
                            self.$showSetOwnerInformation();
                        }

                        self.$loaded = true;
                    }
                );

                return;
            }


            if (!this.$CurrentOwner) {
                this.$showSetOwnerInformation();
                return;
            }

            var ownerValue = this.$CurrentOwner.id;

            if (this.$CurrentOwner.type === 'user') {
                ownerValue = 'u' + ownerValue;
            } else {
                ownerValue = 'g' + ownerValue;
            }

            this.$OwnerSelect.addItem(ownerValue);

            Authentication.isActorEligibleForSecurityClass(
                this.$CurrentOwner.id,
                this.$CurrentOwner.type,
                securityClassId
            ).then(
                function (isEligible) {
                    if (isEligible) {
                        return;
                    }

                    if (self.$OwnerInfoElm) {
                        self.$OwnerInfoElm.destroy();
                    }

                    self.$OwnerInfoElm = new Element('div', {
                        'class': 'pcsg-gpm-password-warning',
                        styles : {
                            marginTop: 10
                        },
                        html   : QUILocale.get(lg, 'password.create.set.owner.not.eligible')
                    }).inject(self.$OwnerSelectElm);
                }
            );
        },

        /**
         * On owner change
         */
        $onOwnerChange: function () {
            var self   = this;
            var actors = this.$OwnerSelect.getActors();

            if (!actors.length) {
                this.$showSetOwnerInformation();
                this.$CurrentOwner = null;
                return;
            }

            this.$CurrentOwner = actors[0];

            if (this.$OwnerInfoElm) {
                this.$OwnerInfoElm.destroy();
            }

            if (this.$NoAccessWarningElm) {
                this.$NoAccessWarningElm.destroy();
            }

            // check if NoAccessWarning should be shown
            if (this.$CurrentOwner.type === 'user' && this.$CurrentOwner.id != QUIQQER_USER.id) {
                this.$NoAccessWarningElm = new Element('div', {
                    'class': 'pcsg-gpm-password-warning',
                    styles : {
                        marginTop: 10
                    },
                    html   : QUILocale.get(lg, 'password.create.warning.no_access_on_owner_change')
                }).inject(this.$OwnerSelectElm);

                return;
            }

            if (this.$CurrentOwner.type === 'group') {
                Actors.isUserInGroup(this.$CurrentOwner.id).then(function (isInGroup) {
                    if (!isInGroup) {
                        self.$NoAccessWarningElm = new Element('div', {
                            'class': 'pcsg-gpm-password-warning',
                            styles : {
                                marginTop: 10
                            },
                            html   : QUILocale.get(lg, 'password.create.warning.no_access_on_owner_change')
                        }).inject(self.$OwnerSelectElm);
                    }
                });
            }
        },

        /**
         * Show info about owner
         */
        $showSetOwnerInformation: function () {
            if (this.$OwnerInfoElm) {
                this.$OwnerInfoElm.destroy();
            }

            if (this.$NoAccessWarningElm) {
                this.$NoAccessWarningElm.destroy();
            }

            this.$OwnerInfoElm = new Element('div', {
                'class': 'pcsg-gpm-password-hint',
                styles : {
                    marginTop: 10
                },
                html   : this.$groupOwner ?
                    QUILocale.get(lg, 'password.create.set.owner.info_group') :
                    QUILocale.get(lg, 'password.create.set.owner.info_all')
            }).inject(this.$OwnerSelectElm);
        },

    });
});