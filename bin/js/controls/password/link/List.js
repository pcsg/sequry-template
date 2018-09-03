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
    'qui/controls/windows/Confirm',

    'package/sequry/template/bin/js/controls/utils/InputButtons',
    'package/sequry/core/bin/Actors',
    'package/sequry/core/bin/Passwords',
    'package/sequry/template/bin/js/controls/password/link/Create',
    'package/sequry/template/bin/js/controls/panels/Panel',

    'text!package/sequry/template/bin/js/controls/password/link/List.Entry.html',
    'text!package/sequry/template/bin/js/controls/password/link/List.Entry.Details.html',
    'text!package/sequry/template/bin/js/controls/password/link/List.Calls.html',
    'text!package/sequry/template/bin/js/controls/password/link/List.View.html',
    'css!package/sequry/template/bin/js/controls/password/link/List.css'

], function (
    QUI, QUIControl, QUILoader, Mustache, QUIAjax, QUILocale, QUIConfirm,
    InputButtons,
    Actors,
    Passwords,
    LinkCreate,
    Panel,
    templateEntry,
    templateDetails,
    templateCalls,
    templateViews
) {
    "use strict";

    var lg     = 'sequry/template',
        lgCore = 'sequry/core';
    var UrlButtonParser = new InputButtons();


    return new Class({

        Extends: QUIControl,
        Type   : 'package/sequry/template/bin/js/controls/password/link/List',

        Binds: [
            '$onInject',
            '$listRefresh',
            'createDetails'
        ],

        options: {
            passwordId   : false, //password id
            passwordTitle: false, //password title
            showInactive : false, // show inactive links
            sortOn       : 'id',
            sortBy       : 'DESC',
            perPage      : 1000, // todo michael - später pagination einbauen
            page         : 1
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
                        self.openCreateLinkPanel();
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

            // todo Sort functionality
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

                // no share link data
                if (entries.length === 0) {
                    var noEntryTitle = QUILocale.get(lg, 'sequry.panel.linkList.noEntry.title'),
                        noEntryDesc  = QUILocale.get(lg, 'sequry.panel.linkList.noEntry.desc');

                    new Element('li', {
                        'class': 'link-table-list-warning sequry-alert-warning',
                        html   : '<span class="header-title">' + noEntryTitle + '</span>' +
                            '<p>' + noEntryDesc + '</p>'
                    }).inject(self.$ListElm);

                    self.Loader.hide();
                    return;
                }

                for (var i = 0, len = entries.length; i < len; i++) {
                    self.createEntry(entries[i]);
                }
            }, function () {
                // todo michael Wenn keine Share-Seite, muss hier eine Meldung kommen statt Panel direkt zu schließen
                self.fireEvent('close', [self]);
            });
        },

        createEntry: function (Entry) {
            var self = this;
            var maxCalls = '';

            if (Entry.maxCalls) {
                maxCalls = ' / ' + Entry.maxCalls;
            }

            var LiElm = new Element('li', {
                'class'      : 'link-table-list-entry',
                html         : Mustache.render(templateEntry, {
                    'validUntil'     : QUILocale.get(lg, 'sequry.panel.linkList.validUntil.label'),
                    'validUntilValue': Entry.validUntil ? Entry.validUntil : 'Ohne Zeitlimit',
                    'calls'          : QUILocale.get(lg, 'sequry.panel.linkList.calls.label'),
                    'callCount'      : Entry.callCount,
                    'maxCalls'       : maxCalls
                }),
                'data-active': Entry.active
            });

            LiElm.inject(this.$ListElm);

            // password date expired?
            if (Entry.validUntil !== false) {
                var ExpireDate = new Date(Entry.validUntil);

                if (this.CurDate > ExpireDate) {
                    LiElm.getElement(
                        '.link-table-list-entry-content-value.password-validUntil'
                    ).addClass('date-expired')
                }
            }

            // max calls reached?
            if (Entry.maxCalls && Entry.callCount >= Entry.maxCalls) {
                LiElm.getElement(
                    '.link-table-list-entry-content-value.password-calls'
                ).addClass('max-calls-reached')
            }

            // link button
            var LinkButton = new Element('span', {
                'class'   : 'fa fa-external-link link-table-list-entry-icon link-table-list-entry-iconLink',
                title     : QUILocale.get(lg, 'sequry.panel.linkList.openLink.title'),
                'data-url': Entry.link
            }).inject(LiElm, 'top');

            if (Entry.active) {
                LinkButton.addEvent(
                    'click',
                    function () {
                        self.showUrl(Entry.link)
                    }
                )
            }

            // show calls buttons
            new Element('span', {
                'class': 'btn btn-secondary btn-outline btn-inline link-table-list-entry-content-calls-button',
                html   : QUILocale.get(lg, 'sequry.panel.linkList.callsBtn.label'),
                title  : QUILocale.get(lg, 'sequry.panel.linkList.callsBtn.title'),
                events : {
                    click: function () {
                        this.showCalls(Entry.calls);
                    }.bind(this)
                }
            }).inject(LiElm.getElement('.link-table-list-entry-content-calls-container'));

            // show password link details
            new Element('span', {
                'class'    : 'fa fa-angle-double-down link-table-list-entry-icon link-table-list-entry-iconDetails',
                title      : QUILocale.get(lg, 'sequry.panel.linkList.detailsBtn.title'),
                'data-open': 'false',
                events     : {
                    click: function () {
                        this.toggleDetails(event, LiElm, {
                            active        : Entry.active,
                            id            : Entry.id,
                            password      : Entry.password,
                            createDate    : Entry.createDate,
                            createUserName: Entry.createUserName,
                            createUserId  : Entry.createUserId,
                            passwordOwner : Entry.passwordOwner,
                            securityClass : Entry.securityClass
                        })
                    }.bind(this)
                }
            }).inject(LiElm);
        },

        toggleDetails: function (event, LiElm, params) {

            var Button = event.target,
                open   = Button.getProperty('data-open');

            if (open === 'true') {

                var Details = LiElm.getElement('.link-table-list-entry-details');

                moofx(Details).animate({
                    height: 0
                }, {
                    duration: 150,
                    callback: function () {
                        Details.destroy();
                    }
                });

                Button.setProperty('data-open', false);
                Button.removeClass('fa-angle-double-up');
                Button.addClass('fa-angle-double-down');
                return;
            }


            this.createDetails(LiElm, params).then(function (Details) {
                var DetailsInner = Details.getElement('.link-table-list-entry-details-inner');
                Details.setStyle(
                    'height', DetailsInner.getSize().y
                );
            });

            Button.setProperty('data-open', true);
            Button.removeClass('fa-angle-double-down');
            Button.addClass('fa-angle-double-up');
        },

        createDetails: function (LiElm, params) {
            var self         = this,
                placeholders = {
                    idLabel           : QUILocale.get(lg, 'sequry.panel.linkList.details.id.label'),
                    id                : params.id,
                    pinLabel          : QUILocale.get(lg, 'sequry.panel.linkList.details.pin.label'),
                    pinIcon           : params.password ? 'fa fa-check' : 'fa fa-remove',
                    createDateLabel   : QUILocale.get(lg, 'sequry.panel.linkList.details.createDate.label'),
                    createDate        : params.createDate,
                    createUserLabel   : QUILocale.get(lg, 'sequry.panel.linkList.details.createUser.label'),
                    createUserName    : params.createUserName,
                    createUserId      : params.createUserId,
                    passwordOwnerLabel: QUILocale.get(lg, 'sequry.panel.linkList.details.passwordOwner.label'),
                    passwordOwner     : params.passwordOwner,
                    securityClassLabel: QUILocale.get(lg, 'sequry.panel.linkList.details.securityClass.label'),
                    securityClass     : params.securityClass
                };

            return new Promise(function (resolve) {
                var Details = new Element('div', {
                    'class': 'link-table-list-entry-details',
                    styles : {
                        height: 0
                    },
                    html   : Mustache.render(templateDetails, placeholders)
                }).inject(LiElm);

                var DisableLinkBtn = new Element('span', {
                    'class': 'fa fa-trash-o link-table-list-entry-icon'
                });

                if (params.active) {
                    DisableLinkBtn.addEvent('click', function () {
                        self.disableLink(params.id);
                    })
                }

                DisableLinkBtn.inject(
                    Details.getElement('.link-table-list-entry-details-inner-right')
                );

                resolve(Details)
            })
        },

        /**
         * Disable link (creates QUI Popup)
         *
         * @param linkId
         */
        disableLink: function (linkId) {
            var self      = this,
                title     = QUILocale.get(lg, 'sequry.customPopup.confirm.disableLink.title'),
                content   = QUILocale.get(lg, 'sequry.customPopup.confirm.disableLink.content', {
                    linkId: linkId
                }),
                btnOk     = QUILocale.get(lg, 'sequry.customPopup.confirm.button.ok'),
                btnCancel = QUILocale.get(lg, 'sequry.customPopup.confirm.button.cancel');

            var confirmContent = '<span class="fa fa-remove popup-icon"></span>';
            confirmContent += '<span class="popup-title">' + title + '</span>';
            confirmContent += content;

            new QUIConfirm({
                'class'           : 'sequry-customPopup',
                maxWidth          : 400, // please note extra styling in style.css
                maxHeight         : 340,
                backgroundClosable: true,
                title             : false,
                titleCloseButton  : false,
                icon              : false,
                texticon          : false,
                content           : confirmContent,
                ok_button         : {
                    text     : btnOk,
                    textimage: false
                },
                cancel_button     : {
                    text     : btnCancel,
                    textimage: false
                },
                events            : {
                    onSubmit: function (Confirm) {
                        Confirm.Loader.show();

                        Passwords.deactivateLink(linkId).then(function (success) {
                            if (success) {
                                Confirm.close();
                                self.$listRefresh();
                                return;
                            }

                            Confirm.Loader.hide();
                        }, function () {
                            Confirm.Loader.hide();
                        });
                    }
                }
            }).open();

        },

        showUrl: function (url) {
            new QUIConfirm({
                'class'           : 'sequry-customPopup password-link-view-dialog',
                maxWidth          : 400, // please note extra styling in style.css
                maxHeight         : 380,
                background        : false,
                backgroundClosable: true,
                title             : false,
                titleCloseButton  : false,
                icon              : false,
                texticon          : false,
                ok_button         : false,
                cancel_button     : {
                    text     : QUILocale.get(lg, 'sequry.panel.button.close'),
                    textimage: false
                },
                events            : {
                    onOpen: function (Confirm) {
                        Confirm.setContent(Mustache.render(templateViews, {
                            title: QUILocale.get(lg, 'sequry.panel.linkList.openLink.popup.title'),
                            desc : QUILocale.get(lg, 'sequry.panel.linkList.openLink.popup.desc'),
                            url  : url
                        }));

                        /*var UrlInput = Confirm.getContent().getElement(
                            'input'
                        );

                        UrlInput.addEvent('focus', function (event) {
                            event.target.select();
                        });

                        UrlInput.select();*/

                        UrlButtonParser.parse(Confirm.getContent());
                    }
                }
            }).open();
        },

        /**
         * Show password calls.
         * Create panel and inject the list with calls.
         *
         * @param calls
         */
        showCalls: function (calls) {
            var pwTitle = this.getAttribute('passwordTitle');

            var List = new Element('ul', {
                'class': 'link-table-list'
            });

            var callsLen = calls.length;

            // no calls
            if (calls.length === 0) {
                var noEntryTitle = QUILocale.get(lg, 'sequry.panel.callsList.noEntry.title'),
                    noEntryDesc  = QUILocale.get(lg, 'sequry.panel.callsList.noEntry.desc');

                new Element('li', {
                    'class': 'link-table-list-warning sequry-alert-warning',
                    html   : '<span class="header-title">' + noEntryTitle + '</span>' +
                        '<p>' + noEntryDesc + '</p>',
                }).inject(List);
            }

            for (var i = 0; i < callsLen; i++) {
                var Entry = calls[i];

                new Element('li', {
                    'class': 'link-table-list-entry',
                    styles : {
                        padding: '5px 20px'
                    },
                    html   : Mustache.render(templateCalls, {
                        date       : Entry.date,
                        REMOTE_ADDR: Entry.REMOTE_ADDR
                    })
                }).inject(List);
            }

            var PanelCalls = new Panel({
                title                  : QUILocale.get(lg, 'sequry.panel.callsList.title'),
                iconHeaderButtonFaClass: '',
                subPanel               : true,
                events                 : {
                    onOpen: function (Panel) {
                        List.inject(Panel.getContent());
                    }
                }
            });

            PanelCalls.setTitle(QUILocale.get(lg, 'sequry.panel.callsList.title'));

            if (pwTitle) {
                PanelCalls.setSubtitle(pwTitle);
            }

            PanelCalls.open()
        },

        openCreateLinkPanel: function () {
            var self = this;
            var LinkCreateControl = new LinkCreate({
                passwordId: this.getAttribute('passwordId')
            });

            var PanelCreateLink = new Panel({
                title       : QUILocale.get(lg, 'sequry.panel.linkList.createLink.title'),
                subTitle    : this.getAttribute('passwordTitle'),
                actionButton: QUILocale.get(lg, 'sequry.panel.linkList.createLink.actionLink'),
                subPanel    : true,
                events      : {
                    onSubmit: function () {
                        LinkCreateControl.submit().then(function () {
                            self.$listRefresh();
                            PanelCreateLink.close();
                        });
                    }
                }
            });

            LinkCreateControl.inject(PanelCreateLink.getContent());

            PanelCreateLink.open();
        }
    });
});