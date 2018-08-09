/**
 * Panel control to create a new password.
 * It inherits from Panel.js
 *
 * @module package/sequry/template/bin/js/controls/panels/SelectPanel
 * @author www.pcsg.de (Michael Danielczok)
 */
define('package/sequry/template/bin/js/controls/panels/SelectPanel', [

    'qui/QUI',
    'qui/controls/Control',
    'Ajax',
    'Locale',

    'package/sequry/template/bin/js/controls/panels/Panel'

//    'css!package/sequry/template/bin/js/controls/panels/CategoryPanel.css'

], function (
    QUI,
    QUIControl,
    QUIAjax,
    QUILocale,
    Panel
) {
    "use strict";

    var lg = 'sequry/template';

    return new Class({

        Extends: Panel,
        Type   : 'package/sequry/template/bin/js/controls/panels/SelectPanel',

        Binds: [
            '$onSubmit',
            '$openBegin',
            '$onOpen'
        ],

        options: {
            title            : false,
            actionButton     : 'Auswählen',
            closeButton      : QUILocale.get(lg, 'sequry.panel.button.cancel'),
            info             : '',       // info text that is shown above the table
            securityClassIds : [],    // security class ids the actors have to be eligible for
            multiselect      : false,
            actorType        : 'all',    // can be "all", "users" or "groups"
            filterActorIds   : [],       // IDs of actors that are filtered from list (entries must have
                                         // prefix "u" (user) or "g" (group)
            showEligibleOnly : false,     // show eligible only or all
            selectedActorType: 'users' // pre-selected actor type
        },

        initialize: function (options) {
            this.parent(options);
            this.$Elm.addClass('category-panel');

            this.CatPublic = null;
            this.CatPrivate = null;


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
            var self             = this,
                PublicContainer  = null,
                PrivateContainer = null,
                Content          = this.getContent();

            // create user / group selection
            new Element('div', {
                html: "Das ist Select Panel!"
            }).inject(Content);


            self.Loader.hide();

            // action button - ok
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
         *
         * Returns category ids
         *
         * CatIds: {
         *     public: ["1", "8", "15"],
         *     private: ["3", "13",]
         * }
         */
        $onSubmit: function () {
            // gibt ausgewählten user (gruppe) zurück
            var id = 0;

            this.fireEvent('finish', [id]);
        }
    });
});