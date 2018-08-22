(function () {
    var UserContainer = document.getElement('.header-user-avatar');

    var UserIcon = document.getElement(
        '[data-qui="package/quiqqer/frontend-users/bin/frontend/controls/UserIcon"]'
    );

    var SequryHeader = document.getElement(
        '[data-qui="package/sequry/template/bin/js/controls/components/Header"]'
    );

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
                        text: 'huhu'
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
        PasswordLink.getElement('input.passwordlink-box-fieldset-input').focus();
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