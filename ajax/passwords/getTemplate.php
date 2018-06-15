<?php

use Sequry\Core\PasswordTypes\Handler;

/**
 *
 * @return array
 */

QUI::$Ajax->registerFunction(
    'package_sequry_template_ajax_passwords_getTemplate',
    function ($type) {

        // this template name
        $layout = 'core';

        return Handler::getEditTemplateFrontend($type, $layout);
    },
    ['type'],
    false
);
