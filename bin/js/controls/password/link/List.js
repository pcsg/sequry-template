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
            showInactive: false, // show inactive links
            sortOn      : 'id',
            sortBy      : 'ASC'
        },

        initialize: function (options) {
            this.parent(options);

            this.Loader = new QUILoader();
            this.$ShowInactiveBtn = null;
            this.$SearchParams = {};
            this.CurDate = new Date();

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
                        self.$SearchParams.showInactive = self.showInactive;
                        self.$listRefresh();
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

            this.$ListElm.set('html', '');
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

            var maxCalls = '';
            if (Entry.maxCalls) {
                maxCalls = ' / ' + Entry.maxCalls;
            }

            var LiElm = new Element('li', {
                'class'      : 'link-table-list-entry',
                html         : Mustache.render(template, {
                    'validUntil'     : 'Gültig bis:',
                    'validUntilValue': Entry.validUntil,
                    'calls'          : 'Aufrufe:',
                    'callCount'      : Entry.callCount,
                    'maxCalls'       : maxCalls
                }),
                'data-active': Entry.active
            });

            LiElm.inject(this.$ListElm);

            // password date expired?
            var ExpireDate = new Date(Entry.validUntil);
            if (this.CurDate > ExpireDate) {
                LiElm.getElement(
                    '.link-table-list-entry-content-value.password-validUntil'
                ).addClass('date-expired')
            }

            // max calls reached?
            if (Entry.maxCalls && Entry.callCount >= Entry.maxCalls) {
                LiElm.getElement(
                    '.link-table-list-entry-content-value.password-calls'
                ).addClass('max-calls-reached')
            }

            // link button
            new Element('span', {
                'class': 'fa fa-external-link link-table-list-entry-icon link-table-list-entry-iconLink',
                title  : Entry.link,
                events : {
                    click: function () {
                        console.log(Entry.link)
                    }
                }
            }).inject(LiElm, 'top');

            // show calls buttons
            new Element('span', {
                'class': 'btn btn-secondary btn-outline btn-inline link-table-list-entry-content-calls-button',
                html   : 'anzeigen',
                title  : 'Aufrufe anzeigen',
                events : {
                    click: function () {
                        console.log('Aufruf-Tabelle anzeigen')
                    }
                }
            }).inject(LiElm.getElement('.link-table-list-entry-content-calls-container'));

            // show password link details
            new Element('span', {
                'class': 'fa fa-angle-double-down link-table-list-entry-icon link-table-list-entry-iconDetails',
                title  : 'Link details',
                events : {
                    click: function () {
                        console.log('Mehr Details anzeigen')
                    }
                }
            }).inject(LiElm);
        }
    });
});