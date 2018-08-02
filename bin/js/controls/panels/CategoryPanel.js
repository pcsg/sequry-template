/**
 * Panel control to create a new password.
 * It inherits from Panel.js
 *
 * @module package/sequry/template/bin/js/controls/panels/CategoryPanel
 * @author www.pcsg.de (Michael Danielczok)
 */
define('package/sequry/template/bin/js/controls/panels/CategoryPanel', [

    'qui/QUI',
    'qui/controls/Control',
    'Ajax',
    'Locale',

    'package/sequry/template/bin/js/controls/panels/Panel'

], function (
    QUI,
    QUIControl,
    QUIAjax,
    QUILocale,
    Panel
) {
    "use strict";

    var lg = 'sequry/template';

    return new Class({

        Extends: Panel,
        Type   : 'package/sequry/template/bin/js/controls/panels/CategoryPanel',

        Binds: [
            '$onSubmit',
            '$openBegin',
            '$onOpen'
        ],

        options: {
            title       : false,
            actionButton: QUILocale.get(lg, 'sequry.panel.button.ok'),
            closeButton : QUILocale.get(lg, 'sequry.panel.button.cancel'),
            mode        : 'create',
            passwordId  : false
        },

        initialize: function (options) {
            this.parent(options);

            this.$Password = null;
            this.$PasswordData = null;

            // panel events
            this.addEvents({
                onOpen     : this.$onOpen,
                onOpenBegin: this.$openBegin,
                onSubmit   : this.$onSubmit,
                onFinish   : this.$onFinish
            });
        },

        /**
         * event: on open
         * integrate password
         */
        $onOpen: function () {
            var self = this;

console.log(this.$Elm);
            self.Loader.hide();

            // action button - ok
            if (this.getAttribute('actionButton')) {
                this.createActionButton(
                    this.getAttribute('actionButton')
                )
            }

            // close button
            if (this.getAttribute('closeButton')) {
                this.createCloseButton(this.getAttribute('closeButton'))
            }
        },

        /**
         * event:on open begin
         * Let the loader display before the animation starts
         */
        $openBegin: function () {
            this.Loader.show();
        },

        /**
         * event: on submit form
         */
        $onSubmit: function () {
            var self = this;



            self.fireEvent('finish');
        },

        /**
         * Depend on mode (edit or create new password) execute the right function
         *
         * @return {Promise}
         */
        submitAction: function () {
            if (this.getAttribute('mode') === 'edit') {
                return Passwords.editPassword(
                    this.getAttribute('passwordId'),
                    this.$PasswordData
                )
            }

            return Passwords.createPassword(
                this.$PasswordData
            )
        },

        /**
         * Prevent accidentally closing the panel
         */
        confirmClose: function () {
            var self      = this,
                title     = QUILocale.get(lg, 'sequry.customPopup.confirm.create.title'),
                content   = QUILocale.get(lg, 'sequry.customPopup.confirm.create.content'),
                btnOk     = QUILocale.get(lg, 'sequry.customPopup.confirm.create.button.ok'),
                btnCancel = QUILocale.get(lg, 'sequry.customPopup.confirm.create.button.cancel');

            var confirmContent = '<span class="fa fa-times popup-icon"></span>';
            confirmContent += '<span class="popup-title">' + title + '</span>';
            confirmContent += '<p class="popup-content">' + content + '</p>';

            require(['qui/controls/windows/Confirm'], function (QUIConfirm) {
                var Popup = new QUIConfirm({
                    'class'           : 'sequry-customPopup',
                    maxWidth          : 400, // please note extra styling in style.css
                    backgroundClosable: false,
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
                        onSubmit: self.close
                    }
                });

                Popup.open();
            })
        }
    });
});