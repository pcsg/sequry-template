/**
 * Select actors for a SecurityClass via Grid
 *
 * @module package/sequry/core/bin/controls/actors/SelectTable
 * @author www.pcsg.de (Michael Danielczok)
 */
define('package/sequry/template/bin/js/controls/actors/SelectTable', [

    'qui/controls/Control',
    'qui/controls/loader/Loader',
    'Locale',
    'Mustache',

    'controls/grid/Grid',
    'package/sequry/core/bin/Actors',
    'package/sequry/core/bin/Authentication',

    'text!package/sequry/template/bin/js/controls/actors/SelectTable.Entry.html',
    'css!package/sequry/template/bin/js/controls/actors/SelectTable.Entry.css',
    'css!package/sequry/template/bin/js/controls/actors/SelectTable.css'

], function (QUIControl, QUILoader, QUILocale, Mustache,
    Grid,
    Actors,
    Authentication,
    template
) {
    "use strict";

    var lg = 'sequry/template';
    var lgCore = 'sequry/core';

    return new Class({

        Extends: QUIControl,
        Type   : 'package/sequry/template/bin/js/controls/actors/SelectTable',

        Binds: [
            '$onInject',
            '$onCreate',
            '$listRefresh',
            'refresh',
            '$onTypeBtnClick',
            '$switchActorType',
            'changeSelectStatus'
        ],

        options: {
            info              : '',        // info text that is shown above the table
            multiselect       : false,     // can select multiple actors
            securityClassIds  : [],     // security class ids the actors have to be eligible for
            filterActorIds    : [],        // IDs of actors that are filtered from list (entries must have
                                           // prefix "u" (user) or "g" (group)
            actorType         : 'all',     // can be "all", "users" or "groups"
            showEligibleOnly  : false,      // show eligible only or all
            selectedActorType : 'users'   // pre-selected actor type
        },

        initialize: function (options) {
            this.parent(options);

            this.Loader = new QUILoader();
            this.$search = false;
            this.$SearchInput = null;
            this.$eligibleOnly = options.showEligibleOnly || true;
            this.$InfoElm = null;
            this.$List = null;
            this.$actorType = this.getAttribute('actorType');
            this.createFilterButton = false;

            if (this.getAttribute('actorType') === 'all') {
                this.createFilterButton = true;
                this.$actorType = this.getAttribute('selectedActorType');
            }

            this.addEvents({
                onInject: this.$onInject
            });
        },

        /**
         * Event: onCreate
         */
        $onInject: function () {
            var self = this;

            this.Loader.inject(this.$Elm);

            this.$Elm.addClass('select-table');

            // info
            var info = self.getAttribute('info');

            if (info) {
                this.$InfoElm = new Element('p', {
                    'class': 'select-table-info',
                    html   : info
                }).inject(this.$Elm);
            }

            var ButtonBarElm = new Element('div', {
                'class': 'select-table-action'
            }).inject(this.$Elm);

            // Create user / groups button only if actorType is "all"
            if (this.createFilterButton) {
                // users button
                this.ButtonUser = new Element('button', {
                    'class': 'btn btn-secondary btn-outline btn-small select-table-btn-users',
                    html   : QUILocale.get(
                        lg, 'sequry.panel.select.actors.selecttable.filter.buttonUser'
                    ),
                    name   : 'users',
                    events : {
                        click: self.$onTypeBtnClick
                    }
                });

                // groups button
                this.ButtonGroup = new Element('button', {
                    'class': 'btn btn-secondary btn-outline btn-small select-table-btn-groups',
                    html   : QUILocale.get(
                        lg, 'sequry.panel.select.actors.selecttable.filter.buttonGroups'
                    ),
                    name   : 'groups',
                    events : {
                        click: self.$onTypeBtnClick
                    }
                });

                // set button user / group active
                switch (this.getAttribute('selectedActorType')) {
                    case 'groups':
                        this.ButtonGroup.removeClass('btn-outline');
                        break;
                    default:
                        this.ButtonUser.removeClass('btn-outline');
                }

                this.ButtonUser.inject(ButtonBarElm);
                this.ButtonGroup.inject(ButtonBarElm);
            }

            // eligibile button
            var eligibleButtonIcon = '<span class="fa fa-check-square-o"></span>';

            if (!this.$eligibleOnly) {
                eligibleButtonIcon = '<span class="fa fa-square-o"></span>';
            }

            new Element('button', {
                'class'        : 'btn btn-secondary btn-outline btn-small select-table-btn-eligibleOnly',
                html           : eligibleButtonIcon + QUILocale.get(
                    lg, 'sequry.panel.select.actors.selecttable.filter.buttonEligibleOnly'
                ),
                'data-selected': this.$eligibleOnly,
                events         : {
                    click: function () {
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

                        self.$eligibleOnly = !self.$eligibleOnly;
                        self.$listRefresh();
                    }
                }
            }).inject(ButtonBarElm);

            // search
            this.$SearchInput = new Element('input', {
                'class'    : 'select-table-search',
                placeholder: QUILocale.get(lgCore,
                    'controls.actors.selecttable.search.input.placeholder'
                ),
                type       : 'search'
            }).inject(ButtonBarElm);

            this.$SearchInput.addEventListener('search', function (event) {
                var Input = event.target;
                self.$search = Input.value.trim();
                self.$listRefresh();
            });

            this.$List = new Element('ul', {
                'class': 'select-table-list'
            }).inject(this.$Elm);


            this.Loader.show();

            var securityClassIds = this.getAttribute('securityClassIds');
            var promises = [];

            for (var i = 0, len = securityClassIds.length; i < len; i++) {
                promises.push(Authentication.getSecurityClassInfo(securityClassIds[i]));
            }

            Promise.all(promises).then(function (securityClasses) {

                // content
                var securityClassTitles = [];

                for (i = 0, len = securityClasses.length; i < len; i++) {
                    securityClassTitles.push(securityClasses[i].title);
                }

                new Element('p', {
                    html: QUILocale.get(lgCore, 'controls.actors.selecttable.tbl.header.notice', {
                        securityClassTitles: securityClassTitles.join(' / ')
                    })
                }).inject(self.$InfoElm);

                self.$listRefresh();
            });
        },

        /**
         * Event: onClick (type switch buttons)
         *
         * @param event
         */
        $onTypeBtnClick: function (event) {
            var Btn = event.target;

            if (Btn.nodeName !== 'BUTTON') {
                Btn = Btn.getParent('button');
            }

            var type = Btn.getAttribute('name');

            if (type === this.$actorType) {
                return;
            }

            this.$switchActorType(type);
        },

        /**
         * Switch shown actor type ("users" / "groups")
         *
         * @param {String} actorType
         */
        $switchActorType: function (actorType) {
            this.$search = false;
//            this.$SearchInput.value = '';
//            this.$SearchInput.focus();

            if (actorType === 'users') {
                this.ButtonUser.removeClass('btn-outline');
                this.ButtonGroup.addClass('btn-outline');
            } else {
                this.ButtonUser.addClass('btn-outline');
                this.ButtonGroup.removeClass('btn-outline');
            }

            this.$actorType = actorType;
            this.$listRefresh();
        },

        /**
         * Refresh entry list
         */
        $listRefresh: function () {
            var self = this;
            this.$List.set('html', '');

            // todo @michael Irgendwann Sortierung integrieren.
            var SearchParams = {
                /*sortOn : Grid.getAttribute('sortOn'),
                sortBy : Grid.getAttribute('sortBy'),
                perPage: Grid.getAttribute('perPage'),
                page   : Grid.getAttribute('page')*/
            };

            /*switch (SearchParams.sortOn) {
                case 'name':
                    if (self.$actorType === 'users') {
                        SearchParams.sortOn = 'username';
                    }
                    break;

                case 'notice':
                    SearchParams.sortOn = false;
                    break;
            }*/

            if (this.$search) {
                SearchParams.search = this.$search;
            }

            SearchParams.eligibleOnly = this.$eligibleOnly;
            SearchParams.type = this.$actorType;
            SearchParams.securityClassIds = this.getAttribute('securityClassIds');
            SearchParams.filterActorIds = this.getAttribute('filterActorIds');

            this.Loader.show();

            Actors.search(SearchParams).then(function (ResultData) {
                self.Loader.hide();
                self.$renderEntries(ResultData);
            });
        },

        /**
         * Render one entry.
         *
         * @param Entries
         */
        $renderEntries (Entries) {
            for (var i = 0, len = Entries.data.length; i < len; i++) {
                var Data                = Entries.data[i],
                    icon                = 'fa fa-user',
                    securityClassLabel  = '',
                    securityClassNotice = '',
                    eligible            = true;

                if (this.$actorType === 'users') {
                    icon = 'fa fa-user'
                } else {
                    icon = 'fa fa-users'
                }

                // user / group eligible?
                if (Data.eligible) {
                    securityClassLabel = QUILocale.get(lg,
                        'sequry.panel.select.actors.selecttable.tbl.eligible'
                    );
                } else {
                    eligible = false;

                    if (this.$actorType === 'users') {
                        securityClassNotice = QUILocale.get(lg,
                            'sequry.panel.select.actors.selecttable.tbl.not.eligible.user'
                        );
                    } else {
                        securityClassNotice = QUILocale.get(lg,
                            'sequry.panel.select.actors.selecttable.tbl.not.eligible.group'
                        );
                    }

                    securityClassLabel = QUILocale.get(lg,
                        'sequry.panel.select.actors.selecttable.tbl.not.eligible'
                    );
                }

                var liElm = new Element('li', {
                    'class'             : 'select-table-list-entry',
                    html                : Mustache.render(template, {
                        icon               : icon,
                        name               : Data.name,
                        id                 : Data.id,
                        securityClassLabel : securityClassLabel,
                        securityClassNotice: securityClassNotice
                    }),
                    'data-select-status': 'off',
                    'data-id'           : Data.id,
                    'data-eligible'     : Data.eligible,
                    events              : {
                        click: this.changeSelectStatus
                    }
                });

                if (!eligible) {
                    liElm.addClass('not-eligible')
                }

                liElm.inject(this.$List)
            }
        },

        /**
         * Change entry status (on / off)
         *
         * @param event
         */
        changeSelectStatus: function (event) {
            var Target = event.target;

            if (Target.nodeName !== 'LI') {
                Target = Target.getParent('li');
            }

            // on / off
            var status   = Target.getProperty('data-select-status'),
                eligible = Target.getProperty('data-eligible');

            if (eligible === 'false') {
                return;
            }

            if (status === 'on') {
                this.deselectItem(Target);
                return;
            }

            this.selectItem(Target);
        },

        /**
         * Select item from list
         *
         * @param Elm - HTMLNode (li)
         */
        selectItem: function (Elm) {
            if (!this.getAttribute('multiselect')) {
                this.deselectAllItems();
            }

            Elm.setProperty('data-select-status', 'on');
            Elm.addClass('selected');

            var Icon = Elm.getElement('.select-table-list-entry-icon-checkbox .fa');

            Icon.removeClass('fa-square-o');
            Icon.addClass('fa-check-square-o');
        },

        /**
         * Deselect item form list
         *
         * @param Elm - HTMLNode (li)
         */
        deselectItem: function (Elm) {
            Elm.setProperty('data-select-status', 'off');
            Elm.removeClass('selected');

            var Icon = Elm.getElement('.select-table-list-entry-icon-checkbox .fa');

            Icon.removeClass('fa-check-square-o');
            Icon.addClass('fa-square-o');
        },

        /**
         * Get all list items and deselect them
         */
        deselectAllItems: function () {
            var Entries = document.getElements('.select-table-list-entry');

            Entries.each(function (Entry) {
                this.deselectItem(Entry)
            }.bind(this));
        },

        /**
         * Get IDs of all selected actors
         *
         * @return {Array}
         */
        getSelectedIds: function () {
            var selectedIds = [];
            var selectedData = this.getSelectedData();


            for (var i = 0, len = selectedData.length; i < len; i++) {
                // ignore ineligible actors
                if (!selectedData[i].eligible) {
                    continue;
                }

                selectedIds.push(selectedData[i].id);
            }

            return selectedIds;
        },

        /**
         * Get data from selected entry.
         * Returns array of objects
         * {
         *     id : 8937485,
         *     eligible: "true"
         * }
         *
         * @returns {Array}
         */
        getSelectedData: function () {
            var nodeElms = this.$Elm.getElements('li[data-select-status="on"]'),
                data     = [];

            nodeElms.each(function (nodeElm) {
                data.push({
                    id      : nodeElm.getProperty('data-id'),
                    eligible: nodeElm.getProperty('data-eligible')
                });
            });

            return data;
        },

        /**
         * Get currently selected actor type
         *
         * @returns {string} - "users" / "groups"
         */
        getActorType: function () {
            return this.$actorType;
        }
    });
});
