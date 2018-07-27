/**
 * @module package/sequry/template/bin/js/controls/components/Menu
 */
define('package/sequry/template/bin/js/controls/components/Menu', [

    'qui/QUI',
    'qui/controls/Control',
    'Locale',
    'Mustache',

    'package/sequry/core/bin/classes/Passwords',

    'text!package/sequry/template/bin/js/controls/components/Menu.html',
    'css!package/sequry/template/bin/js/controls/components/Menu.css'

], function (QUI, QUIControl, QUILocale, Mustache, PasswordHandler, Template) {
    "use strict";

    var lg = 'sequry/template';

    return new Class({

        Extends: QUIControl,
        Type   : 'package/sequry/template/bin/js/controls/components/Menu',

        Binds: [
            '$onInject',
            '$buildFilters',
            'createEntry',
            'toggleBtnStatus'
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

            this.FilterContainer = this.$Elm.getElement('.sequry-filter .navigation');
            this.TypesContainer = this.$Elm.getElement('.sequry-passwordType .navigation');
            this.TagsContainer = this.$Elm.getElement('.sequry-tags .navigation');

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
                    func = function() {
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