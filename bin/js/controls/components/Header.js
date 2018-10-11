/**
 * @module package/sequry/template/bin/js/controls/components/Header
 */
define('package/sequry/template/bin/js/controls/components/Header', [

    'qui/QUI',
    'qui/controls/Control',
    'Mustache',
    'Locale',

    'package/sequry/template/bin/js/SequryUI',

    'text!package/sequry/template/bin/js/controls/components/Header.html'

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
            '$onInject',
            'search'
        ],

        initialize: function (options) {
            this.parent(options);

            this.DesktopSearch = null;
            this.Input = null;
            this.searchValue = null;
            this.ResetButton = null;

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
            this.InputField = this.DesktopSearch.getElement('input[name="password-search"]');
            this.ResetButton = this.DesktopSearch.getElement('.desktop-search-resetbtn');

            this.DesktopSearch.addEvent('submit', function (event) {
                event.stop();
            });

            this.ResetButton.addEvent('click', function () {
                self.InputField.value = ''; // needed, otherwise search() will be not executed
                self.search();
            });

            this.InputField.addEvents({
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
                        self.InputField.value = '';
                    }

                    self.search();
                }
            });

            this.fireEvent('load', [this]);
        },

        /**
         * Execute the search with a delay
         */
        search: function () {
            var self        = this,
                searchValue = this.InputField.value.trim(),
                delay       = 500; // search delay

            if (searchValue === '') {
                this.InputField.value = '';
                // hide reset button
                self.ResetButton.setStyle('opacity', 0);
                delay = 0; // execute search immediately
            } else {
                // show reset button
                self.ResetButton.setStyle('opacity', 1);
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
            }).delay(delay);
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