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
    'package/sequry/template/bin/js/controls/panels/CategoryPanel',
    'package/sequry/core/bin/Categories',
    'package/sequry/core/bin/controls/categories/public/Select',
    'package/sequry/core/bin/controls/categories/private/Select',

    'text!package/sequry/template/bin/js/controls/components/Menu.html',
    'css!package/sequry/template/bin/js/controls/components/Menu.css'

], function (QUI, QUIControl, QUIConfirm, QUIBackground, QUILocale, Mustache,
    PasswordHandler,
    CategoryPanel,
    Categories,
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
            this.Categories = null;

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

            this.Categories = {
                'public' : [],
                'private': []
            };

            // Tags / category menu button


            var TagBtn = new Element('span', {
                'class': 'fa fa-plus header-button-icon',
                styles : {
                    marginLeft: 'auto'
                },
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
            var self        = this,
                refreshList = false;

            var funcFinish = function (publicCatIds, privateCatIds) {

                if (!privateCatIds.length && !publicCatIds.length) {
                    return;
                }

                if (privateCatIds) {
                    // todo @michael Umschreiben, wenn API mehrere Kategorien unterstützt.
//                    window.PasswordList.addCategoryPrivateToParam(privateCatIds[0]);

                    Categories.getPrivate(privateCatIds).then(function (CategoriesData) {
                        CategoriesData.each(function (Category) {
                            var Entry = {
                                icon              : 'fa fa-tag',
                                title             : Category.title,
                                'data-category-id': Category.id
                            };

                            var func = function (event) {
                                console.log(this)
                                console.log("wow !")
                            }

                            var Tag = self.createEntry(Entry, func, true);
                            Tag.inject(self.TagsContainer);
                        });
                    });

                    refreshList = true;
                }

                if (publicCatIds) {
                    // todo @michael Umschreiben, wenn API mehrere Kategorien unterstützt.
//                    window.PasswordList.addCategoryToParam(publicCatIds[0]);

                    Categories.getPublic(publicCatIds).then(function (CategoriesData) {
                        CategoriesData.each(function (Category) {
                            var Entry = {
                                icon              : 'fa fa-tag',
                                title             : Category.title,
                                'data-category-id': Category.id
                            };

                            var func = function (event) {
                                console.log(this)
                                console.log("wow !")
                            }

                            var Tag = self.createEntry(Entry, func);
                            Tag.inject(self.TagsContainer);
                        });
                    });

                    refreshList = true;
                }
            };

            var CatPanel = new CategoryPanel({
                direction: 'left',
                width    : 300,
                events   : {
                    onOpen  : function (Panel) {
                        Panel.setTitle(QUILocale.get(lg, 'sequry.panel.category.title'));
                    },
                    onFinish: function (CatIds) {
                        window.PasswordList.addCategoryToParam(CatIds['public']);
                        window.PasswordList.addCategoryPrivateToParam(CatIds['private']);
                        funcFinish(
                            CatIds['public'],
                            CatIds['private']
                        )
                    },
                    onClose : function () {
                        if (refreshList) {
                            /*(function() {
                                window.PasswordList.$listRefresh();
                            }).delay(1000)*/
                            window.PasswordList.$listRefresh();


                        }
                    },
                    onSelectPublic: function(id) {
                        self.setCategory(id, 'public')
                    },
                    onSelectPrivate: function(id) {
                        self.setCategory(id, 'private')
                    }
                }
            });

            CatPanel.open();
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
        createEntry: function (Entry, func, remove) {
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

            if (remove) {
                new Element('span', {
                    'class': 'fa fa-remove navigation-entry-icon-remove'
                }).inject(Button);
            }

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
        },

        setCategory: function(catId, type) {

            if (type === 'public') {
                window.PasswordList.addCategoryToParam(catId);
                window.PasswordList.$listRefresh();
                return;
            }

            window.PasswordList.addCategoryPrivateToParam(catId);
            window.PasswordList.$listRefresh()
        }
    });
});