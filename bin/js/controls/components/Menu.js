/**
 * @module package/sequry/template/bin/js/controls/components/Menu
 */
define('package/sequry/template/bin/js/controls/components/Menu', [

    'qui/QUI',
    'qui/controls/Control',
    'Mustache',

    'text!package/sequry/template/bin/js/controls/components/Menu.html',
    'css!package/sequry/template/bin/js/controls/components/Menu.css'

], function (QUI, QUIControl, Mustache, Template) {
    "use strict";

    return new Class({

        Extends: QUIControl,
        Type   : 'package/sequry/template/bin/js/controls/components/Menu',

        Binds: [
            '$onInject',
            '$buildFilters',
            'createEntry'
        ],

        initialize: function (options) {
            this.parent(options);

            this.FilterContainer = null;
            this.TypesContainer = null;
            this.TagsContainer = null;

            // available filters
            this.$filters = {
                'all': {
                    label: 'Alle Passwörter',
                    icon: 'fa fa-lock'
                },
                'favorites': {
                    label: 'Favoriten',
                    icon: 'fa fa-star-o'
                },
                'owned': {
                    label: 'Eigene',
                    icon: 'fa fa-user-o'
                },
                'mostUsed': {
                    label: 'Meistgenutzte',
                    icon: 'fa fa-bookmark-o'
                },
                'new': {
                    label: 'Neueste',
                    icon: 'fa fa-clock-o'
                }
            };

            this.$types = [
                'website',
                'secretkey',
                'ftp',
                'apikey',
                'text'
            ];

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

            // favorite
            /*this.Favorite = this.$Elm.getElement('#favorite');

            this.Favorite.addEvent('click', function () {
                window.PasswordList.showFavorite();
            })*/
        },

        $buildFilters: function () {
            var self = this;
            Object.each(this.$filters, function(key) {
              self.createEntry(key)
            })
        },

        createEntry: function (entry) {
            var icon = '<span class="navigation-entry-icon ' + entry.icon + '"></span>',
                label = '<span class="navigation-entry-text">' + entry.label + '</span>';

            var listEntry = new Element('li', {
                'class': 'navigation-entry aaaaaaaa'
            });

            new Element('a', {
                html: icon + label,
                events: {
                    click: function() {
                        console.log(entry.label);
                    }
                }
            }).inject(listEntry);

            listEntry.inject(this.FilterContainer);

        }


    });
});