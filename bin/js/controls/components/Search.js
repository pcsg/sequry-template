/**
 * @module package/sequry/template/bin/js/controls/components/Search
 */
define('package/sequry/template/bin/js/controls/components/Search', [

    'qui/QUI',
    'qui/controls/Control',
    'Mustache',
    'Locale',

    'package/sequry/template/bin/js/SequryUI'

//    'text!package/sequry/template/bin/js/controls/components/Header.html',
//    'css!package/sequry/template/bin/js/controls/components/Header.css'

], function (QUI, QUIControl, Mustache, QUILocale,
    SequryUI
) {
    "use strict";

    var lg = 'sequry/template';

    return new Class({

        Extends: QUIControl,
        Type   : 'package/sequry/template/bin/js/controls/components/Search',

        Binds: [
            '$onInject'
        ],

        options: {
            focus     : false,
            height    : 'auto',
            iconBefore: false,
            iconAfter : false

        },

        initialize: function (options) {
            this.parent(options);

            this.$Elm = null;
            this.DesktopSearch = null;
            this.Input = null;
            this.searchValue = null;

            this.addEvents({
                onInject: this.$onInject
            });
        },

        create: function () {
            var self = this;

            this.$Elm = new Element('div', {
                'class': 'sequry-search',
                styles : {
                    height: this.getAttribute('height')
                }
            });

            this.Input = new Element('input', {
                name        : 'sequry-search',
                type        : 'text',
                placeholder : QUILocale.get(lg, 'sequry.components.search.placeholder'),
                autocomplete: 'off'
            }).inject(this.$Elm);

            if (this.getAttribute('iconBefore')) {
                new Element('button', {
                    'class' : this.getAttribute('iconBefore'),
                    events: {
                        click: function () {
                            self.fireEvent('iconBeforeSubmit', [this])
                        }
                    }
                }).inject(this.$Elm, 'top');
            }

            if (this.getAttribute('iconAfter')) {
                new Element('button', {
                    'class': this.getAttribute('iconAfter'),
                    events : {
                        click: function () {
                            self.fireEvent('iconAfterSubmit', [this])
                        }
                    }
                }).inject(this.$Elm, 'bottom');
            }

            return this.$Elm;
        },

        /**
         * event: on inject
         */
        $onInject: function () {
            console.log("inject!")
            if (this.getAttribute('focus')) {
                this.Input.focus();
            }

            var self     = this,
                inputEsc = false;

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
//                        self.search();
                        return;
                    }

                    self.search();
                }
            });
        },

        /**
         * event: on import
         */
        $onImport: function () {
            console.log('import...')
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
            }).delay(400);
        }
    });
});