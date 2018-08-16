define('package/sequry/template/bin/js/classes/SequryUI', [], function (QDOM) {
    "use strict";

    return new Class({

        Extends: QDOM,
        Type   : 'package/sequry/template/bin/js/classes/SequryUI',

        initialize: function () {
            this.PasswordList = null; // global password list
        }
    });
});