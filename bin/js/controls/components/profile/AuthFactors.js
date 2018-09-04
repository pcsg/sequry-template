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
            var self = this;

            // todo michael muss noch besser gemacht werden.
            // auf onload o.ä. reagieren von package/sequry/core/bin/controls/user/AuthPluginSettings
            (function () {
                moofx(self.getElm()).animate({
                    opacity: 1,
                    transform: 'translateX(0)'
                }, {
                    duration: 200
                });
            }).delay(200);
        }
    });
});
