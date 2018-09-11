document.addEvent('domready', function () {
    var PasswordLink = document.getElement(
        '.passwordlink-box'
    );

    var Login = document.getElement(
        '[data-qui="controls/users/Login"]'
    );

    // password link site
    if (PasswordLink) {
        var PasswordLinkInput = PasswordLink.getElement('input.passwordlink-box-fieldset-input');
        if (PasswordLinkInput) {
            PasswordLinkInput.focus();
        }
        return;
    }

    // login site
    if (Login) {
        Login.addEvent('load', function () {
            var LoginWrapper = document.getElement('.login-page-box'),
                Control      = QUI.Controls.getById(Login.get('data-quiid')),
                labels       = Control.getElm().getElements('label');

            for (var i = 0, len = labels.length; i < len; i++) {
                var text  = labels[i].getElement('span').get('html'),
                    input = labels[i].getElement('input');

                input.set('placeholder', text);
            }

            moofx(LoginWrapper).animate({
                opacity  : 1,
                transform: 'translateY(0)'
            });
        });

        return;
    }

    var UserIcon = document.getElement(
        '[data-qui="package/quiqqer/frontend-users/bin/frontend/controls/UserIcon"]'
    );
    if (UserIcon) {
        // auto open settings (for development)
        require(['Locale'], function (QUILocale) {
//            openUserMenu(QUILocale);
        });

        UserIcon.addEvent('load', function () {
            var Control = QUI.Controls.getById(UserIcon.get('data-quiid'));
            var Menu = Control.$Menu;

            require([
                'Locale',
                'qui/controls/contextmenu/Item',
                'qui/controls/contextmenu/Separator'
            ], function (QUILocale, Item, Separator) {
                Menu.appendChild(
                    new Item({
                        icon  : 'fa fa-cog',
                        text  : QUILocale.get('sequry/template', 'sequry.usermenu.entrysettings.title'),
                        events: {
                            click: function () {
                                openUserMenu(QUILocale);
                            }
                        }
                    })
                );
            });

            Control.addEvent('onMenuShow', function (UserIconControl, MenuNode) {
                MenuNode.setStyles({
                    left : null,
                    right: -15
                });
            });
        });
    }

    // load sequry
    require([
        'qui/QUI',
        'package/sequry/template/bin/js/controls/components/Header',
        'package/sequry/template/bin/js/controls/components/Menu',
        'package/sequry/template/bin/js/controls/main/List'
    ], function (QUI, Header, Menu, List) {
        var Wrapper         = document.getElement('.sequry-page-wrapper'),
            LoaderContainer = document.getElement('.sequry-loader');

        var headerLoaded = false,
            menuLoaded   = false,
            mainLoaded   = false;

        var isLoaded = function () {
            if (headerLoaded && menuLoaded && mainLoaded) {
                // loader hide
                Wrapper.setStyle('display', null);

                moofx(LoaderContainer).animate({
                    opacity: 0
                }, {
                    callback: function () {
                        LoaderContainer.destroy();
                    }
                })
            }
        };

        new Header({
            events: {
                onLoad: function (SequryHeader) {
                    var UserContainer = document.getElement('.header-user-avatar');

                    UserContainer.setStyles({
                        display : null,
                        position: 'relative'
                    });

                    UserContainer.inject(SequryHeader.getElm());

                    headerLoaded = true;
                    isLoaded();
                }
            }
        }).inject(Wrapper);

        new Menu({
            events: {
                onLoad: function () {
                    menuLoaded = true;
                    isLoaded();
                }
            }
        }).inject(Wrapper);

        new List({
            events: {
                onLoad: function () {
                    mainLoaded = true;
                    isLoaded();
                }
            }
        }).inject(Wrapper);
    });

    /**
     * Open user menu
     */
    function openUserMenu (QUILocale) {
        require([
            'package/sequry/template/bin/js/controls/panels/Panel',
            'package/quiqqer/frontend-users/bin/frontend/controls/profile/Profile'
        ], function (Panel, User) {
            var SettingsPanel = new Panel({
                title                  : QUILocale.get('sequry/template', 'sequry.usermenu.entrysettings.title'),
                subTitle               : QUIQQER_USER.name,
                width                  : 1000,
                iconHeaderButton       : QUILocale.get('sequry/template', 'sequry.panel.button.close'),
                iconHeaderButtonFaClass: 'fa fa-close',
                isOwner                : true,
                events                 : {
                    onOpenBegin      : function (PanelControl) {
                        PanelControl.getElm().addClass('user-settings-panel');
                    },
                    onOpen           : function (PanelControl) {
                        new User({
                            windowHistory: false
                        }).inject(PanelControl.getContent());

                    },
                    onSubmitSecondary: function () {
                        this.close();
                    }
                }
            });

            SettingsPanel.open();
        })
    }


    // register service worker for pwa
    if ('serviceWorker' in navigator) {
        if (navigator.serviceWorker.controller) {
            // A ServiceWorker controls the site on load and therefor can handle offline
            // fallback.
        } else {
            // console.log('DEBUG: Service Worker start register');
            navigator.serviceWorker.register(
                URL_OPT_DIR + 'sequry/template/bin/js/sw/worker.php',
                {scope: '/'}
            ).then(function () {
                // Success
            }).catch(function (e) {
                // Fail :(
                console.error(e);
            });
        }
    }

    function isTouchDevice() {
        // thanks -> https://stackoverflow.com/questions/4817029/whats-the-best-way-to-detect-a-touch-screen-device-using-javascript/4819886#4819886
        return 'ontouchstart' in window        // works on most browsers
            || navigator.maxTouchPoints;       // works on IE10/11 and Surface
    }

});