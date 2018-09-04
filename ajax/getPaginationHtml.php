<?php

/**
 * Get HTML of Pagination Control
 *
 * @return array
 */

QUI::$Ajax->registerFunction(
    'package_sequry_template_ajax_getPaginationHtml',
    function () {

        $Pagination = new QUI\Controls\Navigating\Pagination();



        $Pagination->setAttribute('limit', 4);
        $Pagination->setAttribute('sheets', 10);

        \QUI\System\Log::writeRecursive('----------------------------------');
        \QUI\System\Log::writeRecursive($Pagination);
        \QUI\System\Log::writeRecursive('----------------------------------');

//        return $Pagination->create();


        /*try {

            $Pagination = new QUI\Controls\Navigating\Pagination();

            $Pagination->setAttribute('limit', 4);
            $Pagination->setAttribute('sheets', 10);

            \QUI\System\Log::writeRecursive('----------------------------------');
            \QUI\System\Log::writeRecursive($Pagination);
            \QUI\System\Log::writeRecursive('----------------------------------');

            return $Pagination->create();
        } catch (\QUI\Exception $Exception) {

            $L  = QUI::getLocale();
            $lg = 'sequry/template';

            \QUI\System\Log::writeException($Exception);

            return getErrorMessageTemplate(
                $L->get($lg, 'sequry.panel.template.passwordTypeNotSupported')
            );
        }*/
    },
    false
);