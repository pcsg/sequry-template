/**
 * @module package/sequry/template/bin/js/controls/passwordTypes/Content
 */
define('package/sequry/template/bin/js/controls/passwordTypes/Content', [

    'qui/QUI',
    'qui/controls/Control',
    'Locale',
    'Ajax',

    'package/sequry/core/bin/controls/passwordtypes/Select',
    'package/sequry/template/bin/js/controls/passwordTypes/Edit'

//    'text!package/sequry/template/bin/js/controls/password/PasswordCreate.html',
//    'css!package/sequry/template/bin/js/controls/password/PasswordCreate.css'

], function (
    QUI,
    QUIControl,
    QUILocale,
    QUIAjax,
    TypeSelect,
    PasswordTypeControl //controls/passwordtypes/Edit
) {
    "use strict";

    var lg = 'sequry/core';

    return new Class({

        Extends: QUIControl,
        Type   : 'package/sequry/template/bin/js/controls/passwordTypes/Content',

        Binds: [
            '$onDestroy',
            '$onInject',
            '$loadContent'
        ],

        options: {
            type: false
        },

        initialize: function (options) {
            this.parent(options);

            this.$CurrentData = {};
            this.PayloadContainer = null; // container with select button and pass data. comes from bin/js/controls/password/PasswordCreate.html
            this.TypeSelectElm = null; // html container for password type select button
            this.$EditContent = null; // html container for password type data (template)
            this.$PasswordTypeControl = null; // Object that brings password types template
            this.passwordType = null;

            this.addEvents({
                onInject : this.$onInject,
                onDestroy: this.$onDestroy
            });
        },

        create: function () {
            this.$Elm = this.parent();

            return this.$Elm;
        },

        $onInject: function () {
            this.PayloadContainer = this.$Elm.getParent();

            this.TypeSelectElm = this.PayloadContainer.getElement('.password-type-select');
            this.$EditContent = this.PayloadContainer.getElement('.password-type-content');

            this.$TypeSelect = new TypeSelect({
                initialValue: this.getAttribute('type'),
                events      : {
                    onChange: this.$loadContent
                }
            }).inject(this.TypeSelectElm);

        },

        /**
         * Load ri
         *
         * @param type
         */
        $loadContent: function (type) {
            var self = this;

            this.$EditContent.set('html', '');
            this.$CurrentData = Object.merge(this.$CurrentData, this.getData());

            // todo Height berechnen und "jump" effekt verhindern
            this.$PasswordTypeControl = new PasswordTypeControl({
                type  : type,
                events: {
                    onLoaded: function () {
                        if (!self.$loaded) {
                            self.fireEvent('loaded');
                            self.$loaded = true;
                        }

                        /*if (Object.getLength(self.$CurrentData)) {
                            self.setData(self.$CurrentData);
                        }*/
                    }
                }
            }).inject(self.$EditContent);

            this.$passwordType = type;
        },

        /**
         * Set content to current control
         *
         * @param {Object} Content
         */
        setData: function (Content) {
            if (!this.$PasswordTypeControl) {
                return;
            }

            this.$PasswordTypeControl.setData(Content);
        },

        /**
         * Get content from current control
         *
         * @return {Object}
         */
        getData: function () {
            if (!this.$PasswordTypeControl) {
                return;
            }

            return this.$PasswordTypeControl.getData();
        },

        /**
         * Return currently selected password type
         *
         * @returns {string}
         */
        getPasswordType: function () {
            return this.$passwordType;
        },

        /**
         * Event: onDestroy
         */
        $onDestroy: function () {
            this.$CurrentData = null;
        }

    });
});