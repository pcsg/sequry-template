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
    'Locale',

    'package/sequry/template/bin/js/controls/utils/InputButtons',
    'text!package/sequry/template/bin/js/controls/panels/Panel.html',
    'css!package/sequry/template/bin/js/controls/panels/Panel.css'

], function (
    QUI,
    QUIControl,
    QUILoader,
    QUIBackground,
    Mustache,
    QUILocale,
    ButtonParser,
    template
) {
    "use strict";

    var lg = 'sequry/template';


    return new Class({

        Extends: QUIControl,
        Type   : 'package/sequry/template/bin/js/controls/panels/Panel',

        Binds: [
            '$onInject',
            'open',
            'create',
            'cancel',
            'close',
            'confirmClose',
            'changeFavorite',
            'submit',
            'submitSecondary'
        ],

        options: {
            title                  : false,	// {false|string} [optional] title of the window
            actionButton           : false, // {false|string} main action button, e.g. save, OK
            closeButton            : QUILocale.get(lg, 'sequry.panel.button.close'),  // {false|string} show the close button
            iconHeaderButton       : false, // {false|string} [optional] icon button on the right top corner
            iconHeaderButtonFaClass: '',    // {string} [optional] icon type css class
            backgroundClosable     : true,   // {bool} [optional] closes the window on click?
            confirmClosePopup      : false // {bool} [optional] if true, it prevent accidentally closing the panel
        },

        initialize: function (options) {
            this.parent(options);

            this.panelMenu = null;
            this.Loader = new QUILoader();
            this.Background = new QUIBackground();
            this.ButtonParser = new ButtonParser();

            this.create();
        },

        create: function () {

            // click on background close the panel?
            if (this.getAttribute('backgroundClosable')) {
                this.Background.getElm().addEvent('click', this.cancel);
            }

            this.$Elm = new Element('div', {
                'class': 'sidebar-panel',
                'html' : Mustache.render(template)
            });

            this.panelMenu = this.$Elm.getElement('.sidebar-panel-action-buttons');
            this.Loader.inject(this.$Elm);

            // inject node element to body
            document.body.appendChild(this.$Elm);
        },


        /**
         * Open panel.
         * When animation is finished return javascript promise.
         *
         * @return {Promise}
         */
        open: function () {
            this.setPageFix();
            var self = this;

            this.Background.create();
            this.Background.show();

            this.fireEvent('openBegin', [this]);

            return new Promise(function (resolve) {
                moofx(self.$Elm).animate({
                    right: 0
                }, {
                    equation: 'ease-in-out',
                    callback: function () {
                        self.fireEvent('open', [self]);
                        resolve();
                    }
                });
            });
        },

        /**
         * Close panel.
         * When animation is finished return javascript promise.
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
                    equation: 'ease-in-out',
                    callback: function () {
                        // return scroll bar of the page
                        self.setPageScroll();

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
         * Prevent accidentally closing the panel.
         * Override it if you need a custom close confirm popup.
         */
        confirmClose: function () {

            var self      = this,
                title     = QUILocale.get(lg, 'sequry.customPopup.confirm.title'),
                content   = QUILocale.get(lg, 'sequry.customPopup.confirm.content'),
                btnOk     = QUILocale.get(lg, 'sequry.customPopup.confirm.button.ok'),
                btnCancel = QUILocale.get(lg, 'sequry.customPopup.confirm.button.cancel');

            var confirmContent = '<span class="fa fa-question popup-icon"></span>';
            confirmContent += '<span class="popup-title">' + title + '</span>';
            confirmContent += content;

            require(['qui/controls/windows/Confirm'], function (QUIConfirm) {
                var Popup = new QUIConfirm({
                    'class'           : 'sequry-customPopup',
                    maxWidth          : 400, // please note extra styling in style.css
                    backgroundClosable: false,
                    title             : false,
                    titleCloseButton  : false,
                    icon              : false,
                    texticon          : false,
                    content           : confirmContent,

                    ok_button    : {
                        text     : btnOk,
                        textimage: false
                    },
                    cancel_button: {
                        text     : btnCancel,
                        textimage: false
                    },
                    events       : {
                        onSubmit: self.close
                    }
                });

                Popup.open();
            })
        },

        /**
         * Don't scroll the page while panel is open
         */
        setPageFix:

            function () {
                // its easier - but requires more tests
                document.body.setStyle('overflow', 'hidden');
                return;

                // touch body fix
                QUI.Windows.calcWindowSize();

                document.body.setStyles({
                    width   : document.body.getSize().x,
                    minWidth: document.body.getSize().x
                });

                document.body.setStyles({
                    overflow: 'hidden',
                    position: 'absolute'
                });
            }

        ,

        /**
         * Restore page scroll after panel ist closed.
         */
        setPageScroll: function () {
            // its easier - but requires more tests
            document.body.setStyle('overflow', '');
            return;

            document.body.setStyles({
                width   : '',
                minWidth: '',
                overflow: '',
                position: ''
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
         * Set sub title of the panel.
         *
         * @param subtitle (string)
         */
        setSubtitle: function (subtitle) {
            this.$Elm.getElement('.sidebar-panel-header-subtitle').set('html', subtitle);
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

            // display close confirm popup?
            if (this.getAttribute('confirmClosePopup')) {
                this.confirmClose();
                return;
            }

            this.close();
        },

        /**
         * Submit form and fire submit event.
         * Primary submit button.
         */
        submit: function () {
            this.fireEvent('submit', [this]);
        },

        $onFinish: function () {
            this.close();
        },

        /**
         * Submit form and fire submitIcon event.
         * Secondary submit button (header icon).
         */
        submitSecondary: function () {
            console.log("panels/Panel --> fireEvent SUBMIT SECONDARY");
            this.fireEvent('submitSecondary', [this]);
        },

        /**
         * Create a close button.
         */
        createCloseButton: function (label, confirmClose) {
            var self = this;

            new Element('button', {
                'class': 'btn-light panel-closeButton',
                'html' : label,
                events : {
                    click: function () {
                        if (confirmClose) {
                            self.confirmClose();
                            return;
                        }

                        self.cancel();
                    }
                }
            }).inject(this.panelMenu);
        },

        /**
         * Create an action button (e.g. save, share, etc.).
         *
         * @param {string} [label] - label for action button.
         */
        createActionButton: function (label) {
            var self = this;

            new Element('button', {
                'class': 'panel-actionButton',
                'html' : label,
                events : {
                    click: self.submit
                }
            }).inject(this.panelMenu)
        },

        /**
         * Create a button on the top of the panel (header).
         * Example: "edit" to open new panel and edit the password.
         *
         * @param {string} [label] - label for header button.
         * @param {string} [icon] - icon for header button. FontAwesome recommended.
         */
        createHeaderButton: function (label, icon) {
            var self = this;

            new Element('button', {
                'class': icon,
                'title': label,
                events : {
                    click: self.submitSecondary
                }
            }).inject(this.$Elm.getElement('.sidebar-panel-header'))
        }
    });
});