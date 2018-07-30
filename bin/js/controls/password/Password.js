/**
 * @module package/sequry/template/bin/js/controls/password/Password
 */
define('package/sequry/template/bin/js/controls/password/Password', [

    'qui/QUI',
    'qui/controls/Control',
    'Mustache',
    'Locale',
    'Ajax',

    'package/sequry/template/bin/js/Password',
    'package/sequry/template/bin/js/controls/panels/PasswordPanel',
    'package/sequry/template/bin/js/controls/passwordTypes/View',
    'package/sequry/core/bin/controls/categories/public/Select',
    'package/sequry/core/bin/controls/categories/private/Select',
    'package/sequry/core/bin/Categories',
    'package/sequry/template/bin/js/controls/utils/InputButtons',

    'text!package/sequry/template/bin/js/controls/password/Password.html',
    'css!package/sequry/template/bin/js/controls/password/Password.css'
], function (
    QUI,
    QUIControl,
    Mustache,
    QUILocale,
    QUIAjax,
    PasswordHandler,
    PasswordPanel, // controls/panels/PasswordPanel
    PWTypeView, // controls/passwordTypes/View
    CategorySelect, // /core/bin/controls/categories/public/Select
    CategorySelectPrivate, // /core/bin/controls/categories/private/Select
    Categories, // /core/bin/Categories
    InputButtons, // controls/utils/InputButtons
    template
) {
    "use strict";

    var lg = 'sequry/template';

    return new Class({

        Extends: QUIControl,
        Type   : 'package/sequry/template/bin/js/controls/password/Password',

        Binds: [
            '$onInject',
            'share',
            '$setPrivateCategories'
        ],

        options: {
            id          : false,
            passwordData: false
        },

        initialize: function (options) {
            this.parent(options);

            this.$Elm = null;

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
            var self       = this,
                passwordId = this.getAttribute('id');

            this.$Elm = this.getElm();

            PasswordHandler.getDataView(passwordId).then(function (ViewData) {
                if (!ViewData) {
                    return;
                }

                self.$Elm.set('html', Mustache.render(template, {
                    'description'      : ViewData.description,
                    'extraTitle'       : QUILocale.get(lg, 'sequry.panel.template.extra.title'),
                    'categories'       : QUILocale.get(lg, 'sequry.panel.template.categories.title'),
                    'categoriesPrivate': QUILocale.get(lg, 'sequry.panel.template.categories.private.title')
                }));

                var payloadContainer = self.$Elm.getElement('.show-password-data'),
                    PayloadData      = ViewData.payload;

                // encrypted part from password (user, pass, note, etc.)
                new PWTypeView({
                    type  : ViewData.dataType,
                    events: {
                        onLoaded: function (PW) {
                            PW.setData(PayloadData)
                        }
                    }
                }).inject(payloadContainer);


                /**
                 * category handling
                 */
                // private categories
                var CategoryPrivateElm = self.$Elm.getElement(
                    '.password-category-private'
                );

                var CategoryPrivate = new CategorySelectPrivate({
                    events: {
                        onChange: self.$setPrivateCategories
                    }
                }).inject(CategoryPrivateElm);

                var catIdsPrivate = ViewData.categoryIdsPrivate;

                if (catIdsPrivate) {
                    CategoryPrivate.setValue(catIdsPrivate);
                }

                // public categories
                var CategoriesPublicElm = self.$Elm.getElement(
                    '.password-category-public'
                );

                var Categories = new CategorySelect({
//                    editMode: self.getAttribute('editPublicCategories')
                    editMode: false
                }).inject(CategoriesPublicElm);

                var catIdsPublic = ViewData.categoryIds;

                if (catIdsPublic) {
                    Categories.setValue(catIdsPublic);
                }


                self.setAttribute('passwordData', ViewData);
                self.fireEvent('load', [self]);

            }, function () {
                // Close password panel if auth popup will be closed by user
                self.fireEvent('close', [self]);
            });
        },

        /**
         * Set private password categories
         *
         * @return {Promise}
         */
        $setPrivateCategories: function (categoryIds) {
            var self = this;

            return new Promise(function (resolve, reject) {
                Categories.setPrivatePasswordCategories(
                    self.getAttribute('id'),
                    categoryIds
                ).then(function () {
                    resolve();
                }, reject);
            });
        },


        /**
         * Return the title of the password
         *
         * @returns {string}
         */
        getTitle: function () {
            var data = this.getAttribute('passwordData');

            if (!data) {
                return '';
            }

            if (typeof data.title === 'undefined') {
                return '';
            }

            return data.title;
        },


        /**
         * Return the typeof the password
         *
         * @returns {string|boolean} - translated name of the password type
         */
        getType: function () {
            var data = this.getAttribute('passwordData');

            if (!data) {
                return false;
            }

            if (typeof data.dataType === 'undefined') {
                return false;
            }

            return PasswordHandler.getTypeTranslations(data.dataType.toLowerCase());
        },

        share: function () {
            console.log("password/Password.js --> Jetzt wird geshared!");
//            PasswordHandler.save(this.getAttribute('id'), passwordData);
        },

        edit: function () {
            console.log("password/Password.js --> Password bearbeiten");
            var self = this;

            require(
                ['package/sequry/template/bin/js/controls/panels/PasswordPanel'],
                function (PP) {
                    new PP({
                        id: self.getAttribute('data').id
                    }).open();
                }
            )
        }

    });
});