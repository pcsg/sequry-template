<?php

/**
 * Get HTML of Pagination Control
 *
 * @return array
 */

QUI::$Ajax->registerFunction(
    'package_sequry_template_ajax_getPaginationHtml',
    function ($sheets) {

        $Pagination = new QUI\Controls\Navigating\Pagination([
            'Site'      => QUI::getRewrite()->getSite(),
            'useAjax'   => true,
            'sheets'    => $sheets,
            'showLimit' => true,
            'limits'    => '[2,5,6,7]',
            'limit'     => 5
        ]);

        try {
            $html = $Pagination->create();
        } catch (\Exception $Exception) {
            QUI\System\Log::writeException($Exception);

            return false;
        }

        $result = QUI\Control\Manager::getCSS();
        $result .= $html;

        return QUI\Output::getInstance()->parse($result);
    },
    ['sheets'],
    false
);