/**
 * @module package/sequry/template/bin/js/controls/utils/InputButtons
 */
define('package/sequry/template/bin/js/controls/utils/InputButtons', [

    'qui/QUI',
    'qui/controls/Control'
], function (
    QUI,
    QUIControl
) {
    "use strict";

    return new Class({

        Type   : 'package/sequry/template/bin/js/controls/utils/InputButtons',

        Binds: [
        ],

        initialize: function (options) {
//            this.parent(options);
            console.log("Input Buttons initialisiert!");

        },

        /**
         * Parse DOM elements of the view and add specific controls (e.g. copy / show password buttons)
         */
        $parse: function () {
            var i, len;

            console.log("pare funktion von input buttons");


            // copy elements
//            var copyElms = this.$Elm.getElements('.password-copyitem');

//            for (i = 0, len = copyElms.length; i < len; i++) {
//                ButtonParser.parse(copyElms[i], ['copy']);
//                console.log(copyElms[i])
//            }

            /*// show elements (switch between show and hide)
            var showElms = this.$Elm.getElements('.gpm-passwordtypes-show');

            for (i = 0, len = showElms.length; i < len; i++) {
                ButtonParser.parse(showElms[i], ['viewtoggle']);
            }

            // url elements
            var urlElms = this.$Elm.getElements('.gpm-passwordtypes-url');

            for (i = 0, len = urlElms.length; i < len; i++) {
                ButtonParser.parse(urlElms[i], ['openurl']);
            }*/
        },
        
        parseCopyElm: function () {
            
        }

    });
});