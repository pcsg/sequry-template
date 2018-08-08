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
            'edit',
            'addPassword',
            'changeFavorite',
            'showAll',
            'showFavorite'
        ],

        initialize: function (options) {
            this.parent(options);


            this.addEvents({
                onInject: this.$onInject
            });

            this.initSearchParams();

            this.Loader = new QUILoader();
            this.ListManager = new ClassesList();
            this.addButton = null;
            this.listContainer = null;
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

        /**
         * Refresh list
         */
        $listRefresh: function () {
            this.Loader.show();
            console.log(this.$SearchParams)
            this.listContainer.set('html', '');
            this.$renderEntries();
        },

        /**
         * Render the list HTML with passwords
         *
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
                'class'    : 'main-list-entry password-entry',
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


            // action buttons
            var actionContainer = Li.getElement('.list-action');

            var BtnEdit = new Element('span', {
                'class'   : 'fa fa-pencil list-action-edit',
                attributes: {
                    'data-super': 'test'
                }/*,
                events: {
                    click: function(event) {
                        self.edit(event);
                    }
                }*/
            });


            if (Entry.isOwner) {
                BtnEdit.addEvent('click', this.edit)
            } else {
                BtnEdit.addEvent('click', function (event) {
                    event.stop();
                });
                BtnEdit.addClass('list-action-edit-inactive');
            }

            BtnEdit.inject(actionContainer);

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
                id     : Entry.id,
                isOwner: Entry.isOwner
            }).open();
        },

        edit: function (event) {
            event.stop();
            var self = this;
            var Target = event.target,
                pwId   = Target.getParent('.password-entry').getAttribute('data-pwid');

            new PasswordCreatePanel({
                passwordId: pwId,
                mode      : 'edit',
                events    : {
                    finish: function () {
                        self.$listRefresh();
                    }
                }
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

        /**
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
        initSearchParams: function () {
            this.$SearchParams = {
                search           : {},
                categoryId       : false,
                categoryIdPrivate: false,
                filters          : {
                    filters: [],
                    types  : []
                }
            };
        },

        /**
         * Show all passwords.
         * (initialise search params)
         */
        showAll: function () {
            this.initSearchParams();
            this.$listRefresh();
        },

        setFilters: function(type, name) {
            this.$SearchParams.filters[type] = name ? name.split() : false;
            this.$listRefresh();
        },

        setCategoryParam: function (catId) {
            this.$SearchParams.categoryId = catId ? catId.toString() : false;
        },

        setCategoryPrivateParam: function (catId) {
            this.$SearchParams.categoryIdPrivate = catId.toString();
        },

        setSearchTerm: function(term) {
            this.$SearchParams.search.searchterm = term.trim();
        }
    });
});