/**
 * @module package/sequry/template/bin/js/controls/components/Menu
 */
define('package/sequry/template/bin/js/controls/components/Menu', [

    'qui/QUI',
    'qui/controls/Control',
    'Mustache',

    'text!package/sequry/template/bin/js/controls/components/Menu.html',
    'css!package/sequry/template/bin/js/controls/components/Menu.css'

], function (QUI, QUIControl, Mustache, Template) {
    "use strict";

    return new Class({

        Extends: QUIControl,
        Type   : 'package/sequry/template/bin/js/controls/components/Menu',

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

            // favorite
            this.Favorite = this.$Elm.getElement('#favorite');

            this.Favorite.addEvent('click', function () {
                window.PasswordList.showFavorite();
            })
        }
    });
});