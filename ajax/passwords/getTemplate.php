<?php

/**
 *
 * @return array
 */

QUI::$Ajax->registerFunction(
    'package_sequry_template_ajax_passwords_getTemplate',
    function ($type) {

        \QUI\System\Log::writeRecursive('-----------------------------------');
        \QUI\System\Log::writeRecursive($type);
        \QUI\System\Log::writeRecursive('-----------------------------------');

        return true;
    },
    ['type'],
    false
);
