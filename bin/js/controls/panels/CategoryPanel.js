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

    'package/sequry/template/bin/js/controls/panels/Panel',
    'package/sequry/core/bin/controls/categories/public/Map',
    'package/sequry/core/bin/controls/categories/private/Map'

], function (
    QUI,
    QUIControl,
    QUIAjax,
    QUILocale,
    Panel,
    CategoryMap,
    CategoryMapPrivate
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
            title                : false,
            actionButton         : QUILocale.get(lg, 'sequry.panel.button.ok'),
            closeButton          : QUILocale.get(lg, 'sequry.panel.button.cancel'),
            showPublicCategories : true,
            showPrivateCategories: true
        },

        initialize: function (options) {
            this.parent(options);

            this.CatPublic = null;
            this.CatPrivate = null;

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
            var self             = this,
                PublicContainer  = null,
                PrivateContainer = null,
                Content          = this.getContent();

            // public categories
            if (this.getAttribute('showPublicCategories')) {

                PublicContainer = new Element('div', {
                    'class': 'panel-category-container panel-category-public',
                    html   : '<h3>' + 'Kategorien' + '</h3>'
                });

                this.CatPublic = new CategoryMap({
                    editMode: false,
                    events  : {
                        onCategorySelect: function (catId) {
                            console.log(catId)
                        }
                    }
                });

                this.CatPublic.inject(PublicContainer);
                PublicContainer.inject(Content);
            }

            // private categories
            if (this.getAttribute('showPublicCategories')) {

                PrivateContainer = new Element('div', {
                    'class': 'panel-category-container panel-category-private',
                    html   : '<h3>' + 'Kategorien (persönlich)' + '</h3>'
                });

                this.CatPrivate = new CategoryMapPrivate({
                    editMode: false,
                    events  : {
                        onCategorySelect: function (catId) {
                            console.log(catId)
                        }
                    }
                });

                this.CatPrivate.inject(PrivateContainer);
                PrivateContainer.inject(Content);
            }


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
            var CatIds = {
                public: this.CatPublic.getSelectedCategoryIds(),
                private: this.CatPrivate.getSelectedCategoryIds()
            };

            this.fireEvent('finish', CatIds);
        }
    });
});