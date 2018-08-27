/**
 * @module package/sequry/template/bin/js/controls/components/profile/AuthFactors
 */
define('package/sequry/template/bin/js/controls/components/profile/AuthFactors', [

    'qui/QUI',
    'qui/controls/Control'

], function (QUI, QUIControl) {
    "use strict";
    return new Class({

        Extends: QUIControl,
        Type   : 'package/sequry/template/bin/js/controls/components/profile/AuthFactors',

        Binds: [
            '$onInject'
        ],

        initialize: function (options) {
            this.parent(options);

            this.addEvents({
                onImport: this.$onImport
            });
        },

        /**
         * event: on inject
         */
        $onImport: function () {
            this.getElm().setStyle('opacity', 0);
            this.getElm().setStyle('display', 'inline');

            moofx(this.getElm()).animate({
                opacity: 1
            });
        }
    });
});
