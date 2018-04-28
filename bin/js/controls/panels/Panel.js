/**
 * @module package/sequry/template/bin/js/controls/panels/Panel
 */
define('package/sequry/template/bin/js/controls/panels/Panel', [

    'qui/QUI',
    'qui/controls/Control',
    'qui/controls/loader/Loader',
    'qui/controls/utils/Background',
    'Mustache',

    'text!package/sequry/template/bin/js/controls/panels/Panel.html',
    'css!package/sequry/template/bin/js/controls/panels/Panel.css'

], function (
    QUI,
    QUIControl,
    QUILoader,
    QUIBackground,
    Mustache,
    template
) {
    "use strict";

    return new Class({

        Extends: QUIControl,
        Type   : 'package/sequry/template/bin/js/controls/panels/Panel',

        Binds: [
            '$onInject',
            'open',
            'cancel',
            '$close',
            'changeFavorite',
            'submit',
            'createButtons'
        ],

        options: {
            title                  : false,	// {false|string} [optional] title of the window
            actionButton           : false, // main action, e.g. save, OK
            actionButtonText       : '',
            closeButton            : true, // {bool} show the close button
            closeButtonText        : 'Abbrechen',
            iconHeaderButton       : false, // [optional] icon button on the right top corner
            iconHeaderButtonFaClass: '', // [optional] icon type css class
            iconHeaderButtonText   : '', // [optional] title attribute
            backgroundClosable     : true // {bool} [optional] closes the window on click? standard = true
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
                'html' : Mustache.render(template)
            });

            this.createButtons();

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

        createButtons: function () {

            if (this.getAttribute('iconHeaderButton')) {
                new Element('button', {
                    'class': this.getAttribute('iconHeaderButtonFaClass'),
                    'title': this.getAttribute('iconHeaderButtonText')
                }).inject(this.$Elm.getElement('.sidebar-panel-header'))
            }


            var container = this.$Elm.getElement('.sidebar-panel-action-buttons');

            if (this.getAttribute('actionButton')) {
                new Element('button', {
                    'class': 'panel-actionButton',
                    'html' : this.getAttribute('actionButtonText')
                }).inject(container)
            }

            if (this.getAttribute('closeButton')) {
                new Element('button', {
                    'class': 'btn-light panel-closeButton',
                    'html' : this.getAttribute('closeButtonText')
                }).inject(container)
            }

        },

        /**
         *
         */
        cancel: function () {
            this.fireEvent('cancel', [this]);
            this.close();
        },

        submit: function () {
            this.fireEvent('submit', [this]);
        },

        setTitle: function (title) {
            this.$Elm.getElement('.sidebar-panel-header-title').set('html', title);
        },

        /**
         *
         */
        setContent: function (content) {
            this.$Elm.getElement('.sidebar-panel-content').set('html', content)
        },

        getContent: function () {
            return this.$Elm.getElement('.sidebar-panel-content');
        }

        /*$close: function () {
            console.error('deprecated');
            return this.close();
        },

        $open: function () {
            console.error('deprecated');
            return this.open();
        }*/
    });
});