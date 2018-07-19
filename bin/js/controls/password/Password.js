/**
 * @module package/sequry/template/bin/js/controls/password/Password
 */
define('package/sequry/template/bin/js/controls/password/Password', [

    'qui/QUI',
    'qui/controls/Control',
    'Mustache',
    'Locale',
    'Ajax',

    'package/sequry/template/bin/js/Password',
    'package/sequry/template/bin/js/controls/panels/PasswordPanel',
    'package/sequry/template/bin/js/controls/passwordTypes/View',
    'package/sequry/template/bin/js/controls/utils/InputButtons',

    'text!package/sequry/template/bin/js/controls/password/Password.html'
], function (
    QUI,
    QUIControl,
    Mustache,
    QUILocale,
    QUIAjax,
    PasswordHandler,
    PasswordPanel, // controls/panels/PasswordPanel
    PWTypeView, // controls/passwordTypes/View
    InputButtons, // controls/utils/InputButtons
    template
) {
    "use strict";

    var lg = 'sequry/template';

    return new Class({

        Extends: QUIControl,
        Type   : 'package/sequry/template/bin/js/controls/password/Password',

        Binds: [
            '$onInject',
            'share'
        ],

        options: {
            id          : false,
            passwordData: false
        },

        initialize: function (options) {
            this.parent(options);

            this.$Elm = null;

            this.addEvents({
                onInject: this.$onInject
            });
        },

        /**
         * event: on inject
         *
         * Create the password html stuff
         */
        $onInject: function () {
            var self       = this,
                passwordId = this.getAttribute('id');

            this.$Elm = this.getElm();

            PasswordHandler.getDataNew(passwordId).then(function (ViewData) {
                if (!ViewData) {
                    return;
                }

                self.$Elm.set('html', Mustache.render(template, {
                    'description': ViewData.description
                }));

                var payloadContainer = self.$Elm.getElement('.show-password-data'),
                    PayloadData      = ViewData.payload;

                new PWTypeView({
                    type  : ViewData.dataType,
                    events: {
                        onLoaded: function (PW) {
                            PW.setData(PayloadData)
                        }
                    }
                }).inject(payloadContainer);

                self.setAttribute('passwordData', ViewData);
                self.fireEvent('load', [self]);

            }, function () {
                // Close password panel if auth popup will be closed by user
                self.fireEvent('close', [self]);
            });
        },

        /**
         * Return the title of the password
         *
         * @returns {string}
         */
        getTitle: function () {
            var data = this.getAttribute('passwordData');

            if (!data) {
                return '';
            }

            if (typeof data.title === 'undefined') {
                return '';
            }

            return data.title;
        },


        /**
         * Return the typeof the password
         *
         * @returns {string|boolean} - translated name of the password type
         */
        getType: function () {
            var data = this.getAttribute('passwordData');

            if (!data) {
                return false;
            }

            if (typeof data.dataType === 'undefined') {
                return false;
            }

            return PasswordHandler.getTypeTranslations(data.dataType.toLowerCase());
        },

        share: function () {
            console.log("password/Password.js --> Jetzt wird geshared!");
//            PasswordHandler.save(this.getAttribute('id'), passwordData);
        },

        edit: function () {
            console.log("password/Password.js --> Password bearbeiten");
            var self = this;

            require(
                ['package/sequry/template/bin/js/controls/panels/PasswordPanel'],
                function (PP) {
                    new PP({
                        id: self.getAttribute('data').id
                    }).open();
                }
            )
        }

    });
});