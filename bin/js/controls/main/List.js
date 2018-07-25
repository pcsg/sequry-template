/**
 * Main list object. It shows passwords in form of a list.
 *
 * @module package/sequry/template/bin/js/controls/main/List
 */
define('package/sequry/template/bin/js/controls/main/List', [

    'qui/QUI',
    'qui/controls/Control',
    'qui/controls/loader/Loader',
    'Mustache',

    'package/sequry/template/bin/js/classes/List',
    'package/sequry/template/bin/js/Password',
    'package/sequry/core/bin/Passwords',
    'package/sequry/template/bin/js/controls/panels/PasswordPanel',
    'package/sequry/template/bin/js/controls/panels/PasswordCreatePanel',

    'text!package/sequry/template/bin/js/controls/main/List.html',
    'text!package/sequry/template/bin/js/controls/main/List.Entry.html',
    'css!package/sequry/template/bin/js/controls/main/List.css'

], function (
    QUI,
    QUIControl,
    QUILoader,
    Mustache,
    ClassesList,
    Password,
    Passwords, // package/sequry/core/bin/Passwords
    PasswordPanel,
    PasswordCreatePanel,
    template,
    ListEntryTemplate
) {
    "use strict";

    return new Class({

        Extends: QUIControl,
        Type   : 'package/sequry/template/bin/js/controls/main/List',

        Binds: [
            '$onInject',
            'open',
            'addPassword',
            'changeFavorite',
            'showFavorite'
        ],

        initialize: function (options) {
            this.parent(options);

            this.addEvents({
                onInject: this.$onInject
            });

            this.Loader = new QUILoader();
            this.ListManager = new ClassesList();
            this.addButton = null;
            this.listContainer = null;

            this.$SearchParams = {
                search           : {},
                categoryId       : false,
                categoryIdPrivate: false,
                filters          : {
                    filters: [],
                    types  : []
                }
            };

            console.log(this.$SearchParams)
        },

        /**
         * event: on inject
         */
        $onInject: function () {

            this.$Elm.set('html', Mustache.render(template, {}));
            this.listContainer = this.$Elm.getElement('.main-list-entries');
            this.addButton = this.$Elm.getElement('.button-add-password');

            // event add new password
            if (this.addButton) {
                this.addButton.addEvents({
                    click: this.addPassword
                });
            }

            window.PasswordList = this;

            this.Loader.inject(this.$Elm);
            this.Loader.show();

            this.$renderEntries();
        },

        $listRefresh: function () {
            this.Loader.show();
            this.listContainer.set('html', '');
            this.$renderEntries();
        },

        /**
         * Render the list HTML with passwords
         *
         * Search params structure:
         *
         * searchParams: {
         *  "sortOn":null,
         *  "sortBy":"ASC",
         *  "perPage":100,
         *  "page":1,
         *  "search":{
         *      "searchterm":""
         *  },
         *  "categoryId":"3",
         *  "categoryIdPrivate":false,
         *  "filters":{
         *      "filters":["favorites","new"],
         *      "types":[]
         *  }
         */
        $renderEntries: function () {
            var self = this;

            var ListParams = {
                sortOn : null,
                sortBy : 'ASC',
                perPage: 100,
                page   : 1
            };

            Passwords.getPasswords(
                Object.merge(ListParams, this.$SearchParams)
            ).then(function (response) {
                var entries = response.data;

                console.log(entries);
                self.Loader.hide();

                entries.each(function (Entry) {
                    self.$renderEntry(Entry);
                })

            });
        },

        /**
         * Render single list element and inject it to the list container
         *
         * @param Entry (it contains password data)
         */
        $renderEntry: function (Entry) {
            var self = this;
            var favIconName = 'fa-star-o';

            // is password favorite?
            if (parseInt(Entry.favorite)) {
                favIconName = 'fa-star'
            }

            var Li = new Element('li', {
                'class'    : 'main-list-entry',
                'data-pwid': Entry.id
            });

            // render html
            Li.set('html', Mustache.render(ListEntryTemplate, {
                'favIconName': favIconName,
                'dataFavo'   : Entry.favorite,
                'title'      : Entry.title,
                'description': Entry.description,
                'dataType'   : Entry.dataType
            }));

            // open event
            Li.addEvent('click', function () {
                self.open(Entry);
            });

            // change favorite
            Li.getElement('.list-favorite .fa').addEvent('click', self.changeFavorite);

            Li.inject(this.listContainer);
        },

        /**
         * Open password according to the password id
         *
         * @param Entry
         */
        open: function (Entry) {
            new PasswordPanel({
                id: Entry.id
            }).open();
        },

        /**
         * Open panel to create new password
         */
        addPassword: function () {
            var self = this;
            new PasswordCreatePanel({
                events: {
                    finish: function () {
                        self.$listRefresh();
                    }
                }
            }).open();
        },

        /**
         * Remove / add to favorite
         *
         * @param event
         */
        changeFavorite: function (event) {

            event.stop();
            this.Loader.show();

            var self = this,
                Elm  = event.target,
                favo = parseInt(Elm.getProperty('data-favo')),
                pwId = Elm.getParent('.main-list-entry').getProperty('data-pwid');

            this.ListManager.setFavoriteStatus(pwId, !favo).then(function (newStatus) {
                self.Loader.hide();

                newStatus = newStatus ? 1 : 0;
                Elm.setProperty('data-favo', newStatus);

                if (newStatus == true) {
                    Elm.removeClass('fa-star-o');
                    Elm.addClass('fa-star');
                    return;
                }

                Elm.removeClass('fa-star');
                Elm.addClass('fa-star-o');
            });
        },

        showFavorite: function () {
            console.log(this.$SearchParams)
            this.$SearchParams.filters.filters = ['favorites'];
            this.$listRefresh();
        }
    });
});