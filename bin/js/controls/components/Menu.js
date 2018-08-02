/**
 * @module package/sequry/template/bin/js/controls/components/Menu
 */
define('package/sequry/template/bin/js/controls/components/Menu', [

    'qui/QUI',
    'qui/controls/Control',
    'qui/controls/windows/Confirm',
    'qui/controls/utils/Background',
    'Locale',
    'Mustache',

    'package/sequry/core/bin/classes/Passwords',
    'package/sequry/core/bin/controls/categories/public/Select',
    'package/sequry/core/bin/controls/categories/private/Select',

    'text!package/sequry/template/bin/js/controls/components/Menu.html',
    'css!package/sequry/template/bin/js/controls/components/Menu.css'

], function (QUI, QUIControl, QUIConfirm, QUIBackground, QUILocale, Mustache,
    PasswordHandler,
    CategorySelect,
    CategorySelectPrivate,
    Template
) {
    "use strict";

    var lg = 'sequry/template';

    return new Class({

        Extends: QUIControl,
        Type   : 'package/sequry/template/bin/js/controls/components/Menu',

        Binds: [
            '$onInject',
            '$buildFilters',
            'createEntry',
            'toggleBtnStatus',
            '$openCategoryDialog'
        ],

        options: {
            // available filters
            filters: [
                {
                    name : 'all',
                    title: QUILocale.get(lg, 'sequry.menu.filters.all'),
                    icon : 'fa fa-lock'
                },
                {
                    name : 'favorites',
                    title: QUILocale.get(lg, 'sequry.menu.filters.favorite'),
                    icon : 'fa fa-star-o'
                },
                {
                    name : 'owned',
                    title: QUILocale.get(lg, 'sequry.menu.filters.owned'),
                    icon : 'fa fa-user-o'
                },
                {
                    name : 'mostUsed',
                    title: QUILocale.get(lg, 'sequry.menu.filters.mostUsed'),
                    icon : 'fa fa-bookmark-o'
                },
                {
                    name : 'new',
                    title: QUILocale.get(lg, 'sequry.menu.filters.new'),
                    icon : 'fa fa-clock-o'
                }
            ]
        },

        initialize: function (options) {
            this.parent(options);

            this.FilterContainer = null;
            this.TypesContainer = null;
            this.TagsContainer = null;

            this.addEvents({
                onInject: this.$onInject
            });
        },

        /**
         * event: on inject
         */
        $onInject: function () {
            this.$Elm.set('html', Mustache.render(Template, {}));

            var self = this,
                Tags = this.$Elm.getElement('.sequry-tags');

            this.FilterContainer = this.$Elm.getElement('.sequry-filter .navigation');
            this.TypesContainer = this.$Elm.getElement('.sequry-passwordType .navigation');
            this.TagsContainer = Tags.getElement('.navigation');

            // Tags / category menu button


            var TagBtn = new Element('span', {
                'class': 'fa fa-plus header-button-icon',
                events : {
                    click: self.$openCategoryDialog
                }
            });

            TagBtn.inject(Tags.getElement('.header-button'));

            this.$buildFilters();
            this.$buildTypes();


        },

        /**
         * Build filter buttons
         * (favorites, owned, most used, etc.)
         */
        $buildFilters: function () {
            var self    = this,
                Filters = this.getAttribute('filters');

            Filters.each(function (Entry) {
                var func = self.filterFilter;

                // Button: reset all filters
                if (Entry.name === 'all') {
                    func = function () {
                        window.PasswordList.showAll();
                    };
                }

                var Button = self.createEntry(Entry, func);
                Button.inject(self.FilterContainer)
            })
        },

        /**
         * Build types buttons
         * (website, api key, ftp, etc.)
         */
        $buildTypes: function () {
            var Passwords = new PasswordHandler,
                self      = this;

            Passwords.getTypes().then(function (types) {
                types.forEach(function (Entry) {

                    //todo @michael wenn peat icons in password types implementiert,
                    // wird das hier nicht mehr benötigt
                    switch (Entry.name) {
                        case 'Website':
                            Entry.icon = 'fa fa-globe';
                            break;
                        case 'ApiKey':
                            Entry.icon = 'fa fa-key';
                            break;
                        case 'Ftp':
                            Entry.icon = 'fa fa-server';
                            break;
                        case 'SecretKey':
                            Entry.icon = 'fa fa-laptop';
                            break;
                        case 'Text':
                            Entry.icon = 'fa fa-file-text-o';
                            break;
                        default:
                            Entry.icon = 'fa fa-file-text-o';
                            break;
                    }

                    var Button = self.createEntry(Entry, self.filterTypes);
                    Button.inject(self.TypesContainer);

                });
            });
        },

        $openCategoryDialog: function () {
            var publicCatIds = [], privateCatIds = [];
            var self = this;
            var refreshList = false;
            var lgCore = 'sequry/core';

            var FuncSetPublicCategories = function (AuthData) {
                Popup.Loader.show();

                Categories.setPublicPasswordsCategories(
                    pwIds,
                    publicCatIds,
                    AuthData
                ).then(function () {
                    Popup.Loader.hide();
                    Popup.close();
                });
            };

            var FuncSetPrivateCategories = function () {
                Popup.Loader.show();

                Categories.setPrivatePasswordsCategories(pwIds, privateCatIds).then(function () {
                    Popup.Loader.hide();
                    Popup.close();
                });
            };

            var FuncSubmit = function () {
                if (!privateCatIds.length && !publicCatIds.length) {
                    Popup.close();
                    return;
                }

                if (privateCatIds) {
                    // todo @michael Umschreiben, wenn API mehrere Kategorien unterstützt.
                    window.PasswordList.addCategorytoParam(privateCatIds[0]);

                    console.log(privateCatIds)
                    privateCatIds.each(function (catId) {
console.log(catId)
                        var Entry = {
                            icon : 'fa fa-tag',
                            title: catId
                        };

                        var func = function() {
                            console.log("wow !")
                        }

                        var Tag = self.createEntry(Entry, func);
                        Tag.inject(self.TagsContainer);
                    });

                    refreshList = true;
                }

                if (publicCatIds) {
                    // todo @michael Umschreiben, wenn API mehrere Kategorien unterstützt.
                    window.PasswordList.addCategorytoParam(publicCatIds[0]);
                    refreshList = true;
                }
            };

            // open popup
            var Popup = new QUIConfirm({
                'class'    : 'pcsg-gpm-passwords-panel-categories sequry-customPopup',
                'maxHeight': 300,
                maxWidth   : 600,
                'autoclose': true,

                'title'   : QUILocale.get(lgCore, 'controls.gpm.passwords.panel.categories.title'),
                'texticon': 'fa fa-book',
                'icon'    : 'fa fa-book',

                events: {
                    onOpen  : function () {
                        var Content = Popup.getContent();

                        Content.set(
                            'html',
                            '<div class="pcsg-gpm-passwords-panel-categories-info">' +
                            QUILocale.get(lgCore, 'controls.gpm.passwords.panel.categories.info') +
                            '</div>' +
                            '<div class="pcsg-gpm-passwords-panel-categories-public">' +
                            '<span><b>' + QUILocale.get(lgCore, 'controls.categories.panel.public.title') + '</b></span>' +
                            '</div>' +
                            '<div class="pcsg-gpm-passwords-panel-categories-private">' +
                            '<span><b>' + QUILocale.get(lgCore, 'controls.categories.panel.private.title') + '</b></span>' +
                            '</div>'
                        );

                        new CategorySelect({
                            events: {
                                onChange: function (catIds) {
                                    publicCatIds = catIds;
                                }
                            }
                        }).inject(
                            Content.getElement(
                                '.pcsg-gpm-passwords-panel-categories-public'
                            )
                        );

                        new CategorySelectPrivate({
                            events: {
                                onChange: function (catIds) {
                                    privateCatIds = catIds;
                                }
                            }
                        }).inject(
                            Content.getElement(
                                '.pcsg-gpm-passwords-panel-categories-private'
                            )
                        );

                    },
                    onSubmit: FuncSubmit,
                    onClose : function () {
                        console.log("on close popup!")
                        if (refreshList) {
                            window.PasswordList.$listRefresh();
                        }
                    }
                }
            });

            Popup.open();

        },

        /**
         * Create list entry.
         *
         * <li class="navigation-entry">
         *     <a>
         *         <span class="navigation-entry-icon fa fa-star-o"></span>
         *         <span class="navigation-entry-text">Favorite</span>
         *     </a>
         * </li>
         */
        createEntry: function (Entry, func) {
            var iconHTML  = '<span class="navigation-entry-icon ' + Entry.icon + '"></span>',
                labelHTML = '<span class="navigation-entry-text">' + Entry.title + '</span>',
                self      = this;

            var ListElm = new Element('li', {
                'class': 'navigation-entry'
            });

            var Button = new Element('a', {
                'class': 'menu-button',
                html   : iconHTML + labelHTML,
                events : {
                    click: function (Elm) {
                        self.toggleBtnStatus(Elm, func);
                    }
                }
            }).inject(ListElm);

            Button.setAttribute('data-multiple-select', 'false');
            Button.setAttribute('data-name', Entry.name);

            return ListElm;
        },

        /**
         * Toggle button status
         * Set / remove CSS class and fire function
         *
         * @param Elm
         * @param func
         */
        toggleBtnStatus: function (Elm, func) {
            var Target = Elm.target;

            if (Target.tagName != 'A') {
                Target = Target.getParent();
            }

            if (Target.hasClass('active')) {
                this.removeActiveStatus(Target);
                window.PasswordList.showAll();
                return;
            }

            var Buttons = this.$Elm.getElements('.menu-button');

            Array.each(Buttons, function (Elm) {
                this.removeActiveStatus(Elm);
            }.bind(this));

            this.setActiveStatus(Target);

            func(Target);
        },

        /**
         * Filter the filters (favorites, owned, most used, etc.)
         * by button name
         *
         * @param Target
         */
        filterFilter: function (Target) {
            var type = Target.getAttribute('data-name');
            window.PasswordList.toggleFilter(type);
        },

        /**
         * Filter the password types (website, api key, ftp, etc.)
         * by button name
         *
         * @param Target
         */
        filterTypes: function (Target) {
            var type = Target.getAttribute('data-name');
            window.PasswordList.toggleType(type);
        },

        /**
         * Set css class and change data-status flag (on)
         *
         * @param Btn
         */
        setActiveStatus: function (Btn) {
            Btn.addClass('active');
            Btn.setAttribute('data-status', 'on');
        },

        /**
         * Set remove class and change data-status flag (off)
         *
         * @param Btn
         */
        removeActiveStatus: function (Btn) {
            Btn.removeClass('active');
            Btn.setAttribute('data-status', 'off');
        }
    });
});