/**
 * @module package/sequry/template/bin/js/controls/components/Header
 */
define('package/sequry/template/bin/js/controls/components/Header', [

    'qui/QUI',
    'qui/controls/Control',
    'Mustache',
    'Locale',

    'text!package/sequry/template/bin/js/controls/components/Header.html',
    'css!package/sequry/template/bin/js/controls/components/Header.css'

], function (QUI, QUIControl, Mustache, QUILocale, Template) {
    "use strict";

    var lg = 'sequry/template';

    return new Class({

        Extends: QUIControl,
        Type   : 'package/sequry/template/bin/js/controls/components/Header',

        Binds: [
            '$onInject'
        ],

        initialize: function (options) {
            this.parent(options);

            this.DesktopSearch = null;
            this.Input = null;
            this.searchValue = null;

            this.addEvents({
                onInject: this.$onInject
            });
        },

        /**
         * event: on inject
         */
        $onInject: function () {
            var self     = this,
                inputEsc = false; //

            this.$Elm.set('html', Mustache.render(Template, {
                logout          : QUILocale.get(lg, 'sequry.header.logout'),
                inputPlaceholder: QUILocale.get(lg, 'sequry.header.search.input.placeholder')
            }));

            this.DesktopSearch = this.$Elm.getElement('.desktop-search');
            this.Input = this.DesktopSearch.getElement('input');

            this.Input.addEvents({
                keydown: function (event) {
                    if (event.key === 'esc') {
                        event.stop();
                        inputEsc = true;
                        return;
                    }

                    inputEsc = false;
                },
                keyup  : function (event) {

                    // Esc clears the input field
                    if (inputEsc) {
                        event.stop();
                        self.Input.value = '';
                    }

                    self.search();
                }
            });
        },

        /**
         * Excecute the search with a delay
         */
        search: function () {

            var searchValue = this.Input.value.trim();

            var self = this;
            var test = this.$Elm.getElement('.test');

            if (this.$Timer) {
                clearInterval(this.$Timer);
            }

            if (searchValue === '') {
                this.Input.value = '';
                //this.$Input.focus();
            }

            // prevents the search from being execute
            // after action-less keys (alt, shift, ctrl, etc.)
            if (searchValue === this.searchValue) {
                return;
            }

            this.$Timer = (function () {

                self.searchValue = searchValue;

                window.PasswordList.setSearchTerm(searchValue);
                window.PasswordList.$listRefresh();

            }).delay(500);
        }
    });
});