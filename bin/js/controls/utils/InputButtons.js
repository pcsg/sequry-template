require.config({
    paths: {
        "ClipboardJS": URL_OPT_DIR + 'bin/clipboard/dist/clipboard'
    }
});

/**
 * @module package/sequry/template/bin/js/controls/utils/InputButtons
 * @author www.pcsg.de (Michael Danielczok)
 */
define('package/sequry/template/bin/js/controls/utils/InputButtons', [
    'Locale',
    'qui/controls/loader/Loader',
    'ClipboardJS',
    'package/sequry/core/bin/Passwords'
], function (
    QUILocale,
    QUILoader,
    Clipboard,
    Passwords
) {
    "use strict";

    var lg = 'sequry/template';

    return new Class({

        Type: 'package/sequry/template/bin/js/controls/utils/InputButtons',

        initialize: function () {
            this.Loader = null;
        },

        /**
         * Parse DOM elements of the view and add specific controls
         * (e.g. copy / show password buttons)
         */
        parse: function (ParseElm) {
            var i, len;

            // copy elements
            var copyElms = ParseElm.getElements('.password-copy');

            for (i = 0, len = copyElms.length; i < len; i++) {
                this.parseCopyElm(copyElms[i]);
            }

            // show elements (switch between show and hide)
            var showElms = ParseElm.getElements('.password-show');

            for (i = 0, len = showElms.length; i < len; i++) {
                this.parseShowElm(showElms[i]);
            }

            // url elements
            var urlElms = ParseElm.getElements('.password-openurl');

            for (i = 0, len = urlElms.length; i < len; i++) {
                this.parseOpenUrlElm(urlElms[i]);
            }

            // generate password elements
            var generateElms = ParseElm.getElements('.password-generate');

            for (i = 0, len = generateElms.length; i < len; i++) {
                this.parseGeneratePassword(generateElms[i]);
            }
        },

        /**
         * Parse copy password buttons
         *
         * @param CopyBtn
         */
        parseCopyElm: function (CopyBtn) {
            var parent = CopyBtn.getParent(),
                Input  = parent.getElement('input');

            CopyBtn.set('title', QUILocale.get(lg, 'sequry.utils.button.copy'));

            CopyBtn.addEvent('click', function (event) {
                event.stop();

                var ToolTip = new Element('div', {
                    'class': 'sequry-utils-buttons-copy-tooltip-left',
                    html   : '<span>' +
                        QUILocale.get(lg, 'sequry.utils.button.copy.tooltip') +
                        '</span>'
                }).inject(CopyBtn, 'after');

                (function () {
                    moofx(ToolTip).animate({
                        opacity: 0
                    }, {
                        duration: 1000,
                        callback: function () {
                            ToolTip.destroy();
                        }
                    });
                }.delay(750));
            });

            new Clipboard(CopyBtn, {
                text: function () {
                    if (Input) {
                        return Input.value;
                    }

                    return parent.getElement('.password-field-value').get('html');
                }
            });
        },

        /**
         * Parse show password buttons
         *
         * @param ShowBtn
         */
        parseShowElm: function (ShowBtn) {
            var parent   = ShowBtn.getParent(),
                Input    = parent.getElement('input'),
                showPass = false;

            ShowBtn.addEvent('click', function (event) {
                event.stop();

                if (showPass) {
                    ShowBtn.removeClass('fa-eye-slash');
                    ShowBtn.addClass('fa-eye');
                    Input.setProperty('type', 'password');
                    showPass = false;
                    return;
                }

                ShowBtn.addClass('fa-eye-slash');
                ShowBtn.removeClass('fa-eye');
                Input.setProperty('type', 'text');
                showPass = true;

            })
        },

        /**
         * Parse open url buttons
         *
         * @param OpenUrlBtn
         */
        parseOpenUrlElm: function (OpenUrlBtn) {
            var parent = OpenUrlBtn.getParent(),
                Input  = parent.getElement('input');

            OpenUrlBtn.set('title', QUILocale.get(lg, 'sequry.utils.button.openLink'));

            OpenUrlBtn.addEvent('click', function () {
                var href;

                if (Input.get('href')) {
                    href = Input.href;
                } else {
                    var LinkElm = Input.getElement('a');

                    if (LinkElm && LinkElm.get('href')) {
                        href = Input.href;
                    }
                }

                if (!href) {
                    href = Input.value;
                }

                if (!href) {
                    href = Input.innerHTML;
                }

                if (!href) {
                    return;
                }

                var AnchorElm = new Element('a', {
                    href  : href,
                    target: '_blank'
                });

                AnchorElm.click();
                AnchorElm.destroy();
            })
        },

        /**
         * Parse generate password button
         *
         * @param Button
         */
        parseGeneratePassword: function (Button) {
            var self   = this,
                parent = Button.getParent(),
                Input  = parent.getElement('input');

            if (typeof Input === 'undefined') {
                return;
            }

            if (this.Loader === null) {
                this.Loader = new QUILoader({
                    cssclass: 'custom-input-button-loader'
                });
                this.Loader.inject(parent)
            }

            Button.addEvent('click', function () {
                self.Loader.show();

                Passwords.generateRandomPassword().then(function (rndPassword) {
                    Input.value = rndPassword;
                    self.Loader.hide();

                    var ToolTip = new Element('div', {
                        'class': 'sequry-utils-buttons-copy-tooltip-left',
                        html   : '<span>' +
                            QUILocale.get(lg, 'sequry.utils.button.passwordGenerate.tooltip') +
                            '</span>'
                    }).inject(Button, 'after');

                    (function () {
                        moofx(ToolTip).animate({
                            opacity: 0
                        }, {
                            duration: 1000,
                            callback: function () {
                                ToolTip.destroy();
                            }
                        });
                    }.delay(750));
                });
            })
        }
    });
});