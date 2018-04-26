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
            'changeFavorite'
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

            if (this.getAttribute('backgroundClosable')) {
                this.Background.getElm().addEvent(
                    'click',
                    this.cancel
                );
            }

            this.Background.create();
            this.Background.show();

            this.$create();

        },

        /**
         * todo @michael function description
         */
        $create: function () {
            this.$Elm = new Element('div', {
                'class': 'sidebar-panel'
            });

            moofx(this.$Elm).animate({
                right: 0
            });

            this.$Elm.set('html', Mustache.render(Template, {
                title: this.getAttribute('title')
            }));

            document.body.appendChild(this.$Elm);
        },

        /**
         * todo @michael function description
         */
        $open: function () {

        },

        /**
         * todo @michael function description
         */
        $close: function () {
            var self = this;

            moofx(this.$Elm).animate({
                right: '-100%'
            }, {
                callback: function () {
                    document.body.setStyle('overflow', '');
                    self.Background.destroy();
                    self.$Elm.destroy();
                    self.$Elm = null;

                    self.fireEvent('close', [self]);
                }
            });
        },

        cancel: function () {
            this.fireEvent('cancel', [this]);
            this.$close();
        }
    });
});