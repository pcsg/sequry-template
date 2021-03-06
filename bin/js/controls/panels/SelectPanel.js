/**
 * Select panel control.
 *
 * @module package/sequry/template/bin/js/controls/panels/SelectPanel
 * @author www.pcsg.de (Michael Danielczok)
 */
define('package/sequry/template/bin/js/controls/panels/SelectPanel', [

    'qui/QUI',
    'qui/controls/Control',
    'Ajax',
    'Locale',

    'package/sequry/template/bin/js/controls/panels/Panel',
    'package/sequry/template/bin/js/controls/actors/SelectTable'

], function (
    QUI,
    QUIControl,
    QUIAjax,
    QUILocale,
    Panel,
    SelectTable
) {
    "use strict";

    var lg = 'sequry/template';
    var lgCore = 'sequry/core';

    return new Class({

        Extends: Panel,
        Type   : 'package/sequry/template/bin/js/controls/panels/SelectPanel',

        Binds: [
            '$onAfterCreate',
            '$onSubmit',
            '$openBegin',
            '$onOpen'
        ],

        options: {
            title            : false, // title depends on actor type (user / group)
            actionButton     : QUILocale.get(lg, 'sequry.panel.select.actionButton'),
            closeButton      : QUILocale.get(lg, 'sequry.panel.button.cancel'),
            info             : '',       // info text that is shown above the table
            securityClassIds : [],    // security class ids the actors have to be eligible for
            multiSelect      : false,
            actorType        : 'all',    // can be "all", "users" or "groups"
            filterActorIds   : [],       // IDs of actors that are filtered from list (entries must have
                                         // prefix "u" (user) or "g" (group)
            showEligibleOnly : false,     // show eligible only or all
            selectedActorType: 'users' // pre-selected actor type
        },

        initialize: function (options) {
            this.parent(options);

            this.$SelectTable = null;

            // panel events
            this.addEvents({
                onAfterCreate: this.$onAfterCreate,
                onOpen       : this.$onOpen,
                onOpenBegin  : this.$openBegin,
                onSubmit     : this.$onSubmit,
                onFinish     : this.$onFinish
            });
        },

        $onAfterCreate: function () {
            this.$Elm.addClass('category-panel');
        },

        /**
         * event: on open
         * integrate password
         */
        $onOpen: function () {
            var self = this,
                title;

            switch (this.getAttribute('actorType')) {
                case 'users':
                    title = QUILocale.get(lgCore, 'controls.actors.selecttablepopup.title.users');
                    break;

                case 'groups':
                    title = QUILocale.get(lgCore, 'controls.actors.selecttablepopup.title.groups');
                    break;

                default:
                    title = QUILocale.get(lgCore, 'controls.actors.selecttablepopup.title.all');
            }

            // title depends on actor type (user / group)
            this.setTitle(title);

            this.$SelectTable = new SelectTable({
                title            : this.getAttribute('title'),
                info             : this.getAttribute('info'),
                securityClassIds : this.getAttribute('securityClassIds'),
                multiSelect      : this.getAttribute('multiSelect'),
                actorType        : this.getAttribute('actorType'),
                selectedActorType: this.getAttribute('selectedActorType'),
                filterActorIds   : this.getAttribute('filterActorIds'),
                showEligibleOnly : this.getAttribute('showEligibleOnly'),
                events           : {
                    onSubmit: this.$onSubmit
                }
            }).inject(this.getContent());


            self.Loader.hide();
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
            this.fireEvent('finish', [
                this.$SelectTable.getSelectedIds(),
                this.$SelectTable.getActorType(),
                this
            ]);
        }
    });
});