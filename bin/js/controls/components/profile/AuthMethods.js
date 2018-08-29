/**
 * @module package/sequry/template/bin/js/controls/components/profile/AuthMethods
 */
define('package/sequry/template/bin/js/controls/components/profile/AuthMethods', [

    'qui/QUI',
    'qui/controls/Control',
    'Mustache',
    'Locale',

    'package/sequry/template/bin/js/controls/panels/Panel',
    'package/sequry/core/bin/Authentication',
    'package/sequry/core/bin/controls/auth/Register',
    'package/sequry/core/bin/controls/auth/Change',
    'package/sequry/core/bin/controls/auth/recovery/CodePopup',

    'text!package/sequry/template/bin/js/controls/components/profile/AuthMethods.Entry.html'

], function (QUI, QUIControl, Mustache, QUILocale,
    Panel,
    Authentication, // package/sequry/core/bin/Authentication
    AuthRegister, // package/sequry/core/bin/controls/auth/Register
    AuthChange, // package/sequry/core/bin/controls/auth/Change
    RecoveryCodePopup, // package/sequry/core/bin/controls/auth/recovery/CodePopup
    template
) {
    var lg = 'sequry/template';

    "use strict";
    return new Class({

        Extends: QUIControl,
        Type   : 'package/sequry/template/bin/js/controls/components/profile/AuthMethods',

        Binds: [
            '$onInject'
        ],

        initialize: function (options) {
            this.parent(options);

            this.addEvents({
                onImport: this.$onImport
            });
        },

        /**
         * event: on inject
         */
        $onImport: function () {
            var self = this;

            this.$ListElm = this.getElm().getElement('.quiqqer-sequry-profile-auth-methods-list');

            // todo michael muss noch besser gemacht werden.
            // auf onload o.ä. reagieren von package/sequry/core/bin/controls/user/AuthPluginSettings
            (function () {
                moofx(self.getElm()).animate({
                    opacity  : 1,
                    transform: 'translateX(0)'
                }, {
                    duration: 200
                });
            }).delay(200);

            this.$listRefresh();
        },

        /**
         * Get authenticaction plugins data and refresh the list
         *
         * @returns {*}
         */
        $listRefresh: function () {
            var self = this;

            this.$ListElm.set('html', '');

            return Authentication.getAuthPlugins().then(function (authPlugins) {
                console.log(authPlugins)
                for (var i = 0, len = authPlugins.length; i < len; i++) {
                    self.createEntry(authPlugins[i]);
                }
            });
        },

        /**
         * Create list entry
         *
         * @param EntryData
         */
        createEntry: function (EntryData) {
            var self                   = this,
                SecondaryIconContainer = null,
                status                 = 'notregistered';

            var statusText = QUILocale.get(
                lg, 'sequry.usersettings.category.authmethods.status.notregistered'
            );

            if (EntryData.registered) {
                statusText = QUILocale.get(
                    lg, 'sequry.usersettings.category.authmethods.status.registered'
                );
                status = 'registered';

                if (EntryData.sync) {
                    statusText = QUILocale.get(
                        lg, 'sequry.usersettings.category.authmethods.status.registeredsyncrequired'
                    );
                    status = 'registeredsyncrequired';

                }
            }

            var LiElm = new Element('li', {
                'class'      : 'sequry-table-list-entry',
                html         : Mustache.render(template, {
                    icon       : 'fa fa-key',
                    title      : EntryData.title,
                    idLabel    : QUILocale.get(lg, 'sequry.usersettings.category.authmethods.idlabel'),
                    id         : EntryData.id,
                    desc       : EntryData.description,
                    statusLabel: QUILocale.get(lg, 'sequry.usersettings.category.authmethods.statuslabel'),
                    status     : statusText
                }),
                'data-status': status // registered, notregistered, registeredsyncrequired
            });

            // not registered
            if (EntryData.registered === false) {
                SecondaryIconContainer = LiElm.getElement(
                    '.sequry-table-list-entry-icon-secondary'
                );

                SecondaryIconContainer.set('html', '');
                SecondaryIconContainer.addClass('sequry-table-list-entry-icon-secondary-register');

                new Element('button', {
                    'class': 'btn btn-small btn-secondary sequry-table-list-entry-regbutton',
                    html   : QUILocale.get(
                        lg, 'sequry.usersettings.category.authmethods.btn.register'
                    ),
                    events : {
                        click: function (event) {
                            self.registerUser(event, EntryData);
                        }
                    }
                }).inject(SecondaryIconContainer);

                LiElm.setAttribute('title', QUILocale.get(
                    lg, 'sequry.usersettings.category.authmethods.btn.register'
                ));
            } else {

                // registered - show buttons
                var Container = new Element('div', {
                    'class': 'sequry-table-list-entry-details',
                    html   : '<div class="sequry-table-list-entry-details-inner"></div>'
                }).inject(LiElm);

                var btnChangeText     = QUILocale.get(lg, 'sequry.usersettings.category.authmethods.btn.change'),
                    btnRecoveryText   = QUILocale.get(lg, 'sequry.usersettings.category.authmethods.btn.recovery'),
                    btnRegenerateText = QUILocale.get(lg, 'sequry.usersettings.category.authmethods.btn.regenerate');

                // password synchronization required
                if (EntryData.sync) {
                    var tbnExeSync = QUILocale.get(
                        lg, 'sequry.usersettings.category.authmethods.btn.status.registeredsyncrequired'
                    );
                    new Element('button', {
                        'class': 'btn btn-warning btn-small sequry-table-list-entry-details-btn ',
                        html   : '<span class="fa  fa-exclamation-triangle"></span>' + tbnExeSync,
                        events : {
                            click: function (event) {
                                self.$syncAuthPlugin(event, EntryData.id);
                            }
                        }
                    }).inject(Container.getElement('.sequry-table-list-entry-details-inner'));
                }

                // 3x buttons
                new Element('button', {
                    'class': 'btn btn-secondary btn-small btn-outline sequry-table-list-entry-details-btn',
                    html   : '<span class="fa fa-edit"></span>' + btnChangeText,
                    events : {
                        click: function (event) {
                            self.change(event, EntryData);
                        }
                    }
                }).inject(Container.getElement('.sequry-table-list-entry-details-inner'));

                new Element('button', {
                    'class': 'btn btn-secondary btn-small btn-outline sequry-table-list-entry-details-btn',
                    html   : '<span class="fa fa-question-circle"></span>' + btnRecoveryText,
                    events : {
                        click: function (event) {
                            self.recovery(event, EntryData);
                        }
                    }
                }).inject(Container.getElement('.sequry-table-list-entry-details-inner'));

                new Element('button', {
                    'class': 'btn btn-secondary btn-small btn-outline sequry-table-list-entry-details-btn',
                    html   : '<span class="fa fa-retweet"></span>' + btnRegenerateText,
                    events : {
                        click: function (event) {
                            self.regenerate(event, EntryData);
                        }
                    }
                }).inject(Container.getElement('.sequry-table-list-entry-details-inner'));

                // toggle details
                var ToggleBtn = LiElm.getElement('.sequry-table-list-entry-icon-secondary');
                ToggleBtn.set('data-open', false);

                ToggleBtn.addEvent('click', function () {
                    self.toggleDetails(event, Container);
                });
            }

            LiElm.inject(this.$ListElm);
        },

        /**
         * Open / close details with buttons
         *
         * @param event
         * @param Container
         */
        toggleDetails: function (event, Container) {
            var Button = event.target;

            if (Button.nodeName !== 'DIV') {
                Button = Button.getParent('.sequry-table-list-entry-icon-secondary')
            }

            var Icon   = Button.getElement('.fa'),
                status = Button.getAttribute('data-open');

            if (status === 'true') {
                moofx(Container).animate({
                    height: 0
                }, {
                    duration: 150
                });

                Button.setProperty('data-open', false);
                Icon.removeClass('fa-angle-double-up');
                Icon.addClass('fa-angle-double-down');
                return;
            }

            var height = Container.getElement('.sequry-table-list-entry-details-inner').getSize().y;

            moofx(Container).animate({
                height: height
            }, {
                duration  : 150,
                registrate: 1
            });

            Button.setProperty('data-open', true);
            Icon.removeClass('fa-angle-double-down');
            Icon.addClass('fa-angle-double-up');
        },

        /**
         * Open window to synchronise an authentication plugin
         *
         * @param {Number} authPluginId
         */
        $syncAuthPlugin: function (event, authPluginId) {
            event.stop();
            var self = this;

            var startSync = function () {
//                self.Loader.show();

                QUIAjax.post(
                    'package_sequry_core_ajax_auth_syncAuthPlugin',
                    function () {
//                        self.Loader.hide();
                        self.$listRefresh()
                    }, {
                        'package'   : 'sequry/core',
                        authPluginId: authPluginId
                    }
                );
            };

            Authentication.getNonFullyAccessibleSecurityClassIds(
                authPluginId
            ).then(function (securityClassIds) {
                Authentication.multiSecurityClassAuth(
                    securityClassIds,
                    QUILocale.get('sequry/core', 'auth.panel.sync_info'),
                    [authPluginId]
                ).then(
                    startSync,
                    function () {
                        self.$listRefresh()
                    }
                );
            });
        },

        /**
         * Register for auth method
         */
        registerUser: function (event, EntryData) {
            event.stop();

            var self = this;
            var AuthPluginData = EntryData;
            var Register;

            var title = 'Zugangsdaten ändern';
            var subTitle = EntryData.title;

            var SubPanel = new Panel({
//                title: QUILocale.get('sequry/template', 'sequry.usermenu.entrysettings.title'),
                title                  : title,
                subTitle               : subTitle,
                width                  : 1000,
                iconHeaderButton       : QUILocale.get('sequry/template', 'sequry.panel.button.close'),
                iconHeaderButtonFaClass: 'fa fa-close',
                isOwner                : true,
                subPanel               : true,
                events                 : {
                    onOpenBegin      : function (PanelControl) {
                        PanelControl.getElm().addClass('panel-authmethod-subpanel panel-authmethod-register');
                    },
                    onOpen           : function (PanelControl) {
                        var Content = PanelControl.getContent();
                        Content.setStyle('opacity', 0);

                        var Inner = new Element('div', {
                            'class': 'panel-authmethod-subpanel-inner panel-authmethod-register-inner'
                        }).inject(Content);

                        Register = new AuthRegister({
                            authPluginId: AuthPluginData.id,
                            events      : {
                                onFinish: function (Reg) {
//                                    self.Loader.hide();

                                    // workaround - set placeholder
                                    var labels = PanelControl.getElm().getElements(
                                        '.sequry-auth-secondpassword-registration label'
                                    );

                                    for (var i = 0, len = labels.length; i < len; i++) {
                                        var text  = labels[i].getElement('span').get('html'),
                                            input = labels[i].getElement('input');
                                        input.set('placeholder', text);
                                    }

                                    new Element('button', {
                                        'class': 'btn btn-primary quiqqer-sequry-profile-auth-methods-submit',
                                        html   : 'Speichern',
                                        events : {
                                            click: FuncOnRegisterBtnClick
                                        }
                                    }).inject(Inner);

                                    moofx(Content).animate({
                                        opacity: 1
                                    }, {
                                        duration: 200
                                    })
                                }
                            }
                        }).inject(Inner);

                    },
                    onSubmitSecondary: function () {
                        this.close();
                    },
                    onClose          : function (PanelControl) {
                        PanelControl.close();
                    }
                }
            });

            var FuncOnRegisterBtnClick = function () {
                // todo erst später. zunächst reicht, wenn das Popup manuell aufgerufen werden kann.
                return;
                Register.submit().then(function (RecoveryCodeData) {

                    if (!RecoveryCodeData) {
                        return;
                    }

                    new RecoveryCodePopup({
                        RecoveryCodeData: RecoveryCodeData,
                        events          : {
                            onClose: function () {
                                RecoveryCodeData = null;
                                self.$nonFullyAccessiblePasswordCheck(
                                    AuthPluginData.id,
                                    SubPanel
                                );
                            }
                        }
                    }).open();
                });
            };

            SubPanel.open();

        },

        /**
         * Checks for all passwords that can be accessed with a specific
         * authentication plugin of the user has access to all those passwords
         * via this authentication plugin
         *
         * @param {number} authPluginId
         * @param {object} SubPanel
         */
        $nonFullyAccessiblePasswordCheck: function (authPluginId, SubPanel) {
            // todo erst später. zunächst reicht, wenn das Popup manuell aufgerufen werden kann.
            var self = this;

            Authentication.hasNonFullyAccessiblePasswords(
                authPluginId
            ).then(function (result) {
                if (!result) {
                    SubPanel.close();
                    return;
                }

                self.$syncAuthPlugin(authPluginId);
            });
        },

        /**
         * Change access data
         */
        change: function (event, EntryData) {
            event.stop();

            var AuthPluginData = EntryData;
            var Register;

            var title = 'Zugangsdaten ändern';
            var subTitle = EntryData.title;

            var PasswordPanel = new Panel({
//                title: QUILocale.get('sequry/template', 'sequry.usermenu.entrysettings.title'),
                title                  : title,
                subTitle               : subTitle,
                width                  : 1000,
                iconHeaderButton       : QUILocale.get('sequry/template', 'sequry.panel.button.close'),
                iconHeaderButtonFaClass: 'fa fa-close',
                isOwner                : true,
                subPanel               : true,
                events                 : {
                    onOpenBegin      : function (PanelControl) {
                        PanelControl.getElm().addClass('panel-authmethod-subpanel panel-authmethod-change');
                    },
                    onOpen           : function (PanelControl) {
                        var Content = PanelControl.getContent();
                        Content.setStyle('opacity', 0);

                        var Inner = new Element('div', {
                            'class': 'panel-authmethod-subpanel-inner panel-authmethod-change-inner'
                        }).inject(Content);

                        Register = new AuthChange({
                            Parent      : self,
                            authPluginId: AuthPluginData.id,
                            events      : {
                                onLoaded: function () {
//                                    self.Loader.hide();

                                    new Element('button', {
                                        'class': 'btn btn-primary quiqqer-sequry-profile-auth-methods-submit',
                                        html   : 'Speichern',
                                        events : {
                                            click: Register.submit
                                        }
                                    }).inject(Inner);

                                    moofx(Content).animate({
                                        opacity: 1
                                    }, {
                                        duration: 200
                                    })
                                },
                                onFinish: function () {
                                    PanelControl.close();
                                }
                            }
                        }).inject(Inner);

                    },
                    onSubmitSecondary: function () {
                        this.close();
                    }
                }
            });

            PasswordPanel.open();
        },

        /**
         *Recover access data
         */
        recovery: function (event) {
            event.stop();
            console.log('Zugangsdaten vergessen');
        },

        /**
         * Regenerate recovery code
         */
        regenerate: function (event) {
            event.stop();
            console.log('Wiederherstellungs-Code neu generieren');
        }
    });
});
