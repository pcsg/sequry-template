<?php

/**
 * Get HTML of Pagination Control
 *
 * @return array
 */

QUI::$Ajax->registerFunction(
    'package_sequry_template_ajax_getPaginationHtml',
    function ($total, $perPage, $currentPage) {

        $total = intval($total);

        if ($total == 0) {
            $total = 1;
        }

        $Pagination = new QUI\Controls\Navigating\Pagination([
            'Site'      => QUI::getRewrite()->getSite(),
            'useAjax'   => true,
            'count'     => $total,
            'showLimit' => true,
            'limits'    => '[10, 25, 50, 100]',
            'limit'     => $perPage,
            'sheet' => $currentPage
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
    ['total', 'perPage', 'currentPage'],
    false
);