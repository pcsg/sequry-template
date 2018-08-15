/**
 * @module package/sequry/template/bin/js/controls/password/link/List
 */
define('package/sequry/template/bin/js/controls/password/link/List', [

    'qui/QUI',
    'qui/controls/Control',
    'qui/controls/loader/Loader',
    'Mustache',
    'Ajax',
    'Locale',

    'package/sequry/core/bin/Actors',
    'package/sequry/core/bin/Passwords',

    'text!package/sequry/template/bin/js/controls/password/link/List.Entry.html',
    'css!package/sequry/template/bin/js/controls/password/link/List.Entry.css',
    'css!package/sequry/template/bin/js/controls/password/link/List.css'

], function (
    QUI, QUIControl, QUILoader, Mustache, QUIAjax, QUILocale,
    Actors,
    Passwords,
    template
) {
    "use strict";

    var lg     = 'sequry/template',
        lgCore = 'sequry/core';

    return new Class({

        Extends: QUIControl,
        Type   : 'package/sequry/template/bin/js/controls/password/link/List',

        Binds: [
            '$onInject',
            '$listRefresh'
        ],

        options: {
            passwordId  : false, //passwordId
            showInactive: false // show inactive links
        },

        initialize: function (options) {
            this.parent(options);

            this.Loader = new QUILoader();
            this.$ShowInactiveBtn = null;
            this.$SearchParams = {};

            this.addEvents({
                onInject: this.$onInject
            });
        },

        /**
         * event: on inject
         *
         * Create the password html stuff
         */
        $onInject: function () {
            var self = this,
                pwId = this.getAttribute('passwordId');

            this.$Elm = this.getElm();

            // list buttons bar
            var ButtonBarElm = new Element('div', {
                'class': 'link-table-buttonBar'
            }).inject(this.$Elm);

            // create link button
            var CreateLink = new Element('button', {
                'class': 'btn btn-secondary btn-small link-table-createLink',
                html   : QUILocale.get(lgCore, 'controls.password.linklist.tbl.btn.add'),
                events : {
                    click: function () {
                        console.log('Erstelle neuen Link')
                    }
                }
            }).inject(ButtonBarElm);

            // toggle inactive buttons
            this.showInactive = this.getAttribute('showActive');
            var toggleInactiveIcon = '<span class="fa fa-square-o"></span>';

            if (this.showInactive) {
                toggleInactiveIcon = '<span class="fa fa-check-square-o"></span>';
            }

            new Element('button', {
                'class'        : 'btn btn-secondary btn-outline btn-small link-table-toggleInactive',
                html           : toggleInactiveIcon + QUILocale.get(
                    lgCore, 'controls.password.linklist.tbl.btn.toggleInactive'
                ),
                'data-selected': this.showInactive,
                events         : {
                    click: function () {
                        console.log('switch zwischen active / inactive ');

                        var Icon = this.getElement('.fa');

                        if (this.getProperty('data-selected') === 'true') {
                            this.setProperty('data-selected', false);

                            Icon.removeClass('fa-check-square-o');
                            Icon.addClass('fa-square-o');
                        } else {
                            this.setProperty('data-selected', true);

                            Icon.removeClass('fa-square-o');
                            Icon.addClass('fa-check-square-o');
                        }

                        self.showInactive = !self.showInactive;
//                        self.$listRefresh();
                    }
                }
            }).inject(ButtonBarElm);

            // list elm
            this.$ListElm = new Element('ul', {
                'class': 'link-table-list'
            }).inject(this.$Elm);

            this.Loader.inject(this.$ListElm);

            this.$listRefresh();
            this.fireEvent('load', [this])
        },

        $listRefresh: function () {
            var self = this;
            var sortOn = this.getAttribute('sortOn');

            if (sortOn) {
                switch (sortOn) {
                    case 'id':
                    case 'active':
                        break;

                    default:
                        sortOn = 'id';
                }
            }

            this.Loader.show();

            this.$SearchParams.sortOn = sortOn;
            this.$SearchParams.sortBy = this.getAttribute('sortBy');
            this.$SearchParams.perPage = this.getAttribute('perPage');
            this.$SearchParams.page = this.getAttribute('page');

            return Passwords.getLinkList(
                this.getAttribute('passwordId'),
                this.$SearchParams
            ).then(function (list) {
                var entries = list.data;

                for (var i = 0, len = entries.length; i < len; i++) {
                    self.createEntry(entries[i]);
                }
                self.Loader.hide();
            }, function () {
                self.fireEvent('close', [self]);
            });
        },

        createEntry: function (Entry) {
            console.log(Entry)
            var LiElm = new Element('li', {
                'class': 'link-table-list-entry',
                html   : Mustache.render(template, {
                    'validUntil': 'Gültig bis:',
                    'calls'     : 'Aufrufe'
                })
            });

            LiElm.inject(this.$ListElm);

            var Link = new Element('span', {
                'class' : 'fa fa-external-link',
                title: Entry.link,
                events: {
                    click: function () {
                        console.log(Entry.link)
                    }
                }
            }).inject(LiElm.getElement('.link-table-list-entry-icon'));
        }
    });
});