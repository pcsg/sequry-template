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
    'package/sequry/core/bin/controls/categories/private/Map',

    'css!package/sequry/template/bin/js/controls/panels/CategoryPanel.css'

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
            '$onAfterCreate',
            '$onSubmit',
            '$openBegin',
            '$onOpen'
        ],

        options: {
            title                : QUILocale.get(lg, 'sequry.panel.category.title'),
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
                onAfterCreate: this.$onAfterCreate,
                onOpen       : this.$onOpen,
                onOpenBegin  : this.$openBegin,
                onSubmit     : this.$onSubmit,
                onFinish     : this.$onFinish
            });
        },

        $onAfterCreate: function () {
            this.$Elm.addClass('category-panel');
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
                    'class': 'panel-category-container panel-category-public'
                });

                this.CatPublic = new CategoryMap({
                    editMode: false,
                    // todo @michael später direkt nach dem Klick filtern?
                    events  : {
                        onCategorySelect: function (catId) {
                            this.getCategory(catId).then(function (Category) {
                                /**
                                 * Category = {
                                 *     id: int,
                                 *     title: 'string'
                                 * }
                                 */
                                self.fireEvent('selectPublic', Category)
                            })
                        }
                    }
                });

                this.CatPublic.inject(PublicContainer);
                PublicContainer.inject(Content);
            }

            // private categories
            if (this.getAttribute('showPrivateCategories')) {

                PrivateContainer = new Element('div', {
                    'class': 'panel-category-container panel-category-private',
                    html   : '<h4>' + QUILocale.get(lg, 'sequry.panel.category.private.title')
                        + '</h4>'
                });

                this.CatPrivate = new CategoryMapPrivate({
                    editMode: false,
                    // todo @michael später direkt nach dem Klick filtern?
                    events  : {
                        onCategorySelect: function (catId) {
                            this.getCategory(catId).then(function (Category) {
                                /**
                                 * Category = {
                                 *     id: int,
                                 *     title: 'string'
                                 * }
                                 */
                                self.fireEvent('selectPrivate', Category);
                            })
                        }
                    }
                });

                this.CatPrivate.inject(PrivateContainer);
                PrivateContainer.inject(Content);
            }


            self.Loader.hide();
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
         *
         * Returns category ids
         *
         * CatIds: {
         *     public: ["1", "8", "15"],
         *     private: ["3", "13",]
         * }
         */
        $onSubmit: function () {
            var CatIds = {
                public : this.CatPublic.getSelectedCategoryIds(),
                private: this.CatPrivate.getSelectedCategoryIds()
            };

            this.fireEvent('finish', CatIds);
        }
    });
});