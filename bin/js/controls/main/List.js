/**
 * Main list object. It shows passwords in form of a list.
 *
 * @module package/sequry/template/bin/js/controls/main/List
 */

define('package/sequry/template/bin/js/controls/main/List', [

    'qui/QUI',
    'qui/controls/Control',
    'qui/utils/Functions',
    'qui/utils/String',
    'qui/controls/loader/Loader',
    'Mustache',
    'Ajax',
    'Locale',

    'package/sequry/template/bin/js/classes/List',
    'package/sequry/template/bin/js/Password',
    'package/sequry/core/bin/Passwords',
    'package/sequry/template/bin/js/controls/panels/Panel',
    'package/sequry/template/bin/js/controls/panels/PasswordCreatePanel',
    'package/sequry/template/bin/js/controls/panels/PasswordSharePanel',
    'package/sequry/template/bin/js/controls/panels/PasswordLinkPanel',
    'package/sequry/template/bin/js/SequryUI',

    'text!package/sequry/template/bin/js/controls/main/List.html',
    'text!package/sequry/template/bin/js/controls/main/List.Entry.html',
    'css!package/sequry/template/bin/js/controls/main/List.css'

], function (
    QUI, QUIControl, QUIFunctionUtils, QUIStringUtils, QUILoader, Mustache, QUIAjax, QUILocale,
    ClassesList,
    Password,
    Passwords, // package/sequry/core/bin/Passwords
    Panel,
    PasswordCreatePanel,
    PasswordSharePanel,
    PasswordLinkPanel,
    SequryUI,
    template,
    listEntryTemplate
) {
    "use strict";

    var lg = 'sequry/template';

    return new Class({

        Extends: QUIControl,
        Type   : 'package/sequry/template/bin/js/controls/main/List',

        Binds: [
            '$onInject',
            'open',
            'edit',
            'addPassword',
            'changeFavorite',
            'showAll',
            'showFavorite'
        ],

        initialize: function (options) {
            this.parent(options);

            this.addEvents({
                onInject: this.$onInject
            });

            QUI.addEvent('onResize', function () {
                this.$onResize();
            }.bind(this));

            this.initSearchParams();

            this.Loader = new QUILoader();
            this.ListManager = new ClassesList();
            this.addButton = null;
            this.listContainer = null;
            this.MobileMenu = null;
            this.mobileBreakPoint = 768;
            this.MobileFilterNav = false; // mobile filter panel (filter, types, categories)
            this.isAnimating = false;
        },

        /**
         * Create the DOMNode element
         *
         * @returns {Element}
         */
        create: function () {
            this.$Elm = new Element('main', {
                'class'     : 'main',
                'data-quiid': this.getId(),
                'html'      : Mustache.render(template, {
                    headerTitle: QUILocale.get(lg, 'sequry.List.header.title'),
                    headerDesc : QUILocale.get(lg, 'sequry.List.header.desc'),
                    headerType : QUILocale.get(lg, 'sequry.List.header.type')
                })
            });

            return this.$Elm;
        },

        /**
         * event: on inject
         */
        $onInject: function () {
            this.listContainer = this.$Elm.getElement('.main-list-entries');
            this.addButton = this.$Elm.getElement('.button-add-password');

            // event add new password
            if (this.addButton) {
                this.addButton.addEvents({
                    click: this.addPassword
                });
            }

            // Global password list object
            SequryUI.PasswordList = this;

            this.Loader.inject(this.$Elm);
            this.Loader.show();

            this.ListParams = {
                sortOn : null,
                sortBy : 'ASC',
                perPage: 50,
                page   : 1, // current page,
                total  : 100
            };

            this.PaginationControl = null;

            this.$onResize();

            this.$renderEntries().then(function () {
                this.fireEvent('load', [this]);
            }.bind(this));
        },

        /**
         * event: on resize
         */
        $onResize: function () {
            if (QUI.getBodySize().x <= this.mobileBreakPoint) {
                this.createMobileMenu();
                return;
            }

            if (this.MobileMenu) {
                this.MobileMenu.destroy();
                this.MobileMenu = null;
            }
        },

        /**
         * create the mobile
         */
        createMobileMenu: function () {
            var self = this;

            if (this.MobileMenu) {
                return;
            }

            this.MobileMenu = new Element('div', {
                'class': 'mobile-menu'
            });

            // filter
            new Element('button', {
                'class': 'mobile-menu-button',
                html   : '<span class="fa fa-filter"></span><span class="mobile-menu-button-label">' +
                    QUILocale.get(lg, 'sequry.mobile.menu.filter') +
                    '</span>',
                events : {
                    click: function () {
                        if (!self.MobileFilterNav) {
                            self.MobileFilterNav = self.createMobileFilterNav()
                        }

                        self.MobileFilterNav.open();
                    }
                }
            }).inject(this.MobileMenu);

            // search
            new Element('button', {
                'class': 'mobile-menu-button',
                html   : '<span class="fa fa-search"></span><span class="mobile-menu-button-label">' +
                    QUILocale.get(lg, 'sequry.mobile.menu.search') +
                    '</span>',
                events : {
                    click: function () {
                        require(['package/sequry/template/bin/js/controls/components/Search'], function (Search) {
                            var SearchControl = new Search({
                                height    : 60,
                                iconBefore: 'fa fa-search',
                                iconAfter : 'fa fa-close',
                                events    : {
                                    onIconAfterSubmit: function () {
                                        moofx(SearchControl.$Elm).animate({
                                            transform: 'translateY(60px)',
                                            opacity  : 0
                                        }, {
                                            duration: 200,
                                            callback: function () {
                                                if (SearchControl.$Elm.getElement('input').value !== '') {
                                                    self.setSearchTerm('');
                                                    self.$listRefresh();
                                                }
                                                SearchControl.destroy();
                                            }
                                        })
                                    }
                                }
                            });

                            SearchControl.inject(document.getElement('body'));

                            SearchControl.$Elm.setStyles({
                                transform: 'translateY(60px)'
                            });

                            SearchControl.$Elm.addClass('sequry-search-mobile');

                            SearchControl.$Elm.getElement('input').focus();
                            moofx(SearchControl.$Elm).animate({
                                transform: 'translateY(0)'
                            }, {
                                duration: 200
                            })

                        })
                    }
                }
            }).inject(this.MobileMenu);

            // user
            new Element('button', {
                'class': 'mobile-menu-button',
                html   : '<span class="fa fa-user"></span><span class="mobile-menu-button-label">' +
                    QUILocale.get(lg, 'sequry.mobile.menu.user') +
                    '</span>',
                events : {
                    click: function () {
                        var UserPanel = self.createMobileUserNav();
                        UserPanel.open();

//                        alert(isTouchDevice())
//                        var UserIcon = document.getElement(
//                            '[data-qui="package/quiqqer/frontend-users/bin/frontend/controls/UserIcon"]'
//                        );
//
//                        if (!UserIcon) {
//                            return;
//                        }
//
//                        var Control = QUI.Controls.getById(UserIcon.get('data-quiid'));
//                        var Menu = Control.$Menu;
//                        var children = Menu.getChildren();
//
//                        var Select = new Element('select', {
//                            events: {
//                                change: function () {
//                                    console.log('##########');
//                                    alert(this.value);
//                                }
//                            },
//                            styles: {
//                                height  : '100%',
//                                left    : 0,
//                                opacity : 0,
//                                position: 'absolute',
//                                top     : 0,
//                                zIndex  : 2,
//                                width   : '100%'
//                            }
//                        }).inject(document.body);
//
//                        if (!('ontouchstart' in window)) {
//                            this.$Select.setStyle('zIndex', 1);
//                        }
//
//                        for (var i = 0, len = children.length; i < len; i++) {
//                            if (children[i].getType() !== 'qui/controls/contextmenu/Item') {
//                                continue;
//                            }
//
//                            new Element('option', {
//                                html : children[i].getAttribute('text'),
//                                value: children[i].getAttribute('value')
//                            }).inject(Select);
//                        }
//
//                        Select.click();
                    }
                }
            }).inject(this.MobileMenu);

            // add password
            new Element('button', {
                'class': 'mobile-menu-button highlight',// todo locale
                html   : '<span class="fa fa-plus"></span><span class="mobile-menu-button-label">' +
                    QUILocale.get(lg, 'sequry.mobile.menu.addPassword') +
                    '</span>',
                events : {
                    click: function () {
                        console.log("Passwort hinzufügen");
                        self.addPassword();
                    }
                }
            }).inject(this.MobileMenu);

            this.MobileMenu.setStyles({
                height   : 60,
                position : 'fixed',
                bottom   : 0,
                transform: 'translateY(60px)'
            });

            this.MobileMenu.inject(this.$Elm);

            moofx(this.MobileMenu).animate({
                transform: 'translateY(0)'
            }, {
                duration: 200
            })
        },

        /**
         * Refresh list
         */
        $listRefresh: function () {
            this.Loader.show();
//            console.log(this.$SearchParams)
            this.listContainer.set('html', '');
            this.$renderEntries();
        },

        /**
         * Render list HTML with passwords
         *
         * @return {Promise}
         */
        $renderEntries: function () {
            var self = this;


            return Passwords.getPasswords(
                Object.merge(this.$SearchParams, this.ListParams)
            ).then(function (response) {
                var entries = response.data;

                self.ListParams.total = response.total;
                self.createPagination();
                self.Loader.hide();

                entries.each(function (Entry) {
                    self.$renderEntry(Entry);
                })
            });
        },

        /**
         * Render single list element and inject it to the list container
         *
         * @param Entry (it contains password data)
         */
        $renderEntry: function (Entry) {
            var self = this;
            var favIconName = 'fa-star-o';

            // is password favorite?
            if (parseInt(Entry.favorite)) {
                favIconName = 'fa-star'
            }

            var Li = new Element('li', {
                'class'       : 'main-list-entry password-entry',
                'data-pwid'   : Entry.id,
                'data-pwTitle': Entry.title
            });

            // render html
            Li.set('html', Mustache.render(listEntryTemplate, {
                'favIconName': favIconName,
                'dataFavo'   : Entry.favorite,
                'headerTitle': QUILocale.get(lg, 'sequry.List.header.title'),
                'headerDesc' : QUILocale.get(lg, 'sequry.List.header.desc'),
                'headerType' : QUILocale.get(lg, 'sequry.List.header.type'),
                'title'      : Entry.title,
                'description': Entry.description,
                'dataType'   : Entry.dataType
            }));


            // action buttons
            var actionContainer = Li.getElement('.list-action');

            var BtnShare = new Element('span', {
                'class': 'fa fa-share-alt list-action-share'
            });

            var BtnLink = new Element('span', {
                'class': 'fa fa-link list-action-link'
            });

            var BtnEdit = new Element('span', {
                'class': 'fa fa-pencil list-action-edit'
            });

            if (Entry.isOwner) {
                if (Entry.canShare) {
                    BtnShare.addEvent('click', this.share);
                }

                BtnEdit.addEvent('click', this.edit);
            } else {
                this.setButtonInactive(BtnShare);
                this.setButtonInactive(BtnEdit);
            }

            if (Entry.canLink) {
                BtnLink.addEvent('click', this.link);
            } else {
                this.setButtonInactive(BtnLink);
            }

            BtnShare.inject(actionContainer);
            BtnLink.inject(actionContainer);
            BtnEdit.inject(actionContainer);

            // open event
            Li.addEvent('click', function () {
                self.open(Entry);
            });

            // change favorite
            Li.getElement('.list-favorite .fa').addEvent('click', self.changeFavorite);

            Li.inject(this.listContainer);
        },

        /**
         * Open password according to the password id
         *
         * @param Entry
         * @return {Promise}
         */
        open: function (Entry) {
            // prevent open password panel twice by double click if QUIBackground does not exist yet
            if (this.isAnimating) {
                return Promise.reject();
            }

            var self = this;
            this.isAnimating = true;

            return new Promise(function (resolve, reject) {
                require(['package/sequry/template/bin/js/controls/panels/PasswordPanel'], function (PasswordPanel) {
                    new PasswordPanel({
                        id     : Entry.id,
                        isOwner: Entry.isOwner,
                        events : {
                            onOpen: function () {
                                self.isAnimating = false;
                                resolve();
                            }
                        }
                    }).open();
                }, reject);
            });
        },

        /**
         * Open edit password panel
         *
         * @param event
         */
        edit: function (event) {
            event.stop();
            var self = this;
            var Target = event.target,
                pwId   = Target.getParent('.password-entry').getAttribute('data-pwid');

            new PasswordCreatePanel({
                passwordId: pwId,
                mode      : 'edit',
                events    : {
                    finish: function () {
                        self.$listRefresh();
                    }
                }
            }).open();
        },

        /**
         * Open share password panel
         *
         * @param event
         */
        share: function (event) {
            event.stop();

            var Target  = event.target,
                ListElm = Target.getParent('.password-entry'),
                pwId    = ListElm.getAttribute('data-pwid'),
                pwTitle = ListElm.getAttribute('data-pwTitle');

            new PasswordSharePanel({
                passwordId   : pwId,
                passwordTitle: pwTitle
            }).open();
        },

        /**
         * Open link password panel
         *
         * @param event
         */
        link: function (event) {
            event.stop();

            var Target  = event.target,
                ListElm = Target.getParent('.password-entry'),
                pwId    = ListElm.getAttribute('data-pwid'),
                pwTitle = ListElm.getAttribute('data-pwTitle');

            new PasswordLinkPanel({
                passwordId   : pwId,
                passwordTitle: pwTitle
            }).open();
        },

        /**
         * Open panel to create new password
         */
        addPassword: function () {
            var self = this;
            new PasswordCreatePanel({
                events: {
                    finish: function () {
                        self.$listRefresh();
                    }
                }
            }).open();
        },

        /**
         * Remove / add to favorite
         *
         * @param event
         */
        changeFavorite: function (event) {
            event.stop();

            this.Loader.show();

            var self = this,
                Elm  = event.target,
                favo = parseInt(Elm.getProperty('data-favo')),
                pwId = Elm.getParent('.main-list-entry').getProperty('data-pwid');

            this.ListManager.setFavoriteStatus(pwId, !favo).then(function (newStatus) {
                self.Loader.hide();

                newStatus = newStatus ? 1 : 0;
                Elm.setProperty('data-favo', newStatus);

                if (newStatus == true) {
                    Elm.removeClass('fa-star-o');
                    Elm.addClass('fa-star');
                    return;
                }

                Elm.removeClass('fa-star');
                Elm.addClass('fa-star-o');
            });
        },

        /**
         * Search params structure:
         *
         * searchParams: {
         *  "sortOn":null,
         *  "sortBy":"ASC",
         *  "perPage":100,
         *  "page":1,
         *  "search":{
         *      "searchterm":""
         *  },
         *  "categoryIds":["3"],
         *  "categoryIdsPrivate":false,
         *  "filters":{
         *      "filters":["favorites","new"],
         *      "types":[]
         *  }
         */
        initSearchParams: function () {
            this.$SearchParams = {
                search            : {},
                categoryIds       : false,
                categoryIdsPrivate: false,
                filters           : {
                    filters: [],
                    types  : []
                }
            };
        },

        setButtonInactive: function (Btn) {
            Btn.addEvent('click', function (event) {
                event.stop();
            });
            Btn.addClass('list-action-inactive');
        },

        /**
         * Show all passwords.
         * (initialise search params)
         */
        showAll: function () {
            this.initSearchParams();
            this.$listRefresh();
        },

        setFilters: function (type, name) {
            this.$SearchParams.filters[type] = name ? name.split() : false;
            this.$listRefresh();
        },

        setCategoryParam: function (catId) {
            this.$SearchParams.categoryIds = catId ? catId : false;
        },

        setCategoryPrivateParam: function (catId) {
            this.$SearchParams.categoryIdsPrivate = catId ? catId : false;
        },

        setSearchTerm: function (term) {
            this.$SearchParams.search.searchterm = term.trim();
        },

        /**
         * Create pagination
         **/
        createPagination: function () {
            var self = this;

//            this.ListParams.total = 500;


            this.ListManager.getPaginationHtml(
                this.ListParams.total,
                this.ListParams.perPage,
                this.ListParams.page
            ).then(function (html) {
//                console.log(html)
                var PaginationParent = false;

                // if mobile create pagination in filter panel (mobile)...
                if (QUI.getBodySize().x <= self.mobileBreakPoint) {
                    // ... but only if the panel exist
                    if (self.MobileFilterNav) {
                        PaginationParent = self.MobileFilterNav.$Elm.getElement(
                            '.main-list-pagination'
                        );
                    }
                } else {
                    // create pagination on the bottom of the list (desktop)
                    PaginationParent = self.$Elm.getElement('.main-list-pagination')
                }

                if (!PaginationParent) {
                    return;
                }

                PaginationParent.set('html', html);

                QUI.parse(PaginationParent).then(function () {
                    self.PaginationControl = QUI.Controls.getById(
                        PaginationParent.getElement('.quiqqer-pagination').get('data-quiid')
                    );

                    self.PaginationControl.addEvents({
                        onChange: function (Pagination, Sheet, Query) {

//                            console.log(Pagination)
//                            console.log(Sheet)
//                            console.log(Query)
                            self.ListParams.page = Query.page;
                            self.ListParams.perPage = Query.limit;
                            self.$listRefresh();
                        }
                    });
                })
            });

        },

        /**
         * Create mobile filter navigation
         *
         * @return {object} }QUIControl Panel package/sequry/template/bin/js/controls/panels/Panel
         */
        createMobileFilterNav: function () {
            var self = this;

            return new Panel({
                width                  : 300,
                title                  : QUILocale.get(lg, 'sequry.mobile.nav.header'),
                iconHeaderButton       : QUILocale.get(lg, 'sequry.panel.button.close'),
                iconHeaderButtonFaClass: 'fa fa-close',
                direction              : 'left',
                keepPanelOnClose       : true,
                isOwner                : true,
                events                 : {
                    onAfterCreate: function (PanelControl) {
                        var PanelElm = PanelControl.$Elm;
                        PanelElm.addClass('mobile-panel-filter-menu');
//                        PanelElm.getElement('.sidebar-panel-action-buttons').setStyle('display', 'none');

                        require(['package/sequry/template/bin/js/controls/components/Menu'], function (Menu) {
                            var FilterContainer = new Element('section', {
                                'class': 'mobile-sequry-filter-menu sequry-filter-menu'
                            });

                            new Menu().inject(FilterContainer);

                            FilterContainer.inject(PanelControl.getContent());
                        })
                    },

                    onOpenBegin: function (PanelControl) {
                        var PanelElm = PanelControl.$Elm;
                        var ActionBar = PanelElm.getElement('.sidebar-panel-action');
                        ActionBar.addClass('main-list-pagination');
                        ActionBar.set('html', self.createPagination());
                    },

                    onSubmitSecondary: function (PanelControl) {
                        PanelControl.close()
                    }
                }
            })
        },

        createMobileUserNav: function () {
            var self = this;

            return new Panel({
                width                  : 300,
                title                  : 'Benutzer', // todo locale
                iconHeaderButton       : QUILocale.get(lg, 'sequry.panel.button.close'),
                iconHeaderButtonFaClass: 'fa fa-close',
                direction              : 'left',
                isOwner                : true,
                events                 : {
                    onAfterCreate    : function (PanelControl) {
                        var PanelElm = PanelControl.$Elm,
                            Content  = PanelControl.getContent();
                        PanelElm.addClass('mobile-panel-user-menu');

                        var List = new Element('ul', {
                            'class': 'navigation'
                        }).inject(Content);

                        var ListElm = new Element('li', {
                            'class': 'navigation-entry'
                        }).inject(List);


                        // Button settings
                        var settingsIcon  = '<span class="navigation-entry-icon ' + 'fa fa-cog' + '"></span>',
                            settingsLabel = '<span class="navigation-entry-text">' + 'Einstellungen' + '</span>'; // todo locale

                        var ButtonSettings = new Element('a', {
                            'class': 'menu-button ',
                            html   : settingsIcon + settingsLabel
                        });

                        ButtonSettings.addEvent(
                            'click', function () {
                                PanelControl.setAttribute('keepBackground', true);

                                self.createMobileUserSettings(PanelControl.Background).then(function (Panelski) {
                                    Panelski.open().then(function () {
                                        PanelControl.close();
                                    });
                                });
                            }
                        );

                        ButtonSettings.inject(ListElm);

                        // Button logout
                        var logoutIcon  = '<span class="navigation-entry-icon ' + 'fa fa-sign-out' + '"></span>',
                            logoutLabel = '<span class="navigation-entry-text">' + 'Abmelden' + '</span>'; // todo locale

                        var ButtonLogout = new Element('a', {
                            'class': 'menu-button ',
                            html   : logoutIcon + logoutLabel
                        });

                        ButtonLogout.addEvent(
                            'click', function () {
                                require(['controls/users/LogoutWindow'], function (LogoutWindow) {
                                    new LogoutWindow().open();
                                });
                            }
                        );

                        ButtonLogout.inject(ListElm);
                    },
                    onSubmitSecondary: function () {
                        this.close();
                    }
                }
            })
        },

        createMobileUserSettings: function (Background) {
            return new Promise(function (resolve) {
                require([
                    'package/quiqqer/frontend-users/bin/frontend/controls/profile/Profile'
                ], function (User) {
                    new Panel({
                        title                  : QUILocale.get('sequry/template',
                            'sequry.usermenu.entrysettings.title'),
                        subTitle               : QUIQQER_USER.name,
                        width                  : 400,
                        direction              : 'left',
                        iconHeaderButton       : QUILocale.get('sequry/template', 'sequry.panel.button.close'),
                        iconHeaderButtonFaClass: 'fa fa-close',
                        Background             : Background,
                        isOwner                : true,
                        events                 : {
                            onAfterCreate: function (PanelControl) {
                                PanelControl.getElm().addClass('user-settings-panel');
                                resolve(PanelControl);
                            },
                            onOpen       : function (PanelControl) {
                                new User({
                                    windowHistory: false
                                }).inject(PanelControl.getContent());

                            },
                            onSubmitSecondary: function () {
                                this.close();
                            }
                        }
                    }).create();
                });
            })

        }
    });
});