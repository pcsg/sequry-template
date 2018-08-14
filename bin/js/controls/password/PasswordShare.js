/**
 * @module package/sequry/template/bin/js/controls/password/PasswordShare
 */
define('package/sequry/template/bin/js/controls/password/PasswordShare', [

    'qui/QUI',
    'qui/controls/Control',
    'Mustache',
    'Ajax',
    'Locale',

    'package/sequry/core/bin/Actors',
    'package/sequry/core/bin/Passwords',
    'package/sequry/core/bin/controls/actors/Select',

    'text!package/sequry/template/bin/js/controls/password/PasswordShare.html',
    'css!package/sequry/template/bin/js/controls/password/PasswordShare.css'

], function (
    QUI, QUIControl, Mustache, QUIAjax, QUILocale,
    Actors,
    Passwords,
    ActorSelect,
    template
) {
    "use strict";

    var lg     = 'sequry/template',
        lgCore = 'sequry/core';


    return new Class({

        Extends: QUIControl,
        Type   : 'package/sequry/template/bin/js/controls/password/PasswordShare',

        Binds: [
            '$onInject'
        ],

        options: {
            passwordId: false //passwordId
        },

        initialize: function (options) {
            this.parent(options);

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
            var self = this,
                pwId = this.getAttribute('passwordId');

            this.$Elm = this.getElm();

            Passwords.getShareData(pwId).then(
                function (ShareData) {

                    console.log(ShareData)

                    var description = QUILocale.get(lg,
                        'sequry.panel.share.description', {
                            passwordTitle: ShareData.title,
                            passwordId   : pwId
                        });

                    self.$Elm.set('html', Mustache.render(template, {
                        description: description,
                        ownerUsers : 'Benutzer',
                        ownerGroups: 'Gruppen'
                    }));

                    var ActorUsersElm  = self.$Elm.getElement('.password-share-user-select'),
                        ActorGroupsElm = self.$Elm.getElement('.password-share-group-select');

                    self.$ShareData = ShareData;

                    self.$ActorSelectUsers = new ActorSelect({
                        actorType       : 'users',
                        securityClassIds: [ShareData.securityClassId],
                        showEligibleOnly: true
                    }).inject(ActorUsersElm);

                    self.$ActorSelectGroups = new ActorSelect({
                        actorType       : 'groups',
                        securityClassIds: [ShareData.securityClassId],
                        showEligibleOnly: true
                    }).inject(ActorGroupsElm);

                    self.$insertData();
                    self.fireEvent('loaded');
                }, function () {
                    self.fireEvent('close');
                }
            );


            this.fireEvent('load', [self]);

        },

        /**
         * Insert actors
         */
        $insertData: function () {
            this.$ActorSelectUsers.clear();
            this.$ActorSelectGroups.clear();

            for (var type in this.$ShareData.sharedWith) {
                if (!this.$ShareData.sharedWith.hasOwnProperty(type)) {
                    continue;
                }

                var actors = this.$ShareData.sharedWith[type];

                for (var i = 0, len = actors.length; i < len; i++) {
                    switch (type) {
                        case 'users':
                            this.$addActor(actors[i], 'user');
                            break;

                        case 'groups':
                            this.$addActor(actors[i], 'group');
                            break;
                    }
                }
            }
        },

        /**
         * Adds an actor to an acoording actor box
         *
         * @param {number} id - user or group id
         * @param {string} type - "user" or "group"
         */
        $addActor: function (id, type) {
            switch (type) {
                case 'user':
                    this.$ActorSelectUsers.addItem('u' + id, type);
                    break;

                case 'group':
                    this.$ActorSelectGroups.addItem('g' + id, type);
                    break;
            }
        },
    });
});