(function () {
    var UserContainer = document.getElement('.header-user-avatar');

    var UserIcon = document.getElement(
        '[data-qui="package/quiqqer/frontend-users/bin/frontend/controls/UserIcon"]'
    );

    var SequryHeader = document.getElement(
        '[data-qui="package/sequry/template/bin/js/controls/components/Header"]'
    );

    // auto open settings (for development)
    /*require(['Locale'], function(QUILocale) {
        openUserMenu(QUILocale);
    });*/

    if (UserIcon) {
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
                        icon: 'fa fa-cog',
                        text: QUILocale.get('sequry/template', 'sequry.usermenu.entrysettings.title'),
                        events: {
                            click: function() {
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

    if (SequryHeader) {
        SequryHeader.addEvent('load', function () {
            var Control = QUI.Controls.getById(SequryHeader.get('data-quiid'));
            UserContainer.setStyles({
                display : null,
                position: 'relative'
            });

            Control.appendChild(UserContainer);
        });
    }


    // password link site
    var PasswordLink = document.getElement('.passwordlink-box');

    if (PasswordLink) {
        var PasswordLinkInput = PasswordLink.getElement('input.passwordlink-box-fieldset-input');
        if (PasswordLinkInput) {
            PasswordLinkInput.focus();
        }
    }

    /**
     * Open user menu
     */
    function openUserMenu(QUILocale) {
        require([
            'package/sequry/template/bin/js/controls/panels/Panel',
            'package/quiqqer/frontend-users/bin/frontend/controls/profile/Profile'
        ], function(Panel, UserPanel) {
            var PasswordPanel = new Panel({
                title: QUILocale.get('sequry/template', 'sequry.usermenu.entrysettings.title'),
                subTitle: QUIQQER_USER.name,
                width: 1000,
                iconHeaderButton: QUILocale.get('sequry/template', 'sequry.panel.button.close'),
                iconHeaderButtonFaClass: 'fa fa-close',
                isOwner: true,
                events: {
                    onOpen: function (PanelControl) {
                        PanelControl.getElm().addClass('user-settings-panel');

                        var UserPanelControl = new UserPanel();

                        UserPanelControl.inject(PanelControl.getContent())
                    },
                    onSubmitSecondary: function () {
                        this.close();
                    }
                }
            });

            PasswordPanel.open();
        })
    }

    // test - öffne password create automatisch
    /*var AddPassword = document.getElement(
        '[data-qui="package/sequry/template/bin/js/controls/main/List"]'
    );
    AddPassword.addEvent('load', function () {
        var Control = QUI.Controls.getById(AddPassword.get('data-quiid'));
        Control.getElm().getElement('.button-add-password').click();
    })*/

})();