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
            subTitle               : false,	// {false|string} [optional] subtitle of the window
            actionButton           : false, // {false|string} main action button, e.g. save, OK
            closeButton            : QUILocale.get(lg, 'sequry.panel.button.close'),  // {false|string} show the close button
            iconHeaderButton       : false, // {false|string} [optional] icon button on the right top corner. String = title
            iconHeaderButtonFaClass: '',    // {string} [optional] icon type css class
            backgroundClosable     : true,   // {bool} [optional] closes the window on click?
            confirmClosePopup      : false, // {bool} [optional] if true, it prevent accidentally closing the panel
            keepBackground         : false, // {bool} [optional] if true background will be not destroyed. Use it if you want to edit password form existing panel
            keepPanelOnClose       : false, // {bool} [optional] if true background will be not destroyed. Use it if you want to edit password form existing panel
            subPanel               : false, // {bool} [optional] sub panel will be opened within the first panel.
            width                  : null, // {int/string} [optional] if no defined standard is 600px (value examples: 300, '300px', '30%', '30vw')
            direction              : 'right' // {string} [optional] slide direction (support: left / right),
        },

        initialize: function (options) {
            this.parent(options);

            if (this.getAttribute('Background')) {
                this.Background = this.getAttribute('Background');
            } else {
                this.Background = new QUIBackground();
            }

            if (this.getAttribute('subPanel')) {
                this.Background.setStyle('background', 'rgba(0,0,0,0)');
            }

            this.panelMenu = null;
            this.Loader = new QUILoader();
            this.ButtonParser = new ButtonParser();
            this.isOpen = false;
        },

        /**
         * Return the DOMNode Element
         *
         * @returns {HTMLDivElement}
         */
        create: function () {
            // click on background close the panel?
            if (this.getAttribute('backgroundClosable')) {
                // todo @michael JS error wenn passwordShow-->passwordEdit-->close über click auf background
                this.Background.getElm().addEvent('click', this.cancel);
            }

            var width       = this.getAttribute('width'),
                direction   = this.getAttribute('direction'),
                styleParams = {
                    width: width ? width : 600
                };

            styleParams[direction] = '-100%';

            this.$Elm = new Element('div', {
                'class'     : 'sidebar-panel',
                'html'      : Mustache.render(template),
                styles      : styleParams,
                'data-quiid': this.getId()
            });

            if (this.getAttribute('class')) {
//                this.$Elm.addClass()
            }

            this.panelMenu = this.$Elm.getElement('.sidebar-panel-action-buttons');
            this.Loader.inject(this.$Elm);

            if (this.getAttribute('title')) {
                this.setTitle(this.getAttribute('title'));
            }

            if (this.getAttribute('subTitle')) {
                this.setSubtitle(this.getAttribute('subTitle'));
            }

            if (this.getAttribute('actionButton')) {
                this.createActionButton(this.getAttribute('actionButton'));
            }

            if (this.getAttribute('closeButton')) {
                this.createCloseButton(this.getAttribute('closeButton'));
            }

            if (this.getAttribute('iconHeaderButton')) {
                this.createHeaderButton(
                    this.getAttribute('iconHeaderButton'),
                    this.getAttribute('iconHeaderButtonFaClass'),
                    this.getAttribute('isOwner')
                );
            }

            this.fireEvent('afterCreate', [this]);

            return this.$Elm;
        },

        /**
         * Open panel.
         * When animation is finished return javascript promise.
         *
         * @return {Promise}
         */
        open: function () {
            var self = this;

            if (!this.$Elm) {
                this.create();
            }

            if (!this.$Elm.getParent()) {
                this.$Elm.inject(document.body);
            }

            this.setPageFix();

            this.Background.create();
            this.Background.show();

            this.fireEvent('openBegin', [this]);
            this.$Elm.setStyle('opacity', 1);

            return new Promise(function (resolve) {
                var direction     = self.getAttribute('direction'),
                    animateParams = {};

                animateParams[direction] = 0;

                moofx(self.$Elm).animate(animateParams, {
                    callback: function () {
                        self.fireEvent('open', [self]);
                        self.isOpen = true;
                        resolve();
                    }
                });
            });
        },

        /**
         * Cancel action and fire cancel event.
         */
        cancel: function () {
            if (!this.isOpen) {
                return;
            }

            this.fireEvent('cancel', [this]);

            // display close confirm popup?
            if (this.getAttribute('confirmClosePopup')) {
                this.confirmClose();
                return;
            }

            this.close();
        },

        /**
         * Close panel.
         * When animation is finished return javascript promise.
         *
         * @return {Promise}
         */
        close: function () {
            if (!this.isOpen) {
                return Promise.resolve();
            }

            var self             = this,
                keepPanelOnClose = this.getAttribute('keepPanelOnClose');

            self.fireEvent('closeBegin', [self]);

            return new Promise(function (resolve) {
                var direction     = self.getAttribute('direction'),
                    animateParams = {};

                animateParams[direction] = self.$Elm.getSize().x * -1;
                animateParams['opacity'] = 0;

                moofx(self.$Elm).animate(animateParams, {
                    duration: 250,
                    callback: function () {

                        if (!self.getAttribute('keepBackground')) {

                            if (keepPanelOnClose) {
                                self.Background.hide();
                            } else {
                                self.Background.hide().then(function () {
                                    self.Background.destroy();
                                });
                            }

                            // restore page scroll bar
                            if (!self.getAttribute('subPanel')) {
                                self.setPageScroll();
                            }
                        }

                        if (!keepPanelOnClose) {
                            self.$Elm.destroy();
                            self.$Elm = null;
                        }

                        self.isOpen = false;

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
                    ok_button         : {
                        text     : btnOk,
                        textimage: false
                    },
                    cancel_button     : {
                        text     : btnCancel,
                        textimage: false
                    },
                    events            : {
                        onSubmit: self.close
                    }
                });

                Popup.open();
            })
        },

        /**
         * Don't scroll the page while panel is open
         */
        setPageFix: function () {
            // its easier - but requires more tests
            document.body.setStyle('overflow', 'hidden');
//            return;
//
//            // touch body fix
//            QUI.Windows.calcWindowSize();
//
//            document.body.setStyles({
//                width   : document.body.getSize().x,
//                minWidth: document.body.getSize().x
//            });
//
//            document.body.setStyles({
//                overflow: 'hidden',
//                position: 'absolute'
//            });
        },

        /**
         * Restore page scroll after panel ist closed.
         */
        setPageScroll: function () {
            // its easier - but requires more tests
            document.body.setStyle('overflow', '');
//            return;
//
//            document.body.setStyles({
//                width   : '',
//                minWidth: '',
//                overflow: '',
//                position: ''
//            });
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
            this.fireEvent('submitSecondary', [this]);
        },

        /**
         * Create a close button.
         */
        createCloseButton: function (label) {
            var self = this;

            new Element('button', {
                'class': 'btn-light panel-closeButton',
                'html' : label,
                events : {
                    click: function () {
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
         * @param {bool} [isOwner] - only owner is allowed to edit the password. // todo michael wtf???
         */
        createHeaderButton: function (label, icon, isOwner) {
            var status = 'on',
                func   = this.submitSecondary;

            if (!isOwner) {
                icon += ' inactive';
                status = 'off';
            }

            var Button = new Element('button', {
                'class'          : icon,
                'title'          : label,
                'data-qui-status': status
            });

            if (isOwner) {
                Button.addEvent('click', func);
            }

            Button.inject(this.$Elm.getElement('.sidebar-panel-header'));
        }
    });
});