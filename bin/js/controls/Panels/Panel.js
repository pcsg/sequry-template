/**
 * @module package/sequry/template/bin/js/controls/Panels/Panel
 */
define('package/sequry/template/bin/js/controls/Panels/Panel', [

    'qui/QUI',
    'qui/controls/Control',
    'qui/controls/loader/Loader',
    'qui/controls/utils/Background',
    'Mustache',

    'text!package/sequry/template/bin/js/controls/Panels/Panel.html',
    'css!package/sequry/template/bin/js/controls/Panels/Panel.css'

], function (
    QUI,
    QUIControl,
    QUILoader,
    QUIBackground,
    Mustache,
    Template
) {
    "use strict";

    return new Class({

        Extends: QUIControl,
        Type   : 'package/sequry/template/bin/js/controls/Panels/Panel',

        Binds: [
            '$onInject',
            'open',
            'cancel',
            '$close',
            'changeFavorite',
            'submit'
        ],

        options: {
            title             : false,	// {false|string} [optional] title of the window
            actionButton      : false, // main action, e.g. save, OK
            actionButtonText  : 'Button',
            iconButton        : false, // [optional] icon button on the right top corner
            iconButtonText    : "Bearbeiten", // [optional] title attribute
            closeButton       : true, // {bool} show the close button
            closeButtonText   : 'Abbrechen',
            backgroundClosable: true // {bool} [optional] closes the window on click? standard = true
        },

        initialize: function (options) {
            this.parent(options);

            document.body.setStyle('overflow', 'hidden');

            this.Loader = new QUILoader();
            this.Background = new QUIBackground();
        },


        /**
         * todo @michael function description
         */
        open: function () {
            var self = this;

            this.Background.create();
            this.Background.show();

            if (this.getAttribute('backgroundClosable')) {
                this.Background.getElm().addEvent('click', this.cancel);
            }

            this.$Elm = new Element('div', {
                'class': 'sidebar-panel',
                'html' : Mustache.render(Template)
            });

            this.Loader.inject(this.$Elm);

            this.$Elm.getElement('button').addEvent('click', this.submit);

            document.body.appendChild(this.$Elm);

            this.fireEvent('openBegin', [this]);

            return new Promise(function (resolve) {
                moofx(self.$Elm).animate({
                    right: 0
                }, {
                    callback: function () {
                        self.fireEvent('open', [self]);
                        resolve();
                    }
                });
            });
        },

        /**
         *
         */
        onOpenComplete: function () {
            this.Loader.hide();
            console.log("onOpenComplete!")
        },

        /**
         * todo @michael function description
         *
         * @return {Promise}
         */
        close: function () {
            var self = this;

            self.fireEvent('closeBegin', [self]);

            return new Promise(function (resolve) {
                moofx(self.$Elm).animate({
                    right: '-100%'
                }, {
                    callback: function () {
                        document.body.setStyle('overflow', '');

                        self.Background.destroy();
                        self.$Elm.destroy();
                        self.$Elm = null;

                        self.fireEvent('close', [self]);

                        resolve(self);
                    }
                });
            });
        },

        /**
         *
         */
        cancel: function () {
            this.fireEvent('cancel', [this]);
            this.$close();
        },

        submit: function () {
            this.fireEvent('submit', [this]);
        },

        getTitle: function () {

        },

        setTitle: function (title) {
            this.$Elm.getElement('.sidebar-panel-header-title').set('html', title);
        },

        /**
         *
         */
        setContent: function (content) {
            this.$Elm.getElement('.sidebar-panel-inner').set('html', content)
        },

        getContent: function () {
            return this.$Elm.getElement('.sidebar-panel-inner');
        },

        $close: function () {
            console.error('deprecated');
            return this.close();
        },

        $open: function () {
            console.error('deprecated');
            return this.open();
        }
    });
});