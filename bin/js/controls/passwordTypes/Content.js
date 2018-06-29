/**
 * @module package/sequry/template/bin/js/controls/passwordTypes/Content
 */
define('package/sequry/template/bin/js/controls/passwordTypes/Content', [

    'qui/QUI',
    'qui/controls/Control',
    'qui/controls/loader/Loader',
    'Locale',
    'Ajax',

    'package/sequry/core/bin/controls/passwordtypes/Select',
    'package/sequry/template/bin/js/controls/passwordTypes/Edit'

], function (
    QUI,
    QUIControl,
    QUILoader,
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
            this.$passwordType = null; // website, Ftp, SecretKey, ApiKey, etc.
            this.$PasswordInner = null; // $PasswordTypeControl inner html
            this.$PasswordInnerHeight = 0;

            this.Loader = new QUILoader({
                type: 'fa-gear'
            });

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
            this.Loader.inject(this.$EditContent);

            this.Loader.show();

            this.$CurrentData = Object.merge(this.$CurrentData, this.getData());

            this.$PasswordTypeControl = new PasswordTypeControl({
                type  : type,
                events: {
                    onLoaded: function () {
                        if (!self.$loaded) {
                            self.fireEvent('loaded');
                            self.$loaded = true;
                        }

                        self.$PasswordInnerHeight = self.$PasswordInner.getHeight();

                        // animate $EditContent container (height)
                        self.setEditContentHeight(self.$EditContent).then(function() {
                            self.Loader.hide();
                            self.show(self.$PasswordInner);
                        });

                        if (Object.getLength(self.$CurrentData)) {
                            self.setData(self.$CurrentData);
                        }
                    },
                    onInject: function () {
                        self.$PasswordInner = this.getElm();
                        self.hide(self.$PasswordInner);
                    }
                }
            }).inject(self.$EditContent);

            this.$passwordType = type;
        },

        show: function (Element) {
            return new Promise(function(resolve) {
               moofx(Element).animate({
                   opacity: 1,
                   visibility: 'visible'
               }, {
                   callback: resolve
               });
            });
        },

        hide: function (Element) {
            Element.setStyles({
                opacity: 0,
                visibility: 'hidden'
            });
        },

        setEditContentHeight: function(Element) {
            var self = this;
            return new Promise(function(resolve) {
                moofx(Element).animate({
                    height: self.$PasswordInnerHeight
                }, {
                    callback: resolve
                })
            })
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