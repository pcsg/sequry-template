/**
 * Select actors for a SecurityClass via Grid
 *
 * @module package/sequry/core/bin/controls/actors/SelectTable
 *
 * @event onSubmit [selectedIds, actorType, this]
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
    'css!package/sequry/template/bin/js/controls/actors/SelectTable.Entry.css'

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
            'submit',
            '$listRefresh',
            '$setGridData',
            'resize',
            'refresh',
            '$onTypeBtnClick',
            '$switchActorType'
        ],

        options: {
            info             : '',        // info text that is shown above the table
            multiselect      : false,     // can select multiple actors
            securityClassIds : [],     // security class ids the actors have to be eligible for
            filterActorIds   : [],        // IDs of actors that are filtered from list (entries must have
                                          // prefix "u" (user) or "g" (group)
            actorType        : 'all',     // can be "all", "users" or "groups"
            showEligibleOnly : false,      // show eligible only or all
            selectedActorType: 'users'   // pre-selected actor type
        },

        initialize: function (options) {
            this.parent(options);

            this.setAttributes({
                backgroundClosable: true,
                closeButton       : true,
                titleCloseButton  : true,
                maxWidth          : 500
            });

            this.addEvents({
                onInject: this.$onInject
            });

            this.Loader = new QUILoader();
            this.$Grid = null;
            this.$GridParent = null;
            this.$actorType = 'users';
            this.$search = false;
            this.$SecurityClass = null;
            this.$SearchInput = null;
            this.$eligibleOnly = options.showEligibleOnly || false;
            this.$InfoElm = null;
            this.$List = null;
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

            this.$List = new Element('ul', {
                'class': 'select-table-list'
            }).inject(this.$Elm);


            /*this.$Elm.set(
                'html',
                '<div class="pcsg-gpm-actors-selecttable-grid"></div>'
            );

            this.$GridParent = self.$Elm.getElement(
                '.pcsg-gpm-actors-selecttable-grid'
            );*/

            this.Loader.show();

            var securityClassIds = this.getAttribute('securityClassIds');
            var promises = [];

            for (var i = 0, len = securityClassIds.length; i < len; i++) {
                promises.push(Authentication.getSecurityClassInfo(securityClassIds[i]));
            }

            Promise.all(promises).then(function (securityClasses) {

                // content
                var buttons = [];
                var actorType = self.getAttribute('actorType');

                var UsersBtn = {
                    name  : 'users',
                    icon  : 'fa fa-user',
                    events: {
                        onClick: self.$onTypeBtnClick
                    }
                };

                var GroupsBtn = {
                    name  : 'groups',
                    icon  : 'fa fa-users',
                    events: {
                        onClick: self.$onTypeBtnClick
                    }
                };

                switch (actorType) {
                    case 'users':
                        buttons.push(UsersBtn);
                        break;

                    case 'groups':
                        buttons.push(GroupsBtn);
                        break;

                    default:
                        buttons.push(UsersBtn);
                        buttons.push(GroupsBtn);
                }

                buttons.push({
                    name     : 'showeligibleonly',
                    text     : QUILocale.get(lgCore, 'controls.actors.selecttable.tbl.btn.showeligibleonly'),
                    textimage: 'fa fa-check-circle-o',
                    events   : {
                        onClick: function () {
                            self.$eligibleOnly = !self.$eligibleOnly;
                            self.refresh();
                        }
                    }
                });


                var securityClassTitles = [];

                for (i = 0, len = securityClasses.length; i < len; i++) {
                    securityClassTitles.push(securityClasses[i].title);
                }

                new Element('p', {
                    html: QUILocale.get(lgCore, 'controls.actors.selecttable.tbl.header.notice', {
                        securityClassTitles: securityClassTitles.join(' / ')
                    })
                }).inject(self.$InfoElm)
                self.$listRefresh();

                return;

                self.$Grid = new Grid(self.$GridParent, {
                    buttons          : buttons,
                    pagination       : true,
                    selectable       : true,
                    serverSort       : true,
                    multipleSelection: self.getAttribute('multiselect'),
                    columnModel      : [
                        {
                            header   : QUILocale.get(lgCore, 'controls.actors.selecttable.tbl.header.id'),
                            dataIndex: 'id',
                            dataType : 'integer',
                            width    : 100
                        }, {
                            header   : QUILocale.get(lgCore, 'controls.actors.selecttable.tbl.header.name'),
                            dataIndex: 'name',
                            dataType : 'string',
                            width    : 200
                        }, {
                            header   : QUILocale.get(lgCore, 'controls.actors.selecttable.tbl.header.notice', {
                                securityClassTitles: securityClassTitles.join(' / ')
                            }),
                            dataIndex: 'notice',
                            dataType : 'node',
                            width    : 500
                        }, {
                            dataIndex: 'eligible',
                            dataType : 'boolean',
                            hidden   : true
                        }
                    ]
                });

                // add search input
                var ButtonBarElm = self.$Grid.getElm().getElement('.tDiv');

                self.$SearchInput = new Element('input', {
                    'class'    : 'pcsg-gpm-actors-selecttable-searchinput',
                    placeholder: QUILocale.get(lgCore,
                        'controls.actors.selecttable.search.input.placeholder'
                    ),
                    type       : 'search'
                }).inject(ButtonBarElm);

                self.$SearchInput.addEventListener('search', function (event) {
                    var Input = event.target;
                    self.$search = Input.value.trim();
                    self.refresh();
                });

                self.$Grid.addEvents({
                    onDblClick: function () {
                        if (!self.$Grid.getSelectedData()[0].eligible) {
                            return;
                        }

                        self.fireEvent('submit', [
                            self.getSelectedIds(), self.$actorType, self
                        ]);
                    },
                    onRefresh : self.$listRefresh
                });

                var TableButtons = self.$Grid.getAttribute('buttons');

                if (actorType === 'all' || actorType === 'users') {
                    self.$actorType = 'users';
                    TableButtons.users.setActive();
                } else {
                    self.$actorType = 'groups';
                    TableButtons.groups.setActive();
                }

                // info
                var info = self.getAttribute('info');

                if (info) {
                    self.$InfoElm = new Element('p', {
                        'class': 'pcsg-gpm-actors-selecttable-info',
                        html   : info
                    }).inject(self.$GridParent, 'top');
                }

                self.resize();
                //self.refresh();

                self.$switchActorType(self.getAttribute('selectedActorType'));
                self.$SearchInput.focus();
            });
        },

        /**
         * Event: onClick (type switch buttons)
         *
         * @param {Object} Btn - qui/controls/buttons/Button
         */
        $onTypeBtnClick: function (Btn) {
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
            this.$SearchInput.value = '';
            this.$SearchInput.focus();

            var TableButtons = this.$Grid.getAttribute('buttons');

            if (actorType === 'users') {
                if (TableButtons.groups) {
                    TableButtons.groups.setNormal();
                }
            } else {
                if (TableButtons.users) {
                    TableButtons.users.setNormal();
                }
            }

            this.$actorType = actorType;
            this.refresh();
        },

        /**
         * Refresh data
         */
        refresh: function () {
            this.$Grid.refresh();
        },

        /**
         * Resize control
         */
        resize: function () {
            if (this.$Grid && this.$GridParent) {
                var y = this.$GridParent.getSize().y;

                if (this.$InfoElm) {
                    y -= this.$InfoElm.getSize().y + parseInt(this.$InfoElm.getStyle('margin-bottom'));
                }

                this.$Grid.setHeight(y);
                this.$Grid.resize();
            }
        },

        /**
         * Refresh Grid
         *
         */
        $listRefresh: function () {

            var self = this;

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

            console.log(this.$actorType)

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
                        click: this.changeStatus
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
        changeStatus: function (event) {
            var Target = event.target;

            if (Target.nodeName !== 'LI') {
                Target = Target.getParent('li');
            }

            // on / off
            var status   = Target.getProperty('data-select-status'),
                eligible = Target.getProperty('data-eligible'),
                IconElm  = Target.getElement('.select-table-list-entry-icon-checkbox .fa');

            if (eligible === 'false') {
                return;
            }

            if (status === 'on') {
                Target.setProperty('data-select-status', 'off');
                Target.addClass('selected');

                IconElm.removeClass('fa-check-square-o');
                IconElm.addClass('fa-square-o');

                return;
            }

            Target.setProperty('data-select-status', 'on');
            Target.removeClass('selected');

            IconElm.removeClass('fa-square-o');
            IconElm.addClass('fa-check-square-o');
        },

        /**
         * Set user data to grid
         * todo kann gelöscht werden
         *
         * @param {Object} GridData
         */
        $setGridData: function (GridData) {
            for (var i = 0, len = GridData.data.length; i < len; i++) {
                var Row = GridData.data[i];

                if (Row.eligible) {
                    Row.notice = new Element('div', {
                        'class': 'pcsg-gpm-actors-selecttable-eligibility',
                        html   : '<span class="pcsg-gpm-actors-selecttable-eligible">' +
                            QUILocale.get(lgCore,
                                'controls.actors.selecttable.tbl.eligible'
                            ) + '</span>'
                    });
                } else {
                    var reasonText;

                    if (this.$actorType === 'users') {
                        reasonText = QUILocale.get(lgCore,
                            'controls.actors.selecttable.tbl.not.eligible.user'
                        );
                    } else {
                        reasonText = QUILocale.get(lgCore,
                            'controls.actors.selecttable.tbl.not.eligible.group'
                        );
                    }

                    Row.notice = new Element('div', {
                        'class': 'pcsg-gpm-actors-selecttable-eligibility',
                        html   : '<span class="pcsg-gpm-actors-selecttable-noteligible">' +
                            QUILocale.get(lgCore,
                                'controls.actors.selecttable.tbl.not.eligible'
                            ) + '</span>' +
                            '<span>' + reasonText + '</span>'
                    });
                }
            }

            this.$Grid.setData(GridData);

            var TableButtons = this.$Grid.getAttribute('buttons');
            TableButtons[this.$actorType].setActive();

            if (this.$eligibleOnly) {
                TableButtons.showeligibleonly.setActive();
            } else {
                TableButtons.showeligibleonly.setNormal();
            }
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

            nodeElms.each(function(nodeElm){
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
