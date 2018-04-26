/**
 * @module package/sequry/template/bin/js/controls/Menu
 */
define('package/sequry/template/bin/js/controls/Menu', [

    'qui/QUI',
    'qui/controls/Control',
    'Mustache',

    'text!package/sequry/template/bin/js/controls/Menu.html',
    'css!package/sequry/template/bin/js/controls/Menu.css'

], function (QUI, QUIControl, Mustache, Template) {
    "use strict";

    return new Class({

        Extends: QUIControl,
        Type   : 'package/sequry/template/bin/js/controls/Menu',

        Binds: [
            '$onInject'
        ],

        initialize: function (options) {
            this.parent(options);

            this.addEvents({
                onInject: this.$onInject
            });
        },

        /**
         * event: on inject
         */
        $onInject: function () {
//            console.log(this.$Elm);
//            console.log('on inject');

            this.$Elm.set('html', Mustache.render(Template, {}));
        }
    });
});