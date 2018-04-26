/**
 * @module package/sequry/template/bin/js/controls/Panels/PanelShow
 */
define('package/sequry/template/bin/js/controls/Panels/PanelShow', [

    'qui/QUI',
    'package/sequry/template/bin/js/controls/Panel/Control',
    'qui/controls/loader/Loader',
    'qui/controls/utils/Background',
    'Mustache',

    'text!package/sequry/template/bin/js/controls/Panel.html',
    'css!package/sequry/template/bin/js/controls/Panel.css'

], function (
    QUI,
    SequryPanel,
    QUILoader,
    QUIBackground,
    Mustache,
    Template
) {
    "use strict";

    return new Class({

        Extends: SequryPanel,
        Type   : 'package/sequry/template/bin/js/controls/Panels/PanelShow',

        Binds: [
        ],

        options: {
            title             : false,	// {false|string} [optional] title of the window
            backgroundClosable: true, // {bool} [optional] closes the window on click? standard = true
            closeButton       : true, // {bool} show the close button
            closeButtonText   : Locale.get('qui/controls/windows/Popup', 'btn.close')
        },

        initialize: function (options) {
            this.parent(options);

        }

    });
});