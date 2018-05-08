/**
 * Main panel.
 * It creates wrapper template and  inject some basic content like title or buttons
 *
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
            'submit'
        ],

        options: {
            title                  : false,	// {false|string} [optional] title of the window
            actionButton           : false, // {false|string} main action button, e.g. save, OK
            closeButton            : true,  // {false|string} show the close button
            iconHeaderButton       : false, // {false|string} [optional] icon button on the right top corner
            iconHeaderButtonFaClass: '',    // {string} [optional] icon type css class
            backgroundClosable     : true   // {bool} [optional] closes the window on click?
        },

        initialize: function (options) {
            this.parent(options);

            this.panelMenu = null;
            // don't scroll the page while panel is open
            document.body.setStyle('overflow', 'hidden');

            this.Loader = new QUILoader();
            this.Background = new QUIBackground();
        },


        /**
         * Open panel.
         * When animation is finished it returns a javascript promise.
         *
         * @return {Promise}
         */
        open: function () {
            var self = this;

            this.Background.create();
            this.Background.show();

            // should click on background close panel?
            if (this.getAttribute('backgroundClosable')) {
                this.Background.getElm().addEvent('click', this.cancel);
            }

            this.$Elm = new Element('div', {
                'class': 'sidebar-panel',
                'html' : Mustache.render(template)
            });

            this.panelMenu = this.$Elm.getElement('.sidebar-panel-action-buttons');
            this.Loader.inject(this.$Elm);

            this.createCloseButton();
//            this.$Elm.getElement('button').addEvent('click', this.submit);

            // inject node element to body
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
         * Close panel.
         * When animation is finished it returns a javascript promise.
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
                        // return scroll bar of the page
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
         * Set title of the panel.
         *
         * @param title (string)
         */
        setTitle: function (title) {
            this.$Elm.getElement('.sidebar-panel-header-title').set('html', title);
        },

        /**
         * Return the content DOMNode
         *
         * @return {HTMLElement} DIV
         */
        getContent: function () {
            return this.$Elm.getElement('.sidebar-panel-content');
        },

        /**
         * Cancel action and fire cancel event.
         */
        cancel: function () {
            this.fireEvent('cancel', [this]);
            this.close();
        },

        /**
         * Submit form and fire submitevent.
         */
        submit: function () {
            console.log("save");
            this.fireEvent('submit', [this]);
        },

        /**
         * Create a close button
         */
        createCloseButton: function () {
            var self = this;
            new Element('button', {
                'class': 'btn-light panel-closeButton',
                'html' : this.getAttribute('closeButton'),
                events : {
                    click: self.cancel
                }
            }).inject(this.panelMenu);
        },

        /**
         * Create an action button (e.g. save, share, etc.)
         */
        createActionButton: function () {
            new Element('button', {
                'class': 'panel-actionButton',
                'html' : this.getAttribute('actionButton')
            }).inject(this.panelMenu)
        },

        /**
         * Create a button on the top of the panel (header).
         * Example: "edit" to open new panel and edit the password.
         */
        createHeaderButton: function () {
            new Element('button', {
                'class': this.getAttribute('iconHeaderButtonFaClass'),
                'title': this.getAttribute('iconHeaderButton')
            }).inject(this.$Elm.getElement('.sidebar-panel-header'))
        }
    });
});