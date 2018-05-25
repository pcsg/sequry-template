/**
 * @module package/sequry/template/bin/js/controls/password/Password
 */
define('package/sequry/template/bin/js/controls/password/Password', [

    'qui/QUI',
    'qui/controls/Control',
    'Mustache',

    'package/sequry/template/bin/js/Password',
    'package/sequry/template/bin/js/controls/panels/PasswordPanel',
    'package/sequry/template/bin/js/controls/utils/InputButtons',

    'text!package/sequry/template/bin/js/controls/password/Password.html'
], function (
    QUI,
    QUIControl,
    Mustache,
    PasswordHandler,
    PasswordPanel,
    InputButtons,
    template
) {
    "use strict";

    return new Class({

        Extends: QUIControl,
        Type   : 'package/sequry/template/bin/js/controls/password/Password',

        Binds: [
            '$onInject',
            'share'
        ],

        options: {
            id  : false,
            data: false
        },

        initialize: function (options) {
            this.parent(options);

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
            var self = this;

            PasswordHandler.getData(this.getAttribute('id')).then(function (result) {

                // @todo password muss von sequry kommen!
                // das hier ist nur eine zwischenlösung
                self.getElm().set('html', Mustache.render(template, {
                    'description'  : result.description,
                    'userText'     : 'Benutzer',
                    'userValue'    : result.payload.user,
                    'passwordText' : 'Passwort',
                    'passwordValue': result.payload.password,
                    'urlText'      : 'Url',
                    'urlValue'     : result.payload.url,
                    'noteText'     : 'Notiz',
                    'noteValue'    : result.payload.note
                }));

                InputButtons.$parse(self.getElm());
                console.log(document.getElements('.password-copyitem'))
//
//                require([result.type], function(PWControl) {
//                    new PWControl().inject(self.getElm());
//                });
//
                // result.type

                self.setAttribute('data', result);
                self.fireEvent('load', [self]);


            });
        },

        /**
         * Return the title of the password
         *
         * @returns {string}
         */
        getTitle: function () {
            var data = this.getAttribute('data');

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
         * @returns {string|boolean}
         */
        getType: function () {
            var data = this.getAttribute('data');

            if (!data) {
                return false;
            }

            if (typeof data.type === 'undefined') {
                return false;
            }

            return data.type;
        },

        /**
         * Get the string for type class.
         *
         * @returns {string}
         */
        getTypeClass: function () {
            return 'package/sequry/template/bin/js/controls/password/Password' + this.getType();
        },

        getTemplate: function () {
            require([this.getTypeClass()], function (Panel) {

            });
        },

        share: function () {
            console.log("password/Password.js --> Jetzt wird geshared!");
//            PasswordHandler.save(this.getAttribute('id'), data);


        },

        edit: function () {
            console.log("password/Password.js --> Password bearbeiten");

            require(['package/sequry/template/bin/js/controls/panels/PasswordPanel'], function(PP) {
                new PP({id: 2}).open();
            })
        }

    });
});