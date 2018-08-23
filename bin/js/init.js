(function () {
    var UserContainer = document.getElement('.header-user-avatar');

    var UserIcon = document.getElement(
        '[data-qui="package/quiqqer/frontend-users/bin/frontend/controls/UserIcon"]'
    );

    var SequryHeader = document.getElement(
        '[data-qui="package/sequry/template/bin/js/controls/components/Header"]'
    );

    require([
        'package/sequry/template/bin/js/controls/panels/Panel',
        'package/quiqqer/frontend-users/bin/frontend/controls/profile/Profile'
    ], function(Panel, UserPanel) {
        var PasswordPanel = new Panel({
            title: "Einstellungen",
            subTitle: "admin",
            width: '100%',
            events: {
                onOpen: function (PanelControl) {
                    console.log(PanelControl)
                    PanelControl.getElm().addClass('aaaaaaaaaaaaa');

                    var UserPanelControl = new UserPanel();

                    UserPanelControl.inject(PanelControl.getContent())
                }
            }
        });

        PasswordPanel.open();
    })

    if (UserIcon) {


        UserIcon.addEvent('load', function () {
            var Control = QUI.Controls.getById(UserIcon.get('data-quiid'));
            var Menu = Control.$Menu;

            require([
                'qui/controls/contextmenu/Item',
                'qui/controls/contextmenu/Separator'
            ], function (Item, Separator) {
                Menu.appendChild(
                    new Item({
                        icon: 'fa fa-home',
                        text: 'Profil Einstellungen',
                        events: {
                            click: function() {
                                require(['package/sequry/template/bin/js/controls/panels/Panel'], function(Panel) {
                                    var PasswordPanel = new Panel({
                                        title: "Einstellungen",
                                        subTitle: "admin",
                                        width: '100%',
                                        events: {
                                            onOpen: function () {
                                                console.log("huhu hu hu")
                                            }
                                        }
                                    });

                                    PasswordPanel.open();
                                })
                                console.log("Profil Einstellungen")
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

    // test - öffne password create automatisch
    /*var AddPassword = document.getElement(
        '[data-qui="package/sequry/template/bin/js/controls/main/List"]'
    );
    AddPassword.addEvent('load', function () {
        var Control = QUI.Controls.getById(AddPassword.get('data-quiid'));
        Control.getElm().getElement('.button-add-password').click();
    })*/

})();