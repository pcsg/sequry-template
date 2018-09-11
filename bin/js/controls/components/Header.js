/**
 * @module package/sequry/template/bin/js/controls/components/Header
 */
define('package/sequry/template/bin/js/controls/components/Header', [

    'qui/QUI',
    'qui/controls/Control',
    'Mustache',
    'Locale',

    'package/sequry/template/bin/js/SequryUI',

    'text!package/sequry/template/bin/js/controls/components/Header.html',
    'css!package/sequry/template/bin/js/controls/components/Header.css'

], function (QUI, QUIControl, Mustache, QUILocale,
    SequryUI,
    template
) {
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
         * Create the DOMNode Element
         *
         * @returns {Element}
         */
        create: function () {
            this.$Elm = this.parent();
            this.$Elm.addClass('header-main');

            this.$Elm.set('html', Mustache.render(template, {
                inputPlaceholder: QUILocale.get(lg, 'sequry.header.search.input.placeholder'),
                searchBtn       : QUILocale.get(lg, 'sequry.header.search.searchbtn')
            }));

            return this.$Elm;
        },

        /**
         * event: on inject
         */
        $onInject: function () {
            var self     = this,
                inputEsc = false;

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
                        self.search();
                    }

                    self.search();
                }
            });

            this.fireEvent('load', [this]);
        },

        /**
         * Excecute the search with a delay
         */
        search: function () {
            var searchValue = this.Input.value.trim();
            var self = this;

            if (searchValue === '') {
                this.Input.value = '';
                //this.$Input.focus();
            }

            // prevents the search from being execute
            // after action-less keys (alt, shift, ctrl, etc.)
            if (searchValue === this.searchValue) {
                return;
            }

            if (this.$Timer) {
                clearInterval(this.$Timer);
            }

            this.$Timer = (function () {
                self.searchValue = searchValue;

                SequryUI.PasswordList.setSearchTerm(searchValue);
                SequryUI.PasswordList.$listRefresh();
            }).delay(500);
        },

        /**
         * Append a DOMNode HTML Child to the Header
         *
         * @param {HTMLElement} Child
         */
        appendChild: function (Child) {
            this.$Elm.appendChild(Child);
        }
    });
});