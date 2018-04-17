/**
 * @module package/sequry/template/bin/js/controls/List
 */
define('package/sequry/template/bin/js/controls/List', [

    'qui/QUI',
    'qui/controls/Control',
    'Mustache',

    'text!package/sequry/template/bin/js/controls/List.html',
    'css!package/sequry/template/bin/js/controls/List.css'

], function (QUI, QUIControl, Mustache, Template) {
    "use strict";

    return new Class({

        Extends: QUIControl,
        Type   : 'package/sequry/template/bin/js/controls/List',

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

            this.$Elm.set('html', Mustache.render(Template, {}));
        }
    });
});