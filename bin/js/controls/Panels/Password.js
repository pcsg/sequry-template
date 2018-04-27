/**
 * @module package/sequry/template/bin/js/controls/Panels/Password
 */
define('package/sequry/template/bin/js/controls/Panels/Password', [

    'qui/QUI',
    'qui/controls/Control',
    'Mustache',

    'package/sequry/template/bin/js/controls/Panels/Password',
    'package/sequry/template/bin/js/Password',

    'text!package/sequry/template/bin/js/controls/Panels/Password.html'
//    'css!package/sequry/template/bin/js/controls/Panels/Panel.css'

], function (
    QUI,
    QUIControl,
    Mustache,
    Password,
    PasswordHandler,
    template
) {
    "use strict";

    return new Class({

        Extends: QUIControl,
        Type   : 'package/sequry/template/bin/js/controls/Panels/Password',

        Binds: [
            '$onInject'
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
                self.getElm().set('html', Mustache.render(template, {}));
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

        save: function () {
            PasswordHandler.save(this.getAttribute('id'), data);
        }

    });
});