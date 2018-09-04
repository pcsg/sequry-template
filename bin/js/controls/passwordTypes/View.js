/**
 * The encrypted part of "Show password" panel.
 *
 * @module package/sequry/template/bin/js/controls/passwordTypes/View
 */
define('package/sequry/template/bin/js/controls/passwordTypes/View', [

    'qui/QUI',
    'qui/controls/Control',
    'Locale',
    'Ajax',

    'package/sequry/template/bin/js/controls/utils/InputButtons'

], function (
    QUI,
    QUIControl,
    QUILocale,
    QUIAjax,
    ButtonParser // controls/utils/InputButtons
) {
    "use strict";

    var lg = 'sequry/core';

    return new Class({

        Extends: QUIControl,
        Type   : 'package/sequry/template/bin/js/controls/passwordTypes/Edit',

        Binds: [
            '$onInject',
            '$loadTemplate'
        ],

        options: {
            type   : false,
            Content: false
        },

        initialize: function (options) {
            this.parent(options);

            this.ButtonParser = new ButtonParser();

            this.addEvents({
                onInject: this.$onInject
            });
        },

        create: function () {
            this.$Elm = this.parent();

            return this.$Elm;
        },

        /**
         * event: on control inject into DOM
         */
        $onInject: function () {
            this.$getTemplate();
        },

        /**
         *
         */
        $getTemplate: function () {
            var self = this;

            this.$loadTemplate().then(function (templateHtml) {
                self.$Elm.set('html', templateHtml);
                self.ButtonParser.parse(self.getElm());
                self.fireEvent('loaded', [self])
            });
        },


        /**
         *
         * @returns {Promise}
         */
        $loadTemplate: function () {
            var self = this;
            return new Promise(function (resolve, reject) {
                QUIAjax.get('package_sequry_template_ajax_passwords_getViewTemplate', resolve, {
                    'package': 'sequry/template',
                    onError  : reject,
                    'type'   : self.getAttribute('type')
                });
            })
        },

        /**
         * Get all passwordtype fields
         */
        $getFields: function () {
            return this.$Elm.getElements('.password-field-value');
        },

        /**
         * Set content to current control
         *
         * @param {Object} Data
         */
        setData: function (Data) {
            var fields = this.$getFields();

            for (var i = 0, len = fields.length; i < len; i++) {
                var FieldElm  = fields[i],
                    tagName   = FieldElm.tagName,
                    fieldName = FieldElm.getProperty('name');

                if (fieldName in Data) {
                    if (tagName === 'P') {
                        FieldElm.set('html', Data[fieldName]);
                        continue;
                    }
                    FieldElm.value = Data[fieldName];
                }
            }
        },

        /**
         * Get content from current control
         *
         * @return {Object}
         */
        getData: function () {
            var fields = this.$getFields();
            var Data = {};

            for (var i = 0, len = fields.length; i < len; i++) {
                var FieldElm = fields[i];
                Data[FieldElm.getProperty('name')] = FieldElm.value;
            }

            return Data;
        }

    });
});