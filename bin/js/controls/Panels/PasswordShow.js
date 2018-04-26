/**
 * @module package/sequry/template/bin/js/controls/Panels/PasswordShow
 */
define('package/sequry/template/bin/js/controls/Panels/PasswordShow', [

    'qui/QUI',
    'qui/controls/Control',
    'qui/controls/loader/Loader',
    'qui/controls/utils/Background',
    'Mustache',

    'package/sequry/template/bin/js/controls/Panels/Password',

    'text!package/sequry/template/bin/js/controls/Panels/Panel.html',
    'css!package/sequry/template/bin/js/controls/Panels/Panel.css'

], function (
    QUI,
    QUIControl,
    QUILoader,
    QUIBackground,
    Mustache,
    Password,
    Template
) {
    "use strict";

    return new Class({

        Extends: Password,
        Type   : 'package/sequry/template/bin/js/controls/Panels/PasswordShow',

        Binds: [
        ],

        options: {
            title             : 'Show Password',	// {false|string} [optional] title of the window
            backgroundClosable: true, // {bool} [optional] closes the window on click? standard = true
            closeButton       : true, // {bool} show the close button
            closeButtonText   : Locale.get('qui/controls/windows/Popup', 'btn.close')
        },

        initialize: function (options) {
            this.parent(options);


            this.SequryPanel.$Elm.getElement('.sidebar-panel-content').set('html', 'huhuhu hihihihi');

        }

    });
});