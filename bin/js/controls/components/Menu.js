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

        options: {
            filters: {
                'all': {
                    label: 'Alle Passwörter',
                    icon: 'fa fa-lock',
                    func: function() {
                        window.PasswordList.showAll();
                    }
                },
                'favorites': {
                    label: 'Favoriten',
                    icon: 'fa fa-star-o',
                    func: function() {
                        window.PasswordList.showFavorite();
                    }
                },
                'owned': {
                    label: 'Eigene',
                    icon: 'fa fa-user-o',
                    func: function() {
                        console.log("kurwa");
                    }
                },
                'mostUsed': {
                    label: 'Meistgenutzte',
                    icon: 'fa fa-bookmark-o',
                    func: function() {
                        console.log("kurwa");
                    }
                },
                'new': {
                    label: 'Neueste',
                    icon: 'fa fa-clock-o',
                    func: function() {
                        console.log("kurwa");
                    }
                }
            },
            types: {
                'website': {
                    label: 'Neueste',
                    icon: 'fa ',
                    func: function() {

                    }
                },
                'secretkey': {
                    label: 'Neueste',
                    icon: 'fa ',
                    func: function() {

                    }
                },
                'ftp': {
                    label: 'Neueste',
                    icon: 'fa ',
                    func: function() {

                    }
                },
                'apikey': {
                    label: 'Neueste',
                    icon: 'fa ',
                    func: function() {

                    }
                },
                'text': {
                    label: 'Neueste',
                    icon: 'fa ',
                    func: function() {

                    }
                }
            }
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
        },

        $buildFilters: function () {
            var self = this,
                Filters = this.getAttribute('filters');

            Object.each(Filters, function(Entry) {

              self.createEntry(Entry.label, Entry.icon, Entry.func)
            })
        },

        /**
         * Entry structure:
         *
         * {
         *   icon: 'fa fa-icon',
         *   label: 'Label',
         *   func: function() {}
         * }
         *
         * @param entry
         * @param func
         */
        createEntry: function (label, icon, func) {
            var iconHTML = '<span class="navigation-entry-icon ' + icon + '"></span>',
                labelHTML = '<span class="navigation-entry-text">' + label + '</span>';

            var listEntry = new Element('li', {
                'class': 'navigation-entry'
            });

            new Element('a', {
                html: iconHTML + labelHTML,
                events: {
                    click: function() {
                        console.log(label);
                        func();
                    }
                }
            }).inject(listEntry);

            listEntry.inject(this.FilterContainer);

        }


    });
});