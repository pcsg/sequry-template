/**
 * @module package/sequry/template/bin/js/controls/Panels/Password
 */
define('package/sequry/template/bin/js/controls/Panels/Password', [

    'qui/QUI',
    'qui/controls/Control',
    'qui/controls/loader/Loader',
    'qui/controls/utils/Background',
    'Mustache',

    'package/sequry/template/bin/js/controls/Panels/Panel',

    'text!package/sequry/template/bin/js/controls/Panels/Panel.html',
    'css!package/sequry/template/bin/js/controls/Panels/Panel.css'

], function (
    QUI,
    QUIControl,
    QUILoader,
    QUIBackground,
    Mustache,
    Panel,
    Template
) {
    "use strict";

    return new Class({

        Extends: QUIControl,
        Type   : 'package/sequry/template/bin/js/controls/Panels/Password',

        Binds: [
        ],

        options: {
            title             : false,	// {false|string} [optional] title of the window
            backgroundClosable: true, // {bool} [optional] closes the window on click? standard = true
            closeButton       : true, // {bool} show the close button
            closeButtonText   : 'Abbrechen'
        },

        initialize: function (options) {
            this.parent(options);

            console.log(this.getAttribute('title'))

            this.SequryPanel = new Panel({
                title: this.getAttribute('title')
            });



        }

    });
});