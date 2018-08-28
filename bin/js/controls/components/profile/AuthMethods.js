/**
 * @module package/sequry/template/bin/js/controls/components/profile/AuthMethods
 */
define('package/sequry/template/bin/js/controls/components/profile/AuthMethods', [

    'qui/QUI',
    'qui/controls/Control',
    'Mustache',
    'Locale',

    'package/sequry/core/bin/Authentication',

    'text!package/sequry/template/bin/js/controls/components/profile/AuthMethods.Entry.html'

], function (QUI, QUIControl, Mustache, QUILocale,
    Authentication,
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
        createEntry: function (Entry) {
            var self = this;

            var statusText = QUILocale.get(
                lg, 'sequry.usersettings.category.authmethods.status.notregistered'
            );

            if (Entry.registered) {
                statusText = QUILocale.get(
                    lg, 'sequry.usersettings.category.authmethods.status.registered'
                );
            }

            var LiElm = new Element('li', {
                'class'      : 'sequry-table-list-entry',
                html         : Mustache.render(template, {
                    icon  : 'fa fa-key',
                    title : Entry.title,
                    id    : Entry.id,
                    desc  : Entry.description,
                    status: statusText
                }),
                'data-status': Entry.registered // true or false
            });

            // not registered
            if (Entry.registered === false) {
                var SecondaryIconContainer = LiElm.getElement(
                    '.sequry-table-list-entry-icon-secondary'
                );

                SecondaryIconContainer.set('html', '');
                SecondaryIconContainer.addClass('sequry-table-list-entry-icon-secondary-register');

                new Element('span', {
                    'class': 'btn btn-small btn-secondary sequry-table-list-entry-regbutton',
                    html   : QUILocale.get(
                        lg, 'sequry.usersettings.category.authmethods.btn.register'
                    )
                }).inject(SecondaryIconContainer);

                LiElm.setStyle('cursor', 'pointer');
                LiElm.setAttribute('title', QUILocale.get(
                    lg, 'sequry.usersettings.category.authmethods.btn.register'
                ));

                LiElm.addEvent('click', function () {
                    console.log("registrieren!")
                })
            } else {
                // registered - show buttons
                var Container = new Element('div', {
                    'class': 'sequry-table-list-entry-details',
                    html   : '<div class="sequry-table-list-entry-details-inner"></div>'
                }).inject(LiElm);

                var changeText     = QUILocale.get(lg, 'sequry.usersettings.category.authmethods.btn.change'),
                    recoveryText   = QUILocale.get(lg, 'sequry.usersettings.category.authmethods.btn.recovery'),
                    regenerateText = QUILocale.get(lg, 'sequry.usersettings.category.authmethods.btn.regenerate');

                // 3x buttons
                new Element('span', {
                    'class': 'btn btn-secondary btn-small btn-outline sequry-table-list-entry-details-btn',
                    html   : '<span class="fa fa-edit"></span>' + changeText,
                    events : {
                        click: function () {
                            console.log('Zugangsdaten ändern');
                        }
                    }
                }).inject(Container.getElement('.sequry-table-list-entry-details-inner'));

                new Element('span', {
                    'class': 'btn btn-secondary btn-small btn-outline sequry-table-list-entry-details-btn',
                    html   : '<span class="fa fa-question-circle"></span>' + recoveryText,
                    events : {
                        click: function () {
                            console.log('Zugangsdaten vergessen');
                        }
                    }
                }).inject(Container.getElement('.sequry-table-list-entry-details-inner'));

                new Element('span', {
                    'class': 'btn btn-secondary btn-small btn-outline sequry-table-list-entry-details-btn',
                    html   : '<span class="fa fa-retweet"></span>' + regenerateText,
                    events : {
                        click: function () {
                            console.log('Wiederherstellungs-Code neu generieren');
                        }
                    }
                }).inject(Container.getElement('.sequry-table-list-entry-details-inner'));

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
                duration: 150
            });

            Button.setProperty('data-open', true);
            Icon.removeClass('fa-angle-double-down');
            Icon.addClass('fa-angle-double-up');
        }
    });
});
