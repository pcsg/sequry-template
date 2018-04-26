/**
 * @module package/sequry/template/bin/js/controls/List
 */
define('package/sequry/template/bin/js/controls/List', [

    'qui/QUI',
    'qui/controls/Control',
    'qui/controls/loader/Loader',
    'Mustache',

    'package/sequry/template/bin/js/classes/List',
    'package/sequry/template/bin/js/controls/Panel',

    'text!package/sequry/template/bin/js/controls/List.html',
    'text!package/sequry/template/bin/js/controls/List.Entry.html',
    'css!package/sequry/template/bin/js/controls/List.css'

], function (
    QUI,
    QUIControl,
    QUILoader,
    Mustache,
    ClassesList,
    SequryPanel,
    Template,
    ListEntryTemplate
) {
    "use strict";

    return new Class({

        Extends: QUIControl,
        Type   : 'package/sequry/template/bin/js/controls/List',

        Binds: [
            '$onInject',
            'open',
            'changeFavorite'
        ],

        initialize: function (options) {
            this.parent(options);


            this.addEvents({
                onInject: this.$onInject
            });

            this.Loader = new QUILoader();
            this.ListManager = new ClassesList();
        },

        /**
         * event: on inject
         */
        $onInject: function () {

            this.$Elm.set('html', Mustache.render(Template, {}));
            this.listContainer = this.$Elm.getElement('.main-list-entries');

            this.Loader.inject(this.$Elm);
            this.Loader.show();
            this.$renderEntries();
        },

        /**
         * todo @michael function description
         */
        $renderEntries: function () {
            var self = this;
            this.ListManager.getData().then(function (Entries) {
                self.Loader.hide();
                Entries.each(function (Entry) {
                    self.$renderEntry(Entry);
                })
            });
        },

        /**
         * todo @michael function description
         *
         * @param Entry
         */
        $renderEntry: function (Entry) {

            var self = this;
            var favIconName = 'fa-star-o';

            // password is in favorite list?
            if (Entry.favorite) {
                favIconName = 'fa-star'
            }

            var Li = new Element('li', {
                'class'    : 'main-list-entry',
                'data-pwid': Entry.id
            });

            Li.set('html', Mustache.render(ListEntryTemplate, {
                'favIconName': favIconName,
                'dataFavo'   : Entry.favorite,
                'title'      : Entry.title,
                'description': Entry.description,
                'dataType'   : Entry.dataType
            }));

            // open
            Li.addEvent('click', this.open);

            // change favorite
            Li.getElement('.list-favorite .fa').addEvent('click', self.changeFavorite);


            Li.inject(this.listContainer);
        },

        /**
         * todo @michael function description
         * @param Elm
         */
        open: function (Elm) {
            console.log("Click auf das ganze Element")

            var Panel = new SequryPanel();

        },

        /**
         * todo @michael function description
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
        }
    });
});