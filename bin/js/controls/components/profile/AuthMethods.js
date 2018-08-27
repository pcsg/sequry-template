/**
 * @module package/sequry/template/bin/js/controls/components/profile/AuthMethods
 */
define('package/sequry/template/bin/js/controls/components/profile/AuthMethods', [

    'qui/QUI',
    'qui/controls/Control',
    'Mustache',

    'package/sequry/core/bin/Authentication',

    'text!package/sequry/template/bin/js/controls/components/profile/AuthMethods.Entry.html'

], function (QUI, QUIControl, Mustache,
    Authentication,
    template
) {
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

//            require([
//                'package/sequry/core/bin/controls/auth/Panel',
//                'utils/Panels'
//            ], function (AuthPanel, PanelUtils) {
//                var AuthPanelControl = new AuthPanel();
//
//                AuthPanelControl.inject(self.getElm().getElement('.quiqqer-sequry-profile-auth-methods-list'))
//
//                /*PanelUtils.openPanelInTasks(AuthPanelControl).then(function () {
//                    Control.fireEvent('close');
//                });*/
//            });

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

        $listRefresh: function () {
            var self = this;

            return Authentication.getAuthPlugins().then(function (authPlugins) {
                console.log(authPlugins)
                for (var i = 0, len = authPlugins.length; i < len; i++) {
                    self.createEntry(authPlugins[i]);
                }
//                self.Loader.hide();
            });
        },

        createEntry: function (Entry) {
            var self = this;

            var statusText = 'nicht registriert';

            if (Entry.registered) {
                statusText = 'registriert';
            }

            var LiElm = new Element('li', {
                'class'      : 'sequry-table-list-entry',
                html         : Mustache.render(template, {
                    icon : 'fa fa-key',
                    title: Entry.title,
                    id: Entry.id,
                    desc: Entry.description,
                    status: statusText
                }),
                'data-status': Entry.registered // true or false
            });

            /* not registered */
            if (Entry.registered === false) {
                var SecondaryIconContainer = LiElm.getElement(
                    '.sequry-table-list-entry-icon-secondary'
                );

                SecondaryIconContainer.set('html', '');
                SecondaryIconContainer.addClass('sequry-table-list-entry-icon-secondary-register');

                new Element('span', {
                    'class' : 'btn btn-small btn-secondary sequry-table-list-entry-regbutton',
                    html: 'Registrieren'
                }).inject(SecondaryIconContainer);


                LiElm.setStyle('cursor', 'pointer');
                LiElm.addEvent('click', function() {
                    console.log("registrieren!")
                })
            }

            LiElm.inject(this.$ListElm);
        }
    });
});
