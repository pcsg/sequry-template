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

    'text!package/sequry/template/bin/js/controls/components/profile/AuthMethods.Entry.html'

], function (QUI, QUIControl, Mustache, QUILocale,
    Panel,
    Authentication,
    AuthRegister,
    AuthChange,
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
         * @param Entry
         */
        createEntry: function (EntryData) {
            var self = this;

            var statusText = QUILocale.get(
                lg, 'sequry.usersettings.category.authmethods.status.notregistered'
            );

            if (EntryData.registered) {
                statusText = QUILocale.get(
                    lg, 'sequry.usersettings.category.authmethods.status.registered'
                );
            }

            var LiElm = new Element('li', {
                'class'      : 'sequry-table-list-entry',
                html         : Mustache.render(template, {
                    icon  : 'fa fa-key',
                    title : EntryData.title,
                    id    : EntryData.id,
                    desc  : EntryData.description,
                    status: statusText
                }),
                'data-status': EntryData.registered // true or false
            });

            // not registered
            if (EntryData.registered === false) {
                var SecondaryIconContainer = LiElm.getElement(
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

                // 3x buttons
                new Element('button', {
                    'class': 'btn btn-secondary btn-small btn-outline sequry-table-list-entry-details-btn',
                    html   : '<span class="fa fa-edit"></span>' + btnChangeText,
                    'data-authname' : EntryData.title,
                    events : {
                        click: function (event) {
                            self.change(event, EntryData);
                        }
                    }
                }).inject(Container.getElement('.sequry-table-list-entry-details-inner'));

                new Element('button', {
                    'class': 'btn btn-secondary btn-small btn-outline sequry-table-list-entry-details-btn',
                    html   : '<span class="fa fa-question-circle"></span>' + btnRecoveryText,
                    'data-authname' : EntryData.title,
                    events : {
                        click: function (event) {
                            self.recovery(event, EntryData);
                        }
                    }
                }).inject(Container.getElement('.sequry-table-list-entry-details-inner'));

                new Element('button', {
                    'class': 'btn btn-secondary btn-small btn-outline sequry-table-list-entry-details-btn',
                    html   : '<span class="fa fa-retweet"></span>' + btnRegenerateText,
                    'data-authname' : EntryData.title,
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
         * Register for auth method
         */
        registerUser: function (event) {
            event.stop();
            console.log('Registrieren');
        },

        /**
         * Change access data
         */
        change: function (event, EntryData) {
            event.stop();

            var Target = event.target;
            var AuthPluginData = EntryData;

            if (Target.nodeName !== 'BUTTON') {
                Target = Target.getParent('button');
            }

            var title = 'Zugangsdaten ändern';
            var subTitle = Target.get('data-authname');

            var PasswordPanel = new Panel({
//                title: QUILocale.get('sequry/template', 'sequry.usermenu.entrysettings.title'),
                title: title,
                subTitle: subTitle,
                width: 1000,
                iconHeaderButton: QUILocale.get('sequry/template', 'sequry.panel.button.close'),
                iconHeaderButtonFaClass: 'fa fa-close',
                isOwner: true,
                subPanel: true,
                events: {
                    onOpen: function (PanelControl) {
                        var Change = new AuthChange({
                            Parent      : self,
                            authPluginId: AuthPluginData.id,
                            events      : {
                                onLoaded: function () {
//                                    self.Loader.hide();
                                },
                                onFinish: function () {
                                    PanelControl.close();
                                }
                            }
                        }).inject(PanelControl.getContent());


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
