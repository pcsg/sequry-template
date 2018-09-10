define('package/sequry/template/bin/js/classes/SequryUI', [
    'qui/classes/DOM'
], function (QDOM) {
    "use strict";

    return new Class({

        Extends: QDOM,
        Type   : 'package/sequry/template/bin/js/classes/SequryUI',

        initialize: function (options) {
            this.parent(options);

            this.PasswordList = null; // global password list
        }
    });
});
